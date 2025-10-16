"use client"

import VideoPlayer from "../src/VideoPlayer"
import "../src/styles.css"

export default function Page() {
  const handlePlay = () => {
    console.log("[v0] Video started playing")
  }

  const handlePause = () => {
    console.log("[v0] Video paused")
  }

  const handleTimeUpdate = (currentTime: number) => {
    console.log("[v0] Current time:", currentTime)
  }

  const handleEnded = () => {
    console.log("[v0] Video ended")
  }

  const handleError = (error: string) => {
    console.error("[v0] Video error:", error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white">@Mr-M/Player</h1>
          <p className="text-xl text-gray-300">A comprehensive, feature-rich video player for React</p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full">▶️ Play/Pause</span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">📺 Fullscreen</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full">🖼️ Picture-in-Picture</span>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full">📝 Subtitles</span>
            <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full">⏩ Skip ±10s</span>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full">⬇️ Download</span>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-700">
          <VideoPlayer
            url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            title="Big Buck Bunny - Demo Video"
            poster="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"
            autoPlay={false}
            onPlay={handlePlay}
            onPause={handlePause}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onError={handleError}
            className="w-full aspect-video"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">✨ Features</h2>
            <ul className="space-y-2 text-gray-300">
              <li>✅ Play/Pause with smooth animations</li>
              <li>✅ Volume control with mute/unmute</li>
              <li>✅ Fullscreen with orientation lock</li>
              <li>✅ Picture-in-Picture mode</li>
              <li>✅ SRT subtitle support</li>
              <li>✅ Skip forward/backward (10s)</li>
              <li>✅ Progress bar with seeking</li>
              <li>✅ Download functionality</li>
              <li>✅ Wake Lock API support</li>
              <li>✅ Auto-hide controls</li>
            </ul>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">🚀 Quick Start</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">Install:</p>
                <code className="block bg-black/50 text-green-400 p-3 rounded-lg text-sm">
                  npm install @mr-m/player
                </code>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Usage:</p>
                <code className="block bg-black/50 text-blue-400 p-3 rounded-lg text-xs overflow-x-auto">
                  {`import { VideoPlayer } from '@mr-m/player'
import '@mr-m/player/dist/styles.css'

<VideoPlayer url="video.mp4" />`}
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">⌨️ Keyboard Shortcuts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-black/30 rounded-lg p-3">
              <kbd className="text-lg font-bold text-blue-400">Space</kbd>
              <p className="text-sm text-gray-400 mt-1">Play/Pause</p>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <kbd className="text-lg font-bold text-purple-400">F</kbd>
              <p className="text-sm text-gray-400 mt-1">Fullscreen</p>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <kbd className="text-lg font-bold text-green-400">M</kbd>
              <p className="text-sm text-gray-400 mt-1">Mute</p>
            </div>
            <div className="bg-black/30 rounded-lg p-3">
              <kbd className="text-lg font-bold text-orange-400">← →</kbd>
              <p className="text-sm text-gray-400 mt-1">Skip ±10s</p>
            </div>
          </div>
        </div>

        <div className="text-center text-gray-500 text-sm">
          <p>Made with ❤️ by Mr-M</p>
          <p className="mt-2">Open your browser console to see event logs</p>
        </div>
      </div>
    </div>
  )
}
