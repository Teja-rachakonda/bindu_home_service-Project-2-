import { useRef, useState } from "react";

// CHANGE 2 — green pill "voice note" player with a play/pause toggle.
function VoiceNote({ src }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(
        () => setPlaying(true),
        () => setPlaying(false) // autoplay/load failed — stay in idle state
      );
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex w-full items-center gap-3 rounded-full bg-whatsapp px-4 py-2.5 text-white shadow-sm transition-transform active:scale-[0.99]"
    >
      {/* Play / Pause icon */}
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
        {playing ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M8 5h3v14H8zM13 5h3v14h-3z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </span>

      <span className="flex-1 text-left text-sm font-semibold">
        🔊 {playing ? "Playing…" : "Hear about this offer"}
      </span>

      {/* Speaker glyph */}
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 shrink-0 opacity-90">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4.03v8.06A4.5 4.5 0 0016.5 12zM14 3.23v2.06a7 7 0 010 13.42v2.06a9 9 0 000-17.54z" />
      </svg>

      {/* Hidden native audio element drives playback */}
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
    </button>
  );
}

export default VoiceNote;
