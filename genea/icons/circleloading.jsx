import React from "react"

export default function CircleLoading(props) {
  return (
    <svg
      className="progress-ring indeterminate ring-progress-rotate"
      viewBox="0 0 16 16"
    >
      <circle
        cx="50%"
        cy="50%"
        r="7"
        strokeDasharray="3"
        strokeDashoffset="NaN"
        className="ring-progress-rotate"
      ></circle>
    </svg>
  )
}
