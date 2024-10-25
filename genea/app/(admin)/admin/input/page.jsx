"use client"

import axios from "axios"
import React, { useEffect, useState } from "react"
import { generateUUID } from "@/utils/generateUUID"
import { fetchInputCodes, updateInputCode } from "./actions"
import { calculateCombinations } from "./utils"
import { useSession } from "next-auth/react"
// import { Loading } from "@/components/loading/loading"

export default function Page() {
  const { data: session, status } = useSession()
  const [submission, setSubmission] = useState("")
  const [studies, setStudies] = useState("")
  const [codes, setCodes] = useState([])

  const [codeSize, setCodeSize] = useState(12)
  const [totalCode, setTotalCode] = useState(40)
  const [nteam, setNTeam] = useState(8)
  const [fractionTotalCodes, setFractionTotalCodes] = useState(2)
  const [screenPerStudy, setScreenPerStudy] = useState(20)
  const [totalStudies, setTotalStudies] = useState(1000)
  const [ncheck, setNCheck] = useState(2)

  // Prolific
  const [completionCode, setCompletionCode] = useState("CMTN9LUK")
  const [failCode, setFailCode] = useState("C70GVE95")

  async function fetchData() {
    try {
      const [resInput, resSubmission, resStudies] = await Promise.all([
        axios.get("/api/inputcode"),
        axios.get("/api/submission"),
        axios.get("/api/studies"),
      ])

      setCodes(resInput.data.codes.join(",\n"))
      setTotalCode(resInput.data.codes.length)
      setSubmission(resSubmission.data.submissions)
      setNTeam(resSubmission.data.submissions.length)
      setStudies(resStudies.data.studies)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  const handleGenerate = async () => {
    const formData = {
      fractionTotalCodes: fractionTotalCodes,
      ncheck: ncheck,
      completionCode: completionCode,
      failCode: failCode,
    }
    const res = await axios.post("/api/generate", formData)
    // setSubmission(JSON.stringify(res.data.videos, null, 2))
    // setCodes(JSON.stringify(res.data.codes, null, 2))
    // setStudies(JSON.stringify(res.data.studies, null, 2))
    console.log("result", res.data)
    const { success, msg, studies, error } = res.data
    if (success) {
      setStudies(studies)
    }
  }

  const randomInputCodes = async () => {
    const randCodes = []
    for (let i = 0; i < totalCode; i++) {
      const code = generateUUID(codeSize)
      randCodes.push(code)
    }
    randCodes.sort()
    setCodes(randCodes)
    // console.log("object", JSON.stringify(randCodes))
  }

  const handleChangeCodes = async () => {
    let inputcodes = codes
      .split(",")
      .map((item) => item.trim())
      .sort()
    const res = await updateInputCode(inputcodes)

    if (res.success) {
      console.log("Insert new inputs code success", res)
    } else {
      console.log("Insert new inputs code failed", res)
    }
  }

  // if (status === "loading") {
  //   return <Loading></Loading>
  // }

  // if (status === "loading" || status === "unauthenticated") {
  //   return <div>Unauthenticated</div>
  // }

  return (
    <div className="flex flex-col gap-3">
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Input Codes
      </h1>
      {/* <p className="mt-6 leading-7 first:mt-0">
      </p> */}

      <div className="mt-3 text-center flex gap-2 justify-center items-center">
        {/* <button
          className="text-sm py-2 px-4 border border-gray-800 bg-gray-800 text-white contrast-more:text-gray-700 contrast-more:dark:text-gray-100 max-md:hidden whitespace-nowrap subpixel-antialiased hover:underline rounded-md transition-all"
          aria-current="true"
          onClick={randomInputCodes}
        >
          Generate Random Input Codes
        </button> */}

        <button
          className="text-sm py-2 px-4 border border-blue-500 bg-blue-500 text-white contrast-more:text-gray-700 contrast-more:dark:text-gray-100 max-md:hidden whitespace-nowrap subpixel-antialiased hover:underline rounded-md transition-all"
          aria-current="true"
          onClick={handleChangeCodes}
        >
          Update Database
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
    </div>
  )
}
