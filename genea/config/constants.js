import { isValidElement } from "react"

export const DEFAULT_THEME = {
  darkMode: true,
  direction: "ltr",
}

export const ERROR_ROUTES = new Set(["/404", "/500"])

// https://submission.hemvip.workers.dev/api/start-upload
export const START_UPLOAD_API_ENDPOINT = `${process.env.NEXT_PUBLIC_UPLOAD_API_ENDPOINT}/api/start-upload`

// https://submission.hemvip.workers.dev/api/upload-part
export const UPLOAD_PART_API_ENDPOINT = `${process.env.NEXT_PUBLIC_UPLOAD_API_ENDPOINT}/api/upload-part`

// https://submission.hemvip.workers.dev/api/complete-upload
export const COMPLETE_UPLOAD_API_ENDPOINT = `${process.env.NEXT_PUBLIC_UPLOAD_API_ENDPOINT}/api/complete-upload`

// https://video.hemvip.workers.dev/api/video-start-upload
export const VIDEO_START_UPLOAD_API_ENDPOINT = `${process.env.NEXT_PUBLIC_UPLOAD_API_ENDPOINT}/api/video-start-upload`

// https://video.hemvip.workers.dev/api/video-upload-part
export const VIDEO_UPLOAD_PART_API_ENDPOINT = `${process.env.NEXT_PUBLIC_UPLOAD_API_ENDPOINT}/api/video-upload-part`

// https://video.hemvip.workers.dev/api/video-complete-upload
export const VIDEO_COMPLETE_UPLOAD_API_ENDPOINT = `${process.env.NEXT_PUBLIC_UPLOAD_API_ENDPOINT}/api/video-complete-upload`
