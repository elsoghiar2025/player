declare module "subtitles-parser" {
  export interface SubtitleItem {
    id: string
    startTime: number
    endTime: number
    text: string
  }

  export function fromSrt(srtContent: string, ms?: boolean): SubtitleItem[]
  export function fromVtt(vttContent: string): SubtitleItem[]
  export function toSrt(subtitles: SubtitleItem[]): string
  export function toVtt(subtitles: SubtitleItem[]): string

  const subtitlesParser: {
    fromSrt: typeof fromSrt
    fromVtt: typeof fromVtt
    toSrt: typeof toSrt
    toVtt: typeof toVtt
  }

  export default subtitlesParser
}
