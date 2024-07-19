"use client"

import Image from "next/image"
import Upload from "./upload"
import { useEffect, useState } from "react"
// import fetchInputCodes from "./actions"
import InputCode from "./inputcode"
import axios from "axios"

export default function Page() {
  const [codes, setCodes] = useState([])
  const [loading, setLoading] = useState(false)

  async function fetchInputCodes() {
    setLoading(false)
    const res = await axios.get("/api/inputcode")
    // console.log(res)
    if (res.data.success) {
      setCodes(res.data.codes)
      setLoading(true)
    } else {
      console.error(res.error)
    }
  }

  useEffect(() => {
    fetchInputCodes()
  }, [])
  return (
    <>
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Submission
      </h1>
      <h2 className="font-semibold tracking-tight text-slate-900 dark:text-slate-100 mt-10 border-b pb-1 text-3xl border-neutral-200/70 contrast-more:border-neutral-400 dark:border-primary-100/10 contrast-more:dark:border-neutral-400">
        Download input codes
      </h2>
      {loading && <InputCode codes={codes} />}
      <p className="mt-3 leading-7 first:mt-0">
        First please download input codes csv file. Which contain inputcode. If
        the input code is <code>417010272047</code>, then the inference output
        file of your model should be <code>417010272047.bvh</code>
      </p>
      <p className="mt-3 leading-7 first:mt-0">
        Run your model to get inference output
      </p>
      <Image
        width={739}
        height={439}
        alt="Upload page"
        className="w-[70%] mx-auto"
        src="/upload_page.png"
      />
      <p className="mt-3 leading-7 first:mt-0">
        Login with github and Create submission result in below section.
      </p>
      <h2 className="font-semibold tracking-tight text-slate-900 dark:text-slate-100 mt-10 border-b pb-1 text-3xl border-neutral-200/70 contrast-more:border-neutral-400 dark:border-primary-100/10 contrast-more:dark:border-neutral-400">
        Upload videos
      </h2>
      <div className="mt-6 mb-32">
        {/* <p className="mt-3 leading-7 first:mt-0">Github information</p> */}
        {loading && <Upload codes={codes} />}
      </div>
    </>
  )
}
