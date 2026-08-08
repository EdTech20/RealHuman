import os
import uuid
import asyncio
import traceback
import aiohttp
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from livekit.api import AccessToken, VideoGrants

from agent import run_agent

load_dotenv()

_event_loop: asyncio.AbstractEventLoop | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _event_loop
    _event_loop = asyncio.get_event_loop()
    print("[Server] 🟢 FastAPI started — event loop captured")
    yield
    print("[Server] 🔴 FastAPI shutting down")


app = FastAPI(title="RealHuman API", lifespan=lifespan)

from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Unhandled Exception on {request.url}: {exc}")
    import traceback
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error: {str(exc)}"},
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ProjectCreateRequest(BaseModel):
    projectName: str
    projectType: str
    systemPrompt: str


# ── Anam session token endpoint ──────────────────────────────────────────────
# The frontend calls this to exchange our server-side API key for a short-lived
# Anam session token that it can safely use with the JS SDK directly in the browser.
@app.post("/api/anam/session-token")
async def get_anam_session_token(request: Request):
    import re
    anam_api_key = re.sub(r'[\x00-\x1F\x7F]', '', os.getenv("ANAM_API_KEY", ""))
    if not anam_api_key:
        raise HTTPException(status_code=500, detail="Anam API Key not configured.")

    # Accept an optional systemPrompt from the frontend to override the persona's default
    body = {}
    try:
        body = await request.json()
    except Exception:
        pass
    system_prompt = body.get("systemPrompt", "").strip()

    # Use a fully inline personaConfig so the user's system prompt completely
    # replaces the saved persona instructions. personaId alone would load the
    # saved prompt and only partially override it.
    persona_config = {
        "name": "Emma",
        "avatarId": "290ef1d5-9201-40f4-8c88-394a6317f10d",  # Evelyn
        "avatarModel": "cara-4",
        "voiceId": "04965b9e-ff4c-4b54-a4dc-fba6e458c760",  # Astrid
        "llmId": "a7cf662c-2ace-4de1-a21e-ef0fbf144bb7",  # GPT OSS 120B
        "systemPrompt": system_prompt if system_prompt else (
            "You are Emma, a helpful AI assistant. Be friendly and concise."
        ) + "\n\nIMPORTANT: Always respond in English only, regardless of what language the user speaks.",
    }

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://api.anam.ai/v1/auth/session-token",
                headers={
                    "Authorization": f"Bearer {anam_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "personaConfig": persona_config
                },
            ) as resp:
                if resp.status != 200:
                    body_text = await resp.text()
                    raise HTTPException(status_code=resp.status, detail=f"Anam API error: {body_text}")
                data = await resp.json()
                return {"sessionToken": data.get("sessionToken")}
    except aiohttp.ClientError as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Project / LiveKit room creation ──────────────────────────────────────────
@app.post("/api/projects/create")
async def create_project(request: ProjectCreateRequest):
    try:
        room_name            = f"room-{uuid.uuid4().hex[:8]}"
        participant_identity = f"user-{uuid.uuid4().hex[:8]}"

        import re
        api_key     = re.sub(r'[\x00-\x1F\x7F]', '', os.getenv("LIVEKIT_API_KEY", ""))
        api_secret  = re.sub(r'[\x00-\x1F\x7F]', '', os.getenv("LIVEKIT_API_SECRET", ""))
        livekit_url = re.sub(r'[\x00-\x1F\x7F]', '', os.getenv("LIVEKIT_URL", ""))
        if not api_key or not api_secret or not livekit_url:
            raise ValueError("LiveKit credentials not configured in environment.")

        token = (
            AccessToken(api_key, api_secret)
            .with_identity(participant_identity)
            .with_name("User")
            .with_grants(VideoGrants(room_join=True, room=room_name))
            .to_jwt()
        )

        dynamic_prompt = (
            f"You are a helpful AI representing the project '{request.projectName}', "
            f"which is of type '{request.projectType}'.\n"
            f"Instructions:\n{request.systemPrompt}"
        )

        async def launch():
            print(f"[Agent] 🟢 Pipeline starting for room: {room_name}")
            try:
                await run_agent(room_name, dynamic_prompt)
            except Exception:
                print(f"[Agent] ❌ Pipeline crashed:\n{traceback.format_exc()}")

        asyncio.create_task(launch())
        print(f"[Server] ✅ Agent task scheduled for room: {room_name}")

        return {
            "status": "success",
            "room_name": room_name,
            "roomUrl": livekit_url,
            "token": token,
            "message": "Project created and agent provisioned successfully.",
        }

    except Exception as e:
        print(f"[API] ❌ Error:\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
