import React from "react"
import cn from "clsx"

export default function BVHInfo({ submission }) {
  return (
    <div
      className={cn(
        "flex flex-col border p-2 rounded-lg",
        "border-red-200 bg-red-100"
      )}
    >
      <div className="">
        inputcode: <code className="nextra-code">{submission.inputid}</code>
      </div>
      <div className="">
        bvhid: <code className="nextra-code">{submission.bvhid}</code>
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
