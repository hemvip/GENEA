"use client"

import Image from "next/image"
import UploadOriginVideos from "./uploadoriginvideos"
import { useEffect, useState } from "react"
// import fetchInputCodes from "./actions"
import InputCode from "./inputcode"
import axios from "axios"
import { Loading } from "@/components"

export default function Page() {
  // const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [systemList, setSystemList] = useState([])

  async function fetchTeams() {
    const res = await axios.get("/api/systems")
    if (res.data.success) {
      setSystemList(res.data.systems)
    } else {
      console.error(res.error)
    }
  }

  useEffect(() => {
    fetchTeams()
    // fetchInputCodes()
  }, [])

  return (
    <>
      <h2 className="font-semibold tracking-tight text-slate-900 dark:text-slate-100 mt-10 border-b pb-1 text-3xl border-neutral-200/70 contrast-more:border-neutral-400 dark:border-primary-100/10 contrast-more:dark:border-neutral-400">
        Origin Videos
      </h2>
      <h4 className="font-semibold tracking-tight text-slate-900 dark:text-slate-100 mt-8 text-xl">
        Video for systems
      </h4>
      <div className="nextra-code relative mt-6 first:mt-0">
        <pre
          className="overflow-x-auto subpixel-antialiased text-[.9em] dark:bg-black py-4 ring-1 ring-inset ring-gray-300 dark:ring-neutral-700 contrast-more:ring-gray-900 contrast-more:dark:ring-gray-50 contrast-more:contrast-150 rounded-md"
          tabindex="0"
          data-word-wrap=""
        >
          <code className="nextra-code" dir="ltr">
            <span>
              <span>/videos</span>
            </span>
            <span>
              <span></span>
            </span>
            <span>
              <span>/videos/systems</span>
            </span>
            <span>
              <span></span>
            </span>
            <span>
              <span>
                /videos/systems/&lt;system_name&gt;/&lt;video_segment_name&gt;.mp4
              </span>
            </span>
          </code>
        </pre>
        <div className="opacity-0 transition [div:hover>&amp;]:opacity-100 focus-within:opacity-100 flex gap-1 absolute right-4 top-2">
          <button
            className="transition rounded-md p-1.5 border border-gray-300 dark:border-neutral-700 contrast-more:border-gray-900 contrast-more:dark:border-gray-50 md:hidden bg-red-500"
            title="Toggle word wrap"
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="h-4 w-auto"
            >
              <path
                fill="currentColor"
                d="M4 19h6v-2H4v2zM20 5H4v2h16V5zm-3 6H4v2h13.25c1.1 0 2 .9 2 2s-.9 2-2 2H15v-2l-3 3l3 3v-2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4z"
              ></path>
            </svg>
          </button>
          <button
            className="transition rounded-md p-1.5 border border-gray-300 dark:border-neutral-700 contrast-more:border-gray-900 contrast-more:dark:border-gray-50"
            title="Copy code"
            tabindex="0"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              className="nextra-copy-icon pointer-events-none h-4 w-4"
            >
              <rect
                x="9"
                y="9"
                width="13"
                height="13"
                rx="2"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></rect>
              <path
                d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <h4 className="font-semibold tracking-tight text-slate-900 dark:text-slate-100 mt-8 text-xl">
        Upload Origin Videos
      </h4>
      <div className="mt-6 mb-32">
        {/* <p className="mt-3 leading-7 first:mt-0">Github information</p> */}
        {loading && systemList.length > 0 ? (
          <UploadOriginVideos systemList={systemList} />
        ) : (
          <div className="text-center">
            <Loading />
          </div>
        )}
      </div>
    </>
  )
}
