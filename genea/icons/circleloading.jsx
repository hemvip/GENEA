import React from "react"

export default function CircleLoading(props) {
  return (
    <svg
      tabIndex="-1"
      className="progress-ring indeterminate ring-progress-rotate"
      width="24"
      height="24"
      viewBox="0 0 16 16"
      role="status"
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
