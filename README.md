# @Mr-M/Player

A comprehensive, feature-rich video player component for React with subtitle support, fullscreen, picture-in-picture, and more.

## Features

✨ **Rich Feature Set:**
- ▶️ Play/Pause controls with smooth animations
- 🔊 Volume control with mute/unmute
- 📺 Fullscreen support with landscape orientation lock
- 🖼️ Picture-in-Picture (PiP) mode
- 📝 SRT subtitle support with automatic parsing
- ⏩ Skip forward/backward (10 seconds)
- 📊 Progress bar with seeking capability
- ⬇️ Download video functionality
- 🔒 Wake Lock API support (prevents screen sleep during playback)
- 📱 Responsive design with mobile support
- 🎨 Beautiful UI with Tailwind CSS
- ⌨️ Keyboard shortcuts support
- 🎯 Double-click to fullscreen
- 🎭 Auto-hide controls during playback

## Installation

\`\`\`bash
npm install @mr-m/player
\`\`\`

or

\`\`\`bash
yarn add @mr-m/player
\`\`\`

or

\`\`\`bash
pnpm add @mr-m/player
\`\`\`

## Peer Dependencies

Make sure you have the following peer dependencies installed:

\`\`\`bash
npm install react react-dom
\`\`\`

## Usage

### Basic Usage

\`\`\`tsx
import { VideoPlayer } from '@mr-m/player'
import '@mr-m/player/dist/styles.css'

function App() {
  return (
    <VideoPlayer
      url="https://example.com/video.mp4"
      title="My Video"
      poster="https://example.com/poster.jpg"
    />
  )
}
\`\`\`

### With Subtitles

\`\`\`tsx
import { VideoPlayer } from '@mr-m/player'
import '@mr-m/player/dist/styles.css'

function App() {
  return (
    <VideoPlayer
      url="https://example.com/video.mp4"
      title="My Video with Subtitles"
      subtitleUrl="https://example.com/subtitles.srt"
      autoPlay={false}
    />
  )
}
\`\`\`

### With Event Handlers

\`\`\`tsx
import { VideoPlayer } from '@mr-m/player'
import '@mr-m/player/dist/styles.css'

function App() {
  const handlePlay = () => {
    console.log('Video started playing')
  }

  const handlePause = () => {
    console.log('Video paused')
  }

  const handleTimeUpdate = (currentTime: number) => {
    console.log('Current time:', currentTime)
  }

  const handleEnded = () => {
    console.log('Video ended')
  }

  const handleError = (error: string) => {
    console.error('Video error:', error)
  }

  return (
    <VideoPlayer
      url="https://example.com/video.mp4"
      title="My Video"
      onPlay={handlePlay}
      onPause={handlePause}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
      onError={handleError}
    />
  )
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `url` | `string` | **required** | Video URL (supports all formats supported by HTML5 video) |
| `title` | `string` | `undefined` | Video title displayed in the player |
| `poster` | `string` | `undefined` | Poster image URL shown before video plays |
| `className` | `string` | `""` | Additional CSS classes for the container |
| `autoPlay` | `boolean` | `true` | Auto-play video on load |
| `subtitleUrl` | `string` | `""` | URL to SRT subtitle file |
| `onPlay` | `() => void` | `undefined` | Callback when video starts playing |
| `onPause` | `() => void` | `undefined` | Callback when video is paused |
| `onEnded` | `() => void` | `undefined` | Callback when video ends |
| `onTimeUpdate` | `(currentTime: number) => void` | `undefined` | Callback on time update with current time in seconds |
| `onError` | `(error: string) => void` | `undefined` | Callback when an error occurs |

## Keyboard Shortcuts

- **Space**: Play/Pause
- **F**: Toggle fullscreen
- **M**: Mute/Unmute
- **Arrow Left**: Skip backward 10 seconds
- **Arrow Right**: Skip forward 10 seconds
- **Double Click**: Toggle fullscreen

## Subtitle Format

The player supports SRT (SubRip) subtitle format. Example:

```srt
1
00:00:00,000  00:00:02,000
Hello, this is the first subtitle

2
00:00:02,500  00:00:05,000
And this is the second one
