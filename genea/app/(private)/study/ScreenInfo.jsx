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
        PageID: <code className="nextra-code">{info.pageid}</code>
      </div>
      <div className="">
        Type: <code className="nextra-code">{info.type}</code>
      </div>
      <div className="text-wrap w-72">
        Name: <code className="nextra-code text-wrap">{info.name}</code>
      </div>
      <div className="">
        Video:
        {info.videos && (
          <div className="flex flex-col gap-2">
            <div className="border border-gray-300 bg-gray-200 p-2 rounded-lg ">
              <div className="">
                TeamID :{" "}
                <code className="nextra-code">{info.videos[0].teamid}</code>
              </div>
              <div className="">
                InputID :{" "}
                <code className="nextra-code">{info.videos[0].inputid}</code>
              </div>
              <div className="">
                Value :{" "}
                <code className="nextra-code">{info.videos[0].value}</code>
              </div>
              <div className="flex gap-2">
                <span>URL: </span>
                <a
                  href={info.videos[0].url}
                  className="w-72 overflow-hidden text-ellipsis whitespace-nowrap text-primary-600 underline decoration-from-font [text-underline-position:from-font]"
                >
                  {info.videos[0].url}
                </a>
              </div>
            </div>
            <div className="border border-gray-300 bg-gray-200 p-2 rounded-lg ">
              <div className="">
                TeamID:{" "}
                <code className="nextra-code">{info.videos[1].teamid}</code>
              </div>
              <div className="">
                InputID:{" "}
                <code className="nextra-code">{info.videos[1].inputid}</code>
              </div>
              <div className="">
                Value:{" "}
                <code className="nextra-code">{info.videos[1].value}</code>
              </div>
              <div className="flex gap-2 w-full">
                <span>URL: </span>
                <a
                  href={info.videos[1].url}
                  className="w-72 overflow-hidden text-ellipsis whitespace-nowrap text-primary-600 underline decoration-from-font [text-underline-position:from-font]"
                >
                  {info.videos[1].url}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="">
        Local actions :
        <ActionList actions={info.actions} />
      </div>
    </div>
  )
}
