import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  audioUrl?: string;
  slowAudioUrl?: string;
  label?: string;
}

export function AudioPlayer({ audioUrl, slowAudioUrl, label }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingSlow, setIsPlayingSlow] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const slowAudioRef = useRef<HTMLAudioElement>(null);

  const playAudio = async (url?: string, isSlow = false) => {
    if (!url) return;

    const audio = isSlow ? slowAudioRef.current : audioRef.current;
    const setPlayingState = isSlow ? setIsPlayingSlow : setIsPlaying;
    
    if (audio) {
      try {
        // Stop any currently playing audio
        if (audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          setIsPlaying(false);
        }
        if (slowAudioRef.current && !slowAudioRef.current.paused) {
          slowAudioRef.current.pause();
          slowAudioRef.current.currentTime = 0;
          setIsPlayingSlow(false);
        }

        audio.src = url;
        setPlayingState(true);
        await audio.play();
      } catch (error) {
        console.error("Error playing audio:", error);
        setPlayingState(false);
      }
    }
  };

  const handleAudioEnd = (isSlow = false) => {
    if (isSlow) {
      setIsPlayingSlow(false);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Main play button */}
      <Button
        onClick={() => playAudio(audioUrl)}
        disabled={!audioUrl || isPlaying}
        className="w-14 h-14 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg"
        data-testid="button-play-audio"
      >
        {isPlaying ? (
          <div className="w-3 h-3 border-2 border-primary-foreground rounded-full animate-pulse" />
        ) : (
          <i className="fas fa-play text-primary-foreground text-lg ml-1"></i>
        )}
      </Button>

      {/* Audio visualization */}
      {(isPlaying || isPlayingSlow) && (
        <div className="flex items-center justify-center gap-1 mb-4">
          <div className="audio-wave"></div>
          <div className="audio-wave"></div>
          <div className="audio-wave"></div>
          <div className="audio-wave"></div>
          <div className="audio-wave"></div>
        </div>
      )}

      {/* Speed controls */}
      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => playAudio(audioUrl)}
          disabled={!audioUrl}
          className="flex items-center gap-1 hover:text-foreground transition-colors"
          data-testid="button-normal-speed"
        >
          <i className="fas fa-volume-up"></i>
          Normal Speed
        </Button>
        
        {slowAudioUrl && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => playAudio(slowAudioUrl, true)}
            disabled={!slowAudioUrl}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
            data-testid="button-slow-speed"
          >
            <i className="fas fa-volume-down"></i>
            Slow Speed
          </Button>
        )}
      </div>

      {/* Hidden audio elements */}
      <audio
        ref={audioRef}
        onEnded={() => handleAudioEnd(false)}
        preload="none"
      />
      
      {slowAudioUrl && (
        <audio
          ref={slowAudioRef}
          onEnded={() => handleAudioEnd(true)}
          preload="none"
        />
      )}
    </div>
  );
}
