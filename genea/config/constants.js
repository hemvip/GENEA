import { isValidElement } from "react"

export const DEFAULT_THEME = {
  darkMode: true,
  direction: "ltr",
}

export const DEEP_OBJECT_KEYS = Object.entries(DEFAULT_SCREEN_CONFIG)
  .map(([key, value]) => {
    const isObject =
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !isValidElement(value)
    if (isObject) {
      return key
    }
  })
  .filter(Boolean)

export const ERROR_ROUTES = new Set(["/404", "/500"])
