"use client"

import Image from "next/image"
import UploadVideos from "./uploadvideos"
import { useEffect, useState } from "react"
// import fetchInputCodes from "./actions"
import InputCode from "./inputcode"
import axios from "axios"

export default function Page() {
  return (
    <>
      <h2 className="font-semibold tracking-tight text-slate-900 dark:text-slate-100 mt-10 border-b pb-1 text-3xl border-neutral-200/70 contrast-more:border-neutral-400 dark:border-primary-100/10 contrast-more:dark:border-neutral-400">
        Upload videos
      </h2>
      <div className="mt-6 mb-32">
        {/* <p className="mt-3 leading-7 first:mt-0">Github information</p> */}
        <UploadVideos />
      </div>
    </>
  )
}
