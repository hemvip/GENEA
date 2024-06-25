import React from "react"
import cn from "clsx"

export default function SubmissionInfo({ submission }) {
  return (
    <div
      className={cn(
        "flex flex-col border p-2 rounded-lg",
        "border-green-200 bg-green-100"
      )}
    >
      <div className="">
        inputcode: <code className="nextra-code">{submission.inputid}</code>
      </div>
      <div className="">
        videoid: <code className="nextra-code">{submission.videoid}</code>
      </div>
      <div className="">
        teamid: <code className="nextra-code">{submission.teamid}</code>
      </div>
      <div className="">
        url:{" "}
        <a
          href={submission.url}
          className="text-primary-600 underline decoration-from-font [text-underline-position:from-font]"
        >
          {submission.url}
        </a>
      </div>
    </div>
  )
}
