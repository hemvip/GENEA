import React from "react"
import cn from "clsx"
import ActionList from "@/components/actionlist"

export default function ScreenInfo({ info }) {
  const colors = {
    generic: "border-green-200 bg-green-100",
    video: "border-red-200 bg-red-100",
    finish: "border-orange-200 bg-orange-100",
  }
  return (
    <div
      className={cn("flex flex-col border p-2 rounded-lg", colors[info.type])}
    >
      <div className="">
        pageid: <code className="nextra-code">{info.pageid}</code>
      </div>
      <div className="">
        type: <code className="nextra-code">{info.type}</code>
      </div>
      <div className="">
        name: <code className="nextra-code">{info.name}</code>
      </div>
      <div className="">
        video:
        {info.videos && (
          <div className="flex flex-col gap-2">
            <div className="border border-gray-300 bg-gray-200 p-2 rounded-lg ">
              <div className="">
                teamid :{" "}
                <code className="nextra-code">{info.videos[0].teamid}</code>
              </div>
              <div className="">
                inputid :{" "}
                <code className="nextra-code">{info.videos[0].inputid}</code>
              </div>
              <div className="">
                value :{" "}
                <code className="nextra-code">{info.videos[0].value}</code>
              </div>
              <div className="">
                url :{" "}
                <a
                  href={info.videos[0].url}
                  className="text-primary-600 underline decoration-from-font [text-underline-position:from-font]"
                >
                  {info.videos[0].url}
                </a>
              </div>
            </div>
            <div className="border border-gray-300 bg-gray-200 p-2 rounded-lg ">
              <div className="">
                teamid:{" "}
                <code className="nextra-code">{info.videos[1].teamid}</code>
              </div>
              <div className="">
                inputid:{" "}
                <code className="nextra-code">{info.videos[1].inputid}</code>
              </div>
              <div className="">
                value:{" "}
                <code className="nextra-code">{info.videos[1].value}</code>
              </div>
              <div className="">
                url:{" "}
                <a
                  href={info.videos[1].url}
                  className="text-primary-600 underline decoration-from-font [text-underline-position:from-font]"
                >
                  {info.videos[1].url}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="">
        actions :
        <ActionList actions={info.actions} />
      </div>
    </div>
  )
}
