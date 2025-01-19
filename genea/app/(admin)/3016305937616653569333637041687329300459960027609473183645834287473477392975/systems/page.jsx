"use client"
import { clsx as cn } from "clsx"
import axios from "axios"
import React, { Fragment, useEffect, useState } from "react"
import { generateUUID } from "@/utils/generateUUID"
import { updateInputCode } from "./actions"
import { calculateCombinations } from "./utils"
import { useSession } from "next-auth/react"
import { Loading } from "@/components"
import SubmissionList from "./submissionlist"
import { Description, Field, Label, Select } from "@headlessui/react"
import { ArrowLeftIcon, ArrowRightIcon } from "@/nextra/icons"
// import { Loading } from "@/components/loading/loading"
export default function Page() {
  const [systems, setSystems] = useState([])
  const [systemname, setSystemName] = useState("")
  const [loading, setLoading] = useState(false)
  const [submission, setSubmission] = useState([])

  async function fetchData() {
    try {
      const res = await axios.get("/api/systems")
      if (res.data.success) {
        setSystems(res.data.systems)
      } else {
        console.error(res.error)
      }

      // setSystems(resInput.data.codes.join(",\n"))
    } catch (error) {
      console.error(error)
    }
  }

  async function fetchSubmission() {
    const res = await axios.get("/api/submission")
    if (res.data.success) {
      setSubmission(res.data.submissions)
    } else {
      console.error(res.error)
    }
  }

  const onChangeSystemName = (e) => {
    return setSystemName(e.target.value)
  }

  useEffect(() => {
    setLoading(true)
    fetchData()
    fetchSubmission()
    setLoading(false)
  }, [])

  // console.log("systems", systems)

  const handleChangeCodes = async () => {
    console.log("system", systemname)
    //   let inputcodes = systems
    //     .split(",")
    //     .map((item) => item.trim())
    //     .sort()
    //   const res = await updateInputCode(inputcodes)
    //   if (res.success) {
    //     console.log("Insert new inputs code success", res)
    //   } else {
    //     console.log("Insert new inputs code failed", res)
    //   }
  }

  // if (status === "loading") {
  //   return <Loading></Loading>
  // }

  // if (status === "loading" || status === "unauthenticated") {
  //   return <div>Unauthenticated</div>
  // }

  if (loading) {
    return <Loading></Loading>
  }

  return (
    <div className="flex flex-col gap-3">
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Systems model
      </h1>

      <h2 className="font-semibold tracking-tight text-slate-900 dark:text-slate-100 mt-10 border-b pb-1 text-3xl border-neutral-200/70 contrast-more:border-neutral-400 dark:border-primary-100/10 contrast-more:dark:border-neutral-400">
        System List
      </h2>

      <div
        className={cn(
          "-mx-6 mb-4 mt-6 overflow-x-auto overscroll-x-contain px-6 pb-4 ",
          "mask-gradient"
        )}
      >
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b py-4 text-left dark:border-neutral-700 ">
              <th className="py-2 font-semibold">#ID</th>
              <th className="py-2 font-semibold">System name</th>
              <th className="py-2 pl-6 font-semibold">Team name</th>
              {/* <th className="py-2 pl-6 font-semibold">Videos</th> */}
            </tr>
          </thead>
          <tbody className="align-baseline text-gray-900 dark:text-gray-100">
            {systems &&
              systems.map((system, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-neutral-700/50 align-middle"
                >
                  <td className="py-2 pl-6">{index + 1}</td>
                  <td className="py-2 pl-6">{system.name}</td>
                  <td className="py-2 pl-6 h-24">
                    {/* <div className="overflow-y-auto relative first:mt-0 flex flex-col gap-2 max-h-96 max-w-96">
                    {system.bvh &&
                      system.bvh.map((bvh, index) => {
                        return <BVHInfo submission={bvh} key={index} />
                      })}
                  </div> */}
                    {system.teamname == null ? "GENEA" : system.teamname}
                  </td>
                  {/* <td className="py-2 pl-6 h-24">
                  <div className="overflow-y-auto relative first:mt-0 flex flex-col gap-2 max-h-96 max-w-96">
                    {system.videos &&
                      system.videos.map((info, index) => {
                        return <VideoInfo submission={info} key={index} />
                      })}
                  </div>
                </td> */}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="">
        <form className="mt-6 flex flex-col w-[80%] px-10 gap-4">
          {submission.length > 0 ? (
            <SubmissionList teams={submission} />
          ) : (
            <div className="text-center">
              <Loading />
            </div>
          )}

          <div className="flex flex-row items-center gap-4">
            <label htmlFor="systemname" className="w-[20%] flex justify-end">
              System Name
            </label>
            <input
              className="flex-grow min-w-0 appearance-none rounded-md border border-[#666666] bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark: dark:focus:border-white sm:text-sm"
              id="systemname"
              type="systemname"
              name="systemname"
              value={systemname}
              onChange={onChangeSystemName}
            />
          </div>
          <div className="flex flex-row items-center gap-4">
            <label htmlFor="upload" className="w-[20%] flex justify-end">
              Videos Upload
            </label>
            <div
              role="presentation"
              tabIndex="0"
              className="w-[80%] p-4 cursor-pointer rounded-lg min-h-36 flex flex-col items-center justify-center text-center appearance-none border border-[#666666] bg-white text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark: dark:focus:border-white sm:text-sm"
              // style="border: 2px dashed rgb(102, 102, 102);"
            >
              <p>Drag and drop some files here, or click to select files</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="pl-[20%] flex justify-start">
              <button className=" flex h-10 items-center gap-2 w-44 betterhover:hover:bg-gray-600 dark:betterhover:hover:bg-gray-300 justify-center rounded-md border border-transparent bg-black px-4 py-2 text-base font-medium  focus:outline-none focus:ring-2 focus:ring-gray-800 dark:bg-white dark:text-black dark:focus:ring-white sm:text-sm  transition-all ">
                Upload CSV
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
