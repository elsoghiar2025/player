"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "./components/Button"
import { Slider } from "./components/Slider"
import subtitlesParser from "subtitles-parser"
import * as Icons from "./icons"

export interface VideoPlayerProps {
  url: string
  title?: string
  poster?: string
  className?: string
  autoPlay?: boolean
  subtitleUrl?: string
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onTimeUpdate?: (currentTime: number) => void
  onError?: (error: string) => void
}

const VideoPlayer = ({
  url,
  title,
  poster,
  className = "",
  autoPlay = true,
  subtitleUrl: initialSubtitleUrl = "",
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onError,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null)
  const wakeLockRef = useRef<any>(null)

  const [playing, setPlaying] = useState(autoPlay)
  const [loading, setLoading] = useState(true)
  const [buffering, setBuffering] = useState(false)
  const [muted, setMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showCenterButton, setShowCenterButton] = useState(false)
  const [lastTap, setLastTap] = useState(0)
  const [subtitleUrl, setSubtitleUrl] = useState(initialSubtitleUrl)
  const [subtitles, setSubtitles] = useState<any[]>([])
  const [currentSubtitle, setCurrentSubtitle] = useState<string>("")
  const [isPiPSupported, setIsPiPSupported] = useState(false)
  const [isPiPActive, setIsPiPActive] = useState(false)
  const [showTopControls, setShowTopControls] = useState(true)

  const requestWakeLock = useCallback(async () => {
    try {
      if ("wakeLock" in navigator && playing) {
        wakeLockRef.current = await (navigator as any).wakeLock.request("screen")
      }
    } catch (err) {
      console.warn("Wake Lock not supported or failed to activate")
    }
  }, [playing])

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release()
      wakeLockRef.current = null
    }
  }, [])

  useEffect(() => {
    if (playing) {
      requestWakeLock()
    } else {
      releaseWakeLock()
    }

    return () => {
      releaseWakeLock()
    }
  }, [playing, requestWakeLock, releaseWakeLock])

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && playing && wakeLockRef.current === null) {
        await requestWakeLock()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [playing, requestWakeLock])

  useEffect(() => {
    if (typeof document !== "undefined" && "pictureInPictureEnabled" in document) {
      setIsPiPSupported(true)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleEnterPiP = () => {
      setIsPiPActive(true)
    }

    const handleLeavePiP = () => {
      setIsPiPActive(false)
    }

    video.addEventListener("enterpictureinpicture", handleEnterPiP)
    video.addEventListener("leavepictureinpicture", handleLeavePiP)

    return () => {
      video.removeEventListener("enterpictureinpicture", handleEnterPiP)
      video.removeEventListener("leavepictureinpicture", handleLeavePiP)
    }
  }, [])

  useEffect(() => {
    if (subtitleUrl) {
      handleLoadSubtitleFromUrl(subtitleUrl)
    }
  }, [subtitleUrl])

  useEffect(() => {
    if (initialSubtitleUrl) {
      setSubtitleUrl(initialSubtitleUrl)
      handleLoadSubtitleFromUrl(initialSubtitleUrl)
    }
  }, [initialSubtitleUrl])

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = url
    link.download = url.split("/").pop() || "video.mp4"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleLoadSubtitleFromUrl = async (url: string) => {
    if (!url) {
      console.warn("Invalid subtitle URL")
      return
    }

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Error loading file: ${response.status}`)
      }
      const text = await response.text()

      try {
        const parsed = subtitlesParser.fromSrt(text, true)
        const cues: any[] = parsed.map((item: any) => ({
          type: "cue",
          data: {
            start: item.startTime,
            end: item.endTime,
            text: item.text,
          },
        }))

        setSubtitles(cues)
      } catch (error) {
        console.warn("Unsupported subtitle format")
        setSubtitles([])
      }
    } catch (error) {
      console.warn("Failed to load subtitle file from URL")
      setSubtitles([])
    }
  }

  const hideControls = useCallback(() => {
    if (playing) {
      setShowControls(false)
      setShowCenterButton(false)
      setShowTopControls(false)
    }
  }, [playing])

  const showControlsWithTimeout = useCallback(() => {
    setShowControls(true)
    setShowCenterButton(true)
    setShowTopControls(true)

    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current)
    }

    controlsTimeout.current = setTimeout(() => {
      setShowCenterButton(false)
      setTimeout(() => {
        if (playing) {
          setShowControls(false)
          setShowTopControls(false)
        }
      }, 1000)
    }, 4000)
  }, [playing])

  useEffect(() => {
    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current)
      }
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadStart = () => setLoading(true)
    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setLoading(false)
      showControlsWithTimeout()
    }

    const handleTimeUpdate = () => {
      const time = video.currentTime
      setCurrentTime(time)
      onTimeUpdate?.(time)

      if (subtitles.length > 0) {
        const currentSub = subtitles.find((sub) => {
          const start = sub.data.start / 1000
          const end = sub.data.end / 1000
          return time >= start && time <= end
        })

        setCurrentSubtitle(currentSub ? currentSub.data.text : "")
      }
    }

    const handleError = () => {
      const errorMsg = "Failed to load video"
      setError(errorMsg)
      onError?.(errorMsg)
    }

    const handleWaiting = () => {
      setBuffering(true)
      showControlsWithTimeout()
    }

    const handlePlaying = () => {
      setBuffering(false)
      showControlsWithTimeout()
    }

    video.addEventListener("loadstart", handleLoadStart)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("error", handleError)
    video.addEventListener("waiting", handleWaiting)
    video.addEventListener("playing", handlePlaying)

    return () => {
      video.removeEventListener("loadstart", handleLoadStart)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("error", handleError)
      video.removeEventListener("waiting", handleWaiting)
      video.removeEventListener("playing", handlePlaying)
    }
  }, [showControlsWithTimeout, subtitles, onTimeUpdate, onError])

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement
      )
      setFullscreen(isFullscreen)
      showControlsWithTimeout()
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("mozfullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange)
    }
  }, [showControlsWithTimeout])

  const togglePlay = () => {
    if (!videoRef.current) return

    if (videoRef.current.paused) {
      videoRef.current.play()
      setPlaying(true)
      onPlay?.()
    } else {
      videoRef.current.pause()
      setPlaying(false)
      onPause?.()
    }
    showControlsWithTimeout()
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !muted
    setMuted(!muted)
    showControlsWithTimeout()
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    try {
      if (!fullscreen) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen()
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen()
        } else if ((containerRef.current as any).mozRequestFullScreen) {
          await (containerRef.current as any).mozRequestFullScreen()
        }

        if (screen.orientation && typeof (screen.orientation as any).lock === 'function') {
          await (screen.orientation as any).lock("landscape").catch(() => {})
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen()
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen()
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen()
        }

        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock()
        }
      }

      setFullscreen(!fullscreen)
      showControlsWithTimeout()
    } catch (err) {}
  }

  const handleDoubleClick = () => {
    toggleFullscreen()
  }

  const handleClick = () => {
    const now = Date.now()
    if (lastTap && now - lastTap < 300) {
      handleDoubleClick()
      setLastTap(0)
    } else {
      setLastTap(now)
      setShowCenterButton(true)
      setShowTopControls(true)
      setTimeout(() => {
        setShowCenterButton(false)
        if (playing) {
          setShowTopControls(false)
        }
      }, 3000)
    }
  }

  const handleSeek = (value: number[]) => {
    if (!videoRef.current || !duration) return
    const newTime = (value[0] / 100) * duration
    videoRef.current.currentTime = newTime
    setCurrentTime(newTime)
    showControlsWithTimeout()
  }

  const skipForward = () => {
    if (!videoRef.current) return
    const newTime = Math.min(videoRef.current.currentTime + 10, duration)
    videoRef.current.currentTime = newTime
    setCurrentTime(newTime)
    showControlsWithTimeout()
  }

  const skipBackward = () => {
    if (!videoRef.current) return
    const newTime = Math.max(videoRef.current.currentTime - 10, 0)
    videoRef.current.currentTime = newTime
    setCurrentTime(newTime)
    showControlsWithTimeout()
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00:00"
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hours > 0) {
      return `${hours}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`
    } else {
      return `${mins}:${secs < 10 ? "0" : ""}${secs}`
    }
  }

  const togglePictureInPicture = async () => {
    const video = videoRef.current
    if (!video || !isPiPSupported) return

    try {
      if (isPiPActive) {
        await document.exitPictureInPicture()
      } else {
        await video.requestPictureInPicture()
      }
      showControlsWithTimeout()
    } catch (error) {
      console.warn("Picture-in-picture not supported or failed")
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative bg-black rounded-xl overflow-hidden ${className}`}
      onMouseMove={showControlsWithTimeout}
      onMouseLeave={hideControls}
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        src={url}
        poster={poster}
        className="w-full h-full object-contain"
        playsInline
        autoPlay={autoPlay}
        muted={muted}
        onEnded={() => {
          setPlaying(false)
          showControlsWithTimeout()
          onEnded?.()
        }}
      />

      {currentSubtitle && (
        <div
          className="absolute bottom-12 left-0 font-bold right-0 flex justify-center px-4"
          style={{
            fontSize: "22px",
            color: "#FFFFFF",
            textAlign: "center",
            maxWidth: "80%",
            margin: "0 auto",
            lineHeight: "1.4",
            wordBreak: "break-word",
            textShadow: `
              -1px -1px 0 #000,
              1px -1px 0 #000,
              -1px 1px 0 #000,
              1px 1px 0 #000
            `,
          }}
        >
          {currentSubtitle}
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-red-500 text-lg">Error playing video</div>
            <div className="text-[#999] text-sm">{error}</div>
          </div>
        </div>
      )}

      {(loading || buffering) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 z-50">
          <Icons.Loader2 className="w-[48px] h-[48px] text-white animate-spin" />
        </div>
      )}

      <div
        className={`absolute top-0 left-0 right-0 flex justify-between items-start p-4 pointer-events-none transition-opacity duration-300 ${showTopControls ? "opacity-100" : "opacity-0"}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-4 pointer-events-auto">
            <Icons.VideoPlayerLogo className="w-[20px] h-[20px]" />
          </div>
          {title && (
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 pointer-events-auto">
              <h2 className="text-white text-sm font-semibold truncate max-w-[300px]">{title}</h2>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full p-4 bg-black/50 backdrop-blur-sm pointer-events-auto z-10 hover:text-white/80"
            onClick={toggleMute}
          >
            {muted ? <Icons.VolumeX className="w-[24px] h-[24px]" /> : <Icons.Volume2 className="w-[24px] h-[24px]" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full p-4 bg-black/50 backdrop-blur-sm pointer-events-auto z-10 hover:text-white/80"
            onClick={handleDownload}
            title="Download video"
          >
            <Icons.Download className="w-[24px] h-[24px]" />
          </Button>
        </div>
      </div>

      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          showCenterButton ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-8">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full p-4 bg-black/50 backdrop-blur-sm hover:text-white/80"
            onClick={skipBackward}
            title="Skip forward 10 seconds"
          >
            <Icons.ArrowLeftIcon className="w-[48px] h-[48px]" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full p-8 bg-black/50 backdrop-blur-sm hover:text-white/80"
            onClick={togglePlay}
          >
            {playing ? (
              <Icons.Pause className="w-[48px] h-[48px]" />
            ) : (
              <Icons.Play className="w-[48px] h-[48px]" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full p-4 bg-black/50 backdrop-blur-sm hover:text-white/80"
            onClick={skipForward}
            title="Skip backward 10 seconds"
          >
            <Icons.ArrowRightIcon className="w-[48px] h-[48px]" />
          </Button>
        </div>
      </div>

      <div
        className={`absolute bottom-4 left-4 right-4 space-y-2 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-2 w-full">
          <Slider
            value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
            max={100}
            step={0.1}
            onValueChange={handleSeek}
            className="flex-1 h-0.5 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-white [&_[role=slider]]:border-white [&_.bg-primary]:bg-white [&_.bg-secondary]:bg-black/60 [&_.bg-secondary]:backdrop-blur-sm"
          />
          <div className="text-white text-sm min-w-[40px] text-left ml-2">{formatTime(currentTime)}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isPiPSupported && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full hover:text-white/80"
                onClick={togglePictureInPicture}
                title={isPiPActive ? "Exit picture-in-picture" : "Enter picture-in-picture"}
              >
                {isPiPActive ? (
                  <Icons.PictureInPicture2 className="w-[24px] h-[24px]" />
                ) : (
                  <Icons.PictureInPicture className="w-[24px] h-[24px]" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full hover:text-white/80"
              onClick={toggleFullscreen}
            >
              {fullscreen ? <Icons.Minimize className="w-[24px] h-[24px]" /> : <Icons.Maximize className="w-[24px] h-[24px]" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
