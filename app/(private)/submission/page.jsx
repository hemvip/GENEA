// import { useState } from "react"
import Upload from "./upload"
import fetchInputCodes from "./actions"
import InputCode from "./inputcode"

export default async function Page() {
  //

  const { codes, videocodes } = await fetchInputCodes()
  // console.log(codes)
  return (
    <>
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Submission
      </h1>
      <h2 className="font-semibold tracking-tight text-slate-900 dark:text-slate-100 mt-10 border-b pb-1 text-3xl border-neutral-200/70 contrast-more:border-neutral-400 dark:border-primary-100/10 contrast-more:dark:border-neutral-400">
        Download input codes
      </h2>
      <InputCode codes={codes} />
      <p className="mt-3 leading-7 first:mt-0">
        First please download input codes csv file. Which contain inputcode. If
        the input code is <code>4345345</code>, then the inference video output
        should be <code>4345345.mp4</code>
      </p>
      <p className="mt-3 leading-7 first:mt-0">
        Run your model to get inference output
      </p>
      <img className="w-[70%] mx-auto" src="/upload_page.png" />
      <p className="mt-3 leading-7 first:mt-0">
        Login with github and Create submission result in below section.
      </p>
      <h2 className="font-semibold tracking-tight text-slate-900 dark:text-slate-100 mt-10 border-b pb-1 text-3xl border-neutral-200/70 contrast-more:border-neutral-400 dark:border-primary-100/10 contrast-more:dark:border-neutral-400">
        Upload videos
      </h2>
      <div className="mt-6 mb-32">
        {/* <p className="mt-3 leading-7 first:mt-0">Github information</p> */}
        <Upload />
      </div>
    </>
  )
}
