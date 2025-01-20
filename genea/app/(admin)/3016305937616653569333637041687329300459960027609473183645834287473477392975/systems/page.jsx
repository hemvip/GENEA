"use client"
import { clsx as cn } from "clsx"
import axios from "axios"
import React, { Fragment, useCallback, useEffect, useState } from "react"
import { generateUUID } from "@/utils/generateUUID"
import { updateInputCode } from "./actions"
import { calculateCombinations } from "./utils"
import { useSession } from "next-auth/react"
import { Loading } from "@/components"
import SubmissionList from "./submissionlist"
import { Description, Field, Label, Select } from "@headlessui/react"
import { ArrowLeftIcon, ArrowRightIcon } from "@/nextra/icons"
// import { Loading } from "@/components/loading/loading"

const SYSTEM_TYPES = ["groundtruth", "system", "baseline"]

export default function Page() {
  const [systemList, setSystemList] = useState([])
  const [loading, setLoading] = useState(false)
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const [systemType, setSystemType] = useState()
  const [systemname, setSystemName] = useState("")
  const [description, setDescription] = useState("")
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const [submissionList, setSubmissionList] = useState([])
  const [teamID, setTeamID] = useState("")

  async function fetchData() {
    try {
      const res = await axios.get("/api/systems")
      if (res.data.success) {
        setSystemList(res.data.systems)
      } else {
        console.error(res.error)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function fetchSubmission() {
    const res = await axios.get("/api/submission")
    if (res.data.success) {
      setSubmissionList(res.data.submissions)
      setTeamID(res.data.submissions[0].userId)
    } else {
      console.error(res.error)
    }
  }

  function updateSystemType(type) {
    setSystemType(type)
    switch (type) {
      case "groundtruth":
        setSystemName("NA")
        setDescription("Ground truth system")
        break
      case "baseline":
        setSystemName("BA")
        setDescription("Baseline System")
        break
      case "system":
        setSystemName("SA")
        setDescription("System")
        if (submissionList.length <= 0) {
          fetchSubmission()
        }
        break
      default:
        break
    }
  }

  useEffect(() => {
    updateSystemType(systemType)
  }, [systemType])

  useEffect(() => {
    setLoading(true)
    fetchData()
    setSystemType("system")
    setLoading(false)
  }, [])

  async function createSystem(data) {
    try {
      const res = await axios.post("/api/systems", data)
      if (res.data.success) {
        setSystemList(res.data.systems)
      } else {
        console.error(res.error)
      }
    } catch (error) {
      console.error(error)
    }
  }

  function onCreateSystem(e) {
    e.preventDefault()
    const data = {
      name: systemname,
      type: systemType,
      description: description,
      userId: teamID,
    }
    console.log("data", data)
    createSystem(data)
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
              <th className="py-2 pl-6 font-semibold">Type</th>
              <th className="py-2 font-semibold">System name</th>
              <th className="py-2 pl-6 font-semibold">Team name</th>
              <th className="py-2 pl-6 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="align-baseline text-gray-900 dark:text-gray-100">
            {systemList &&
              systemList.map((system, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-neutral-700/50 align-middle"
                >
                  <td className="py-2 pl-6">{index + 1}</td>
                  <td className="py-2 pl-6">{system.type}</td>
                  <td className="py-2 pl-6 font-bold">{system.name}</td>
                  <td className="py-2 pl-6 h-14">
                    {system.teamname == null ? "GENEA" : system.teamname}
                  </td>
                  <td className="py-2 pl-6">{system.description}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="">
        <h2 className="font-semibold tracking-tight text-slate-900 dark:text-slate-100 mt-10 border-b pb-1 text-3xl border-neutral-200/70 contrast-more:border-neutral-400 dark:border-primary-100/10 contrast-more:dark:border-neutral-400">
          Create System
        </h2>
        <form
          className="mt-6 flex flex-col w-[80%] px-10 gap-4"
          onSubmit={onCreateSystem}
        >
          {/* ********************************************************************************** */}
          <div className="flex flex-row items-center gap-4">
            <label htmlFor="systemname" className="w-[20%] flex justify-end">
              System Type
            </label>
            <div className="relative items-center align-middle flex-grow">
              <Select
                name="status"
                value={systemType}
                onChange={(e) => {
                  setSystemType(e.target.value)
                }}
                className={cn(
                  "block w-full bg-black/5 appearance-none py-1.5 px-3 text-sm/6  items-center rounded border border-black",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                  "text-black"
                )}
              >
                {({ focus, hover }) => (
                  <Fragment>
                    {SYSTEM_TYPES.map((sysType, index) => (
                      <option
                        key={index}
                        className="text-gray-800 dark:text-gray-100 relative cursor-pointer whitespace-nowrap py-1.5 transition-colors ltr:pl-3 ltr:pr-9 rtl:pr-3 rtl:pl-9"
                        value={sysType}
                      >
                        {sysType}
                      </option>
                    ))}
                  </Fragment>
                )}
              </Select>
              <ArrowLeftIcon
                className="pointer-events-none absolute top-2.5 right-2.5 size-5  ltr:rotate-90"
                aria-hidden="true"
              />
            </div>
          </div>
          {/* ********************************************************************************** */}
          {systemType === "system" && submissionList.length > 0 ? (
            <div className="flex flex-row items-center gap-4">
              <label htmlFor="name" className="w-[20%] flex justify-end">
                Submission
              </label>
              <div className="relative items-center align-middle flex-grow">
                <SubmissionList
                  teams={submissionList}
                  teamID={teamID}
                  setTeamID={setTeamID}
                />
              </div>
            </div>
          ) : (
            <></>
          )}

          {/* ********************************************************************************** */}
          <div className="flex flex-row items-center gap-4">
            <label htmlFor="systemname" className="w-[20%] flex justify-end">
              System Name
            </label>
            <input
              className="flex-grow min-w-0 appearance-none rounded-md border border-[#666666] bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark: dark:focus:border-white sm:text-sm"
              id="systemname"
              type="text"
              name="systemname"
              value={systemname}
              onChange={(e) => setSystemName(e.target.value)}
            />
          </div>
          {/* ********************************************************************************** */}
          <div className="flex flex-row items-center gap-4">
            <label htmlFor="upload" className="w-[20%] flex justify-end">
              Description
            </label>

            <textarea
              tabIndex="0"
              className="w-[80%] p-4 cursor-pointer rounded-lg min-h-36 flex flex-col items-center justify-center appearance-none border border-[#666666] bg-white text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark: dark:focus:border-white sm:text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          {/* ********************************************************************************** */}
          <div className="flex flex-col items-center">
            <div className="pl-[20%] flex justify-start">
              <button className="flex h-10 items-center gap-2 w-44 betterhover:hover:bg-gray-600 dark:betterhover:hover:bg-gray-300 justify-center rounded-md border border-transparent text-white bg-black px-4 py-2 text-base font-medium  focus:outline-none focus:ring-2 focus:ring-gray-800 dark:bg-white dark:text-black dark:focus:ring-white sm:text-sm  transition-all">
                Create System
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
