"use client"

import { Fragment, useEffect, useState } from "react"
import Image from "next/image"
import { clsx as cn } from "clsx"
import axios from "axios"

import { Callout } from "@/nextra"
import { Loading } from "@/components"
import { Select } from "@headlessui/react"
import { ArrowLeftIcon } from "@/nextra/icons"
import { SYSTEM_TYPES } from "@/config/constants"
import CSVPreviewer from "./CSVPreviewer"
import UploadBox from "./UploadBox"

export default function Page() {
  const [csvList, setCsvList] = useState([])
  const [loadedCSV, setLoadedCSV] = useState(false)
  const [systemType, setSystemType] = useState(Object.keys(SYSTEM_TYPES)[0])
  const [isValid, setIsValid] = useState(false)

  // if (loading) {
  //   return (
  //     <div className="text-center">
  //       <Loading />
  //     </div>
  //   )
  // }

  const handleValidate = async (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0 })

    for (let i = 0; i < csvList.length; i++) {
      const { data, filename } = csvList[i]

      // Update state to indicate validation is in progress
      setCsvList((prevList) =>
        prevList.map((item, index) =>
          index === i ? { ...item, state: "loading" } : item
        )
      )

      try {
        const res = await axios.patch(`/api/${systemType}`, {
          csv: data.slice(1),
        })

        setCsvList((prevList) =>
          prevList.map((item, index) =>
            index === i
              ? {
                  ...item,
                  state: res.data.success ? "success" : "error",
                  errorMsg: res.data.success ? "" : res.data.message,
                }
              : item
          )
        )
      } catch (error) {
        console.error("Validation error:", error)
        setCsvList((prevList) =>
          prevList.map((item, index) =>
            index === i
              ? {
                  ...item,
                  state: "error",
                  errorMsg:
                    error.response?.data?.message || "Unknown error occurred",
                }
              : item
          )
        )
      }

      document.getElementById(`csv-previewer-${i}`).scrollIntoView()
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    // console.log("systemType", systemType)
    // console.log("csvList", csvList)
    const url = `/api/${systemType}`
    console.log(url, "systemType, csvList", systemType, csvList)

    try {
      const res = axios
        .post(url, { systemType: systemType, csvList: csvList })
        .then((res) => {
          console.log("res", res)
        })
    } catch (error) {
      console.log("error", error)
    }

    // if (files.length <= 0) {
    //   setErrorMsg("Please upload video")
    //   return
    // }

    // try {
    //   setUploading("Uploading your videos, please waiting ...")

    //   const uploadPromises = Array.from(files).map((file) => {
    //     return uploadPromise(file, (fileName, percent) => {
    //       setProgress((prevProgress) => {
    //         // console.log("prevProgress", prevProgress)
    //         return {
    //           ...prevProgress,
    //           [fileName]: percent,
    //         }
    //       })
    //     })
    //   })

    //   const results = await Promise.all(uploadPromises)
    //   // console.log("results", results)
    //   const allSuccessful = results.every((result) => result.success)
    //   if (allSuccessful) {
    //     const { success, msg, error } = results.at(-1)
    //     setSuccess(msg)
    //     console.log("Success", success, "msg", msg, "error", error)
    //   } else {
    //     const failedResult = results.filter((result) => !result.success)[0]
    //     const { success, msg, error } = failedResult
    //     setErrorMsg(msg)
    //     console.log("Success", success, "msg", msg, "error", error)
    //   }
    // } catch (error) {
    //   console.log("EXCEPTION ", error)
    //   setErrorMsg(
    //     "EXCEPTION: Error with uploading your videos, please contact support"
    //   )
    //   console.log("Exception", error)
    // } finally {
    //   setUploading("")
    // }
  }

  return (
    <>
      <h2 className="font-semibold tracking-tight text-slate-900 dark:text-slate-100 mt-10 border-b pb-1 text-3xl border-neutral-200/70 contrast-more:border-neutral-400 dark:border-primary-100/10 contrast-more:dark:border-neutral-400">
        Upload CSV Studies
      </h2>
      <div className="mt-6 mb-32">
        {/* <p className="mt-3 leading-7 first:mt-0">Github information</p> */}
        <form className="mt-6 flex flex-col gap-4">
          <UploadBox
            setCsvList={setCsvList}
            loadedCSV={loadedCSV}
            setLoadedCSV={setLoadedCSV}
          />

          <div className="flex flex-col py-4 gap-4">
            {csvList.map(({ data, filename, state, errorMsg }, index) => {
              return (
                <CSVPreviewer
                  key={index}
                  index={index}
                  data={data}
                  filename={filename}
                  state={state}
                  errorMsg={errorMsg}
                />
              )
            })}
          </div>
          {loadedCSV && (
            <div className="flex flex-col gap-4">
              {/* ********************************************************************************** */}
              <div className="flex flex-row items-center gap-4">
                <label htmlFor="studytype" className="w-[20%] flex justify-end">
                  Study Type
                </label>
                <div className="relative items-center align-middle flex-grow">
                  <Select
                    name="status"
                    id="studytype"
                    value={systemType}
                    onChange={(e) => {
                      setSystemType(e.target.value)
                    }}
                    className={cn(
                      "w-full appearance-none rounded-md border border-[#666666] px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
                    )}
                  >
                    {({ focus, hover }) => (
                      <Fragment>
                        {Object.entries(SYSTEM_TYPES).map(([key, sysType]) => (
                          <option
                            key={key}
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

              <div className="flex flex-col gap-8 mt-4 items-center">
                <div className="flex justify-start">
                  <button
                    id="validate"
                    className="flex cursor-pointer h-10 items-center gap-2 w-44 betterhover:hover:bg-green-600 dark:betterhover:hover:bg-green-300 justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-green-600 dark:bg-white dark:text-black dark:focus:ring-white sm:text-sm transition-all"
                    onClick={handleValidate}
                  >
                    Validate CSV
                  </button>
                </div>
                <div className="flex justify-start">
                  <button
                    className="cursor-pointer flex h-10 items-center gap-2 w-44 betterhover:hover:bg-gray-600 dark:betterhover:hover:bg-gray-300 justify-center rounded-md border border-transparent bg-black px-4 py-2 text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-gray-800 dark:bg-white dark:text-black dark:focus:ring-white sm:text-sm  transition-all "
                    onClick={handleUpload}
                  >
                    Generate Study
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  )
}
