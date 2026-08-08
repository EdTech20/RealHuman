import os
import asyncio
from dotenv import load_dotenv

from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.runner import PipelineRunner
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.processors.aggregators.llm_context import LLMContext
from pipecat.processors.aggregators.llm_response_universal import LLMContextAggregatorPair
from pipecat.services.deepgram.stt import DeepgramSTTService
from pipecat.services.deepgram.tts import DeepgramTTSService
from pipecat.services.openrouter.llm import OpenRouterLLMService
from pipecat.transports.livekit.transport import LiveKitParams, LiveKitTransport
from livekit.api import AccessToken, VideoGrants

from pipecat_anam import AnamVideoService
from anam import PersonaConfig

load_dotenv()


async def run_agent(room_name: str, system_prompt: str):
    print(f"[Agent] 🚀 Spinning up Anam AI agent for room: {room_name}")

    # ── Credentials ──────────────────────────────────────────────────────────────
    livekit_api_key    = os.getenv("LIVEKIT_API_KEY")
    livekit_api_secret = os.getenv("LIVEKIT_API_SECRET")
    livekit_url        = os.getenv("LIVEKIT_URL")
    deepgram_api_key   = os.getenv("DEEPGRAM_API_KEY")
    openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
    anam_api_key       = os.getenv("ANAM_API_KEY")
    anam_avatar_id     = os.getenv("ANAM_AVATAR_ID")

    missing = [
        name for name, val in {
            "LIVEKIT_API_KEY":    livekit_api_key,
            "LIVEKIT_API_SECRET": livekit_api_secret,
            "LIVEKIT_URL":        livekit_url,
            "DEEPGRAM_API_KEY":   deepgram_api_key,
            "OPENROUTER_API_KEY": openrouter_api_key,
            "ANAM_API_KEY":       anam_api_key,
            "ANAM_AVATAR_ID":     anam_avatar_id,
        }.items()
        if not val
    ]
    if missing:
        print(f"[Agent] ❌ Missing environment variables: {', '.join(missing)}. Cannot start.")
        return

    print(f"[Agent] ✅ All credentials loaded. Avatar ID: {anam_avatar_id}")

    # ── LiveKit agent token ───────────────────────────────────────────────────────
    agent_token = (
        AccessToken(livekit_api_key, livekit_api_secret)
        .with_identity(f"agent-{room_name}")
        .with_name("Emma")
        .with_grants(VideoGrants(room_join=True, room=room_name))
        .to_jwt()
    )

    # ── Transport ─────────────────────────────────────────────────────────────────
    # LiveKit carries user mic inbound and Anam's A/V (video + synced audio) outbound.
    transport = LiveKitTransport(
        url=livekit_url,
        token=agent_token,
        room_name=room_name,
        params=LiveKitParams(
            audio_out_enabled=True,   # Anam synthesised voice   → room
            video_out_enabled=True,   # Anam lipsync video       → room
            audio_in_enabled=True,    # User microphone          ← room
        ),
    )
    print(f"[Agent] 🔌 LiveKit transport configured → {livekit_url} / room: {room_name}")

    # ── STT: Deepgram nova-2 ──────────────────────────────────────────────────────
    stt = DeepgramSTTService(
        api_key=deepgram_api_key,
        model="nova-2",
    )
    print("[Agent] 🎙️  Deepgram STT (nova-2) ready")

    # ── LLM: Cohere command-r+ via OpenRouter ─────────────────────────────────────
    llm = OpenRouterLLMService(
        api_key=openrouter_api_key,
        settings=OpenRouterLLMService.Settings(model="cohere/command-r-plus-08-2024"),
    )
    print("[Agent] 🧠 Cohere command-r+ LLM (via OpenRouter) ready")

    # ── TTS: Deepgram Aura — feeds TTSAudioRawFrames to Anam ─────────────────────
    # AnamVideoService consumes TTSStartedFrame / TTSAudioRawFrame / TTSStoppedFrame
    # produced by any pipecat TTS service.  It uses those raw PCM frames to drive
    # real-time lip-sync on the avatar, then emits OutputImageRawFrame (video) and
    # SpeechOutputAudioRawFrame (audio) downstream into LiveKit.
    tts = DeepgramTTSService(
        api_key=deepgram_api_key,
        settings=DeepgramTTSService.Settings(voice="aura-asteria-en"),
    )
    print("[Agent] 🔊 Deepgram TTS (aura-asteria-en) ready — will feed audio to Anam")

    # ── Anam video service ────────────────────────────────────────────────────────
    # enable_audio_passthrough=True  →  avatar is animated from the TTS PCM audio
    # produced upstream (Deepgram TTS), rather than Anam generating its own voice.
    persona_config = PersonaConfig(
        persona_id=anam_avatar_id,
        enable_audio_passthrough=True,
    )
    anam_video = AnamVideoService(
        api_key=anam_api_key,
        persona_config=persona_config,
        api_base_url="https://api.anam.ai",
        api_version="v1",
        # Public STUN servers let Anam's WebRTC peer connection traverse NAT
        # when the backend runs on a local machine without a public IP.
        ice_servers=[
            {"urls": "stun:stun.l.google.com:19302"},
            {"urls": "stun:stun1.l.google.com:19302"},
            {"urls": "stun:stun2.l.google.com:19302"},
        ],
    )
    print(f"[Agent] 🎬 Anam video service ready — avatar_id={anam_avatar_id}")

    # ── Context / conversation history ────────────────────────────────────────────
    messages = [{"role": "system", "content": system_prompt}]
    context = LLMContext(messages)
    context_aggregator = LLMContextAggregatorPair(context)

    # ── Pipeline ──────────────────────────────────────────────────────────────────
    # Data flow:
    #
    #  transport.input()           raw PCM mic bytes from the user over LiveKit WebRTC
    #  → DeepgramSTTService        streaming speech-to-text  →  TranscriptionFrame
    #  → context_aggregator.user() appends transcription to chat history
    #  → OpenRouterLLMService      Cohere command-r+ generates text token stream
    #  → DeepgramTTSService        converts tokens → TTSAudioRawFrames (PCM audio)
    #  → AnamVideoService          consumes PCM audio → drives avatar lip-sync
    #                              emits OutputImageRawFrame (video) +
    #                                     SpeechOutputAudioRawFrame (audio)
    #  → transport.output()        publishes both A/V tracks into the LiveKit room
    #  → context_aggregator.assistant() saves the assistant turn to chat history
    pipeline = Pipeline(
        [
            transport.input(),
            stt,
            context_aggregator.user(),
            llm,
            tts,
            anam_video,
            transport.output(),
            context_aggregator.assistant(),
        ]
    )
    print("[Agent] 🔗 Pipeline: input → STT → context → LLM → TTS → Anam → output → context")

    task = PipelineTask(
        pipeline,
        params=PipelineParams(
            enable_metrics=True,
        ),
    )

    # ── Connection event ──────────────────────────────────────────────────────────
    @transport.event_handler("on_participant_connected")
    async def on_participant_connected(transport, participant):
        print(
            f"[Agent] ✅ Participant joined: {participant} "
            f"| Room: {room_name} | Pipeline is live."
        )

    # ── Run ───────────────────────────────────────────────────────────────────────
    runner = PipelineRunner()
    print(f"[Agent] ▶️  Connecting to LiveKit room: {room_name} ...")
    try:
        await runner.run(worker=task)
    except Exception as e:
        print(f"[Agent] ❌ Fatal pipeline error in room {room_name}: {e}")
    finally:
        print(f"[Agent] 🏁 Pipeline finished for room: {room_name}")
