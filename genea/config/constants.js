import { isValidElement } from "react"

export const DEFAULT_THEME = {
  darkMode: true,
  direction: "ltr",
}

export const ERROR_ROUTES = new Set(["/404", "/500"])

export const UPLOAD_API_ENDPOINT = `${process.env.NEXT_PUBLIC_UPLOAD_API_ENDPOINT}/api/submission`
