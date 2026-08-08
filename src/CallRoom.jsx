import React, { useEffect, useRef, useState } from 'react';
import { createClient } from '@anam-ai/js-sdk';
import { Room, RoomEvent, setLogLevel } from 'livekit-client';
import './CallRoom.css';

setLogLevel('error');

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const MicOffIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="2" y1="2" x2="22" y2="22" />
    <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
    <path d="M5 10v2a7 7 0 0 0 12 5" />
    <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
    <line x1="12" y1="19" x2="12" y2="22" />
  </svg>
);
const MicOnIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
  </svg>
);
const VideoOffIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);
const VideoOnIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

export default function CallRoom({ roomUrl, token, projectName, systemPrompt, onEndCall }) {
  const videoRef       = useRef(null);  // Emma's avatar video
  const localVideoRef  = useRef(null);  // user's own camera PiP
  const localStreamRef = useRef(null);  // user's MediaStream
  const anamClientRef  = useRef(null);
  const liveKitRoom    = useRef(null);
  const didInitRef     = useRef(false);

  const [status,    setStatus]    = useState('connecting');
  const [phase,     setPhase]     = useState('black'); // black | blur | live
  const [isMicOn,   setIsMicOn]   = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [pipHovered, setPipHovered] = useState(false);
  const [error,     setError]     = useState(null);
  const phaseTimers = useRef([]);

  // Phase sequence: 1s black → 2s blur → live
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('blur'), 1000);
    const t2 = setTimeout(() => {
      setPhase('live');
      setStatus('live');
    }, 3000);
    phaseTimers.current = [t1, t2];
    return () => phaseTimers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    startSession();
    return () => cleanup();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cleanup = () => {
    phaseTimers.current.forEach(clearTimeout);
    try { anamClientRef.current?.stopStreaming(); } catch (_) {}
    try {
      if (liveKitRoom.current?.state === 'connected') liveKitRoom.current.disconnect();
    } catch (_) {}
    stopLocalCamera();
  };

  const stopLocalCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
  };

  const startSession = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const tokenRes = await fetch(`${apiUrl}/api/anam/session-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt: systemPrompt || '' }),
      });
      if (!tokenRes.ok) throw new Error('Failed to get Anam session token');
      const { sessionToken } = await tokenRes.json();

      const anamClient = createClient(sessionToken);
      anamClientRef.current = anamClient;

      anamClient.addListener('MIC_PERMISSION_GRANTED', () => {
        console.log('[Anam] Mic permission granted — Emma can hear you');
      });
      anamClient.addListener('MIC_PERMISSION_DENIED', (err) => {
        console.error('[Anam] Mic permission denied:', err);
        setError('Microphone permission denied. Please allow mic access and reload.');
        setStatus('error');
      });
      anamClient.addListener('INPUT_AUDIO_STREAM_STARTED', () => {
        console.log('[Anam] Mic input stream active — Emma is listening');
      });
      anamClient.addListener('CONNECTION_ESTABLISHED', () => {
        console.log('[Anam] Connected');
      });
      anamClient.addListener('VIDEO_PLAY_STARTED', () => {
        console.log('[Anam] Video playing');
      });
      anamClient.addListener('CONNECTION_CLOSED', (code) => {
        console.log('[Anam] Closed:', code);
        if (typeof code === 'string' && code.toLowerCase().includes('limit')) {
          setError('Concurrency limit reached — please end other active sessions.');
          setStatus('error');
        }
      });

      // Use streamToVideoElement — this method handles audio output internally
      // AND keeps mic capture active so Emma can hear the user.
      // We attach audio separately via the real audioRef element.
      await anamClient.streamToVideoElement('anam-video');
      console.log('[Anam] Streaming started — mic active, Emma is listening');

      // LiveKit — kept for future pipeline use, camera/mic not routed there
      const room = new Room();
      liveKitRoom.current = room;
      room.on(RoomEvent.Connected, () => console.log('[LiveKit] Connected'));
      await room.connect(roomUrl, token);
      await room.localParticipant.setMicrophoneEnabled(false);
      await room.localParticipant.setCameraEnabled(false);

    } catch (err) {
      console.error('[CallRoom] Error:', err);
      setError(err.message || 'Failed to start session.');
      setStatus('error');
    }
  };

  // ── Mic toggle — controlled via Anam SDK ──────────────────────────────────
  const toggleMic = () => {
    if (!anamClientRef.current) return;
    const next = !isMicOn;
    if (next) anamClientRef.current.unmuteInputAudio();
    else      anamClientRef.current.muteInputAudio();
    setIsMicOn(next);
  };

  // ── Camera toggle — user's own camera via getUserMedia into PiP ──────────
  const toggleVideo = async () => {
    const next = !isVideoOn;
    if (next) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(() => {});
        }
        setIsVideoOn(true);
      } catch (err) {
        console.error('[Camera] Permission denied or error:', err);
      }
    } else {
      stopLocalCamera();
      setIsVideoOn(false);
    }
  };

  const handleEndCall = () => {
    cleanup();
    onEndCall();
  };

  return (
    <div className="cr-page">
      <div className="cr-grid" aria-hidden="true" />

      <nav className="cr-nav">
        <button className="cr-nav-btn" onClick={handleEndCall}>
          <ArrowLeftIcon /> Exit
        </button>
        <button className="cr-nav-btn">
          Start from scratch <ArrowRightIcon />
        </button>
      </nav>

      <main className="cr-main">
        <div className="cr-card">

          {/* Emma's name badge */}
          <div className="cr-name-badge">
            <span className="cr-name-dot" />
            Emma
          </div>

          {/* Emma's avatar video */}
          <video
            id="anam-video"
            ref={videoRef}
            autoPlay
            playsInline
            className={`cr-video ${
              phase === 'black' ? 'cr-video--hidden' :
              phase === 'blur'  ? 'cr-video--blurred' :
                                  'cr-video--clear'
            }`}
          />

          {/* Emma's audio is handled internally by streamToVideoElement */}

          {/* Connecting / error overlay */}
          {phase !== 'live' && status !== 'error' && (
            <div className="cr-status-text">CONNECTING...</div>
          )}
          {status === 'error' && (
            <div className="cr-status-text cr-status-error">{error}</div>
          )}

          {/* ── User's camera PiP — bottom-right ──────────────────────────── */}
          <div
            className={`cr-pip ${isVideoOn ? 'cr-pip--active' : 'cr-pip--off'}`}
            onMouseEnter={() => setPipHovered(true)}
            onMouseLeave={() => setPipHovered(false)}
          >
            {/* User's camera feed */}
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="cr-pip-video"
            />

            {/* Placeholder shown when camera is off */}
            {!isVideoOn && (
              <div className="cr-pip-placeholder">
                <VideoOffIcon size={22} />
              </div>
            )}

            {/* Hover controls — mic + camera */}
            <div className={`cr-pip-controls ${pipHovered ? 'cr-pip-controls--visible' : ''}`}>
              <button
                className={`cr-pip-btn ${!isMicOn ? 'cr-pip-btn--off' : ''}`}
                onClick={toggleMic}
                title={isMicOn ? 'Mute mic' : 'Unmute mic'}
              >
                {isMicOn ? <MicOnIcon size={14} /> : <MicOffIcon size={14} />}
              </button>
              <button
                className={`cr-pip-btn ${!isVideoOn ? 'cr-pip-btn--off' : ''}`}
                onClick={toggleVideo}
                title={isVideoOn ? 'Stop camera' : 'Start camera'}
              >
                {isVideoOn ? <VideoOnIcon size={14} /> : <VideoOffIcon size={14} />}
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
