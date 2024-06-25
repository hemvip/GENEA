"use client"

import { generateUUID } from "@/utils/generateUUID"
import axios from "axios"
import React, { useState } from "react"
import updateGeneratedCode from "./actions"

export default function Page() {
  const [submission, setSubmission] = useState("")
  const [studies, setStudies] = useState("")
  const [codes, setCodes] = useState("")

  const [codeSize, setCodeSize] = useState(12)
  const [totalCode, setTotalCode] = useState(40)
  const [nteam, setNTeam] = useState(4)
  const [npairwise, setNPairwise] = useState(4)
  const [screenPerStudy, setScreenPerStudy] = useState(20)
  const [totalStudies, setTotalStudies] = useState(1000)

  const handleGenerate = async () => {
    const res = await axios.get("/api/generate")
    setSubmission(JSON.stringify(res.data.videoitems, null, 2))
    setCodes(JSON.stringify(res.data.codes, null, 2))
    setStudies(JSON.stringify(res.data.studies, null, 2))
    console.log("result", res)
  }

  const randomInputCodes = async () => {
    const randCodes = []
    for (let i = 0; i < totalCode; i++) {
      const code = generateUUID(codeSize)
      randCodes.push(code)
    }
    setCodes(randCodes.join(",\n"))
    const res = await updateGeneratedCode(randCodes)
    console.log(res)
    // console.log("object", JSON.stringify(randCodes))
  }

  return (
    <div className="flex flex-col gap-3">
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Generate all study screen
      </h1>
      <p className="mt-6 leading-7 first:mt-0">
        This page is private to only for Thanh Youngwoo Rajmund
      </p>
      <div className="mt-6 flex flex-col  px-10 gap-4">
        <div className="flex flex-row items-center gap-4">
          <label htmlFor="codesize" className="w-[20%] flex justify-end">
            Input Code Size
          </label>
          <input
            className="flex-grow min-w-0 appearance-none rounded-md border border-[#666666] bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
            id="codesize"
            type="number"
            value={codeSize}
            onChange={(e) => setCodeSize(e.target.value)}
            name="codesize"
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <label htmlFor="totalcode" className="w-[20%] flex justify-end">
            Total Inputs
          </label>
          <input
            className="flex-grow min-w-0 appearance-none rounded-md border border-[#666666] bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
            id="totalcode"
            type="number"
            value={totalCode}
            onChange={(e) => setTotalCode(e.target.value)}
            name="totalcode"
          />
        </div>
      </div>
      <hr />
      <div className="mt-3 text-center">
        <button
          className="text-sm py-2 px-4 border border-blue-500 bg-blue-500 text-white contrast-more:text-gray-700 contrast-more:dark:text-gray-100 max-md:hidden whitespace-nowrap subpixel-antialiased hover:underline rounded-md transition-all"
          aria-current="true"
          onClick={randomInputCodes}
        >
          Generate Random Input Codes
        </button>
      </div>
      <div className="flex flex-row items-center gap-4">
        <label htmlFor="codes" className="flex justify-end w-[15%]">
          Inputs Codes
        </label>
        <textarea
          className="flex-grow min-w-0 appearance-none rounded-md border border-[#666666] bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
          id="codes"
          rows="7"
          name="codes"
          value={codes}
          onChange={(e) => setCodes(e.target.value)}
        />
      </div>
      <hr />
      <div className="mt-6 flex flex-col  px-10 gap-4">
        <div className="flex flex-row items-center gap-4">
          <label
            htmlFor="screen_per_studies"
            className="w-[20%] flex justify-end"
          >
            Screen Per Study
          </label>
          <input
            className="flex-grow min-w-0 appearance-none rounded-md border border-[#666666] bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
            id="screen_per_studies"
            type="number"
            value={screenPerStudy}
            onChange={(e) => setScreenPerStudy(e.target.value)}
            name="screen_per_studies"
          />
        </div>

        <div className="flex flex-row items-center gap-4">
          <label htmlFor="nteam" className="w-[20%] flex justify-end">
            Total Submission (Team)
          </label>
          <input
            className="flex-grow min-w-0 appearance-none rounded-md border border-[#666666] bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
            id="nteam"
            type="number"
            value={nteam}
            onChange={(e) => setNTeam(e.target.value)}
            name="nteam"
          />
        </div>

        <div className="flex flex-row items-center gap-4">
          <label htmlFor="nteam" className="w-[20%] flex justify-end">
            Pairse Compare Screen Per Team
          </label>
          <input
            className="flex-grow min-w-0 appearance-none rounded-md border border-[#666666] bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
            id="nteam"
            type="number"
            value={nteam}
            onChange={(e) => setNTeam(e.target.value)}
            name="nteam"
          />
        </div>

        <div className="flex flex-row items-center gap-4">
          <label
            htmlFor="screen_per_studies"
            className="w-[20%] flex justify-end"
          >
            Total Studies
          </label>
          <input
            className="flex-grow min-w-0 disabled:bg-gray-200 appearance-none rounded-md border border-[#666666] bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
            id="screen_per_studies"
            type="number"
            disabled={true}
            value={totalStudies}
            onChange={(e) => setTotalStudies(e.target.value)}
            readOnly
            name="screen_per_studies"
          />
        </div>
      </div>
      <div className="mt-3 text-center">
        <button
          className="text-sm py-2 px-4 border border-green-500 bg-green-500 text-white contrast-more:text-gray-700 contrast-more:dark:text-gray-100 max-md:hidden whitespace-nowrap subpixel-antialiased hover:underline rounded-md transition-all"
          aria-current="true"
          onClick={handleGenerate}
        >
          Generate All Studies
        </button>
      </div>

      <div className="flex flex-row items-center gap-4">
        <label htmlFor="submission" className="flex justify-end w-[15%]">
          All Submission
        </label>
        <textarea
          className="flex-grow min-w-0 appearance-none rounded-md border border-[#666666] bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
          id="submission"
          rows="10"
          name="submission"
          value={submission}
          onChange={(e) => setSubmission(e.target.value)}
        />
      </div>

      <div className="flex flex-row items-center gap-4">
        <label htmlFor="studies" className="flex justify-end w-[15%]">
          Studies
        </label>
        <textarea
          className="flex-grow min-w-0 appearance-none rounded-md border border-[#666666] bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
          id="studies"
          rows="20"
          name="studies"
          value={studies}
          onChange={(e) => setStudies(e.target.value)}
        />
      </div>
    </div>
  )
}
