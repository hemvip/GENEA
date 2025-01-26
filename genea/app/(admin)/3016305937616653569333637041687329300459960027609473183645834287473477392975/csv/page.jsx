"use client"

import Image from "next/image"
import UploadCSV from "./uploadcsv"
import { useEffect, useState } from "react"
// import fetchInputCodes from "./actions"
import InputCode from "./inputcode"
import axios from "axios"
import { Loading } from "@/components"
import CSVPreviewer from "./CSVPreviewer"
import JSON from "@/components/icons/json"
import CSV from "@/components/icons/csv"

export default function Page() {
  const [csvList, setCsvList] = useState([])
  const [loadedCSV, setLoadedCSV] = useState(false)

  // if (loading) {
  //   return (
  //     <div className="text-center">
  //       <Loading />
  //     </div>
  //   )
  // }

  const handleUpload = async (e) => {
    e.preventDefault()
    console.log("csvList", csvList)

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
          <UploadCSV
            setCsvList={setCsvList}
            loadedCSV={loadedCSV}
            setLoadedCSV={setLoadedCSV}
          />

          <div className="flex flex-col py-4 gap-4">
            {csvList.map(({ data: csvData, filename }, index) => {
              return (
                <div
                  key={index}
                  data-pagefind-ignore="all"
                  className="nextra-code relative not-first:mt-6"
                >
                  <div className="px-4 text-xs text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-neutral-900 flex items-center h-10 gap-2 rounded-t-md border border-gray-300 dark:border-neutral-700 contrast-more:border-gray-900 contrast-more:dark:border-gray-50 border-b-0">
                    <CSV className="w-4 h-4" />
                    <span className="truncate">{filename}</span>
                  </div>
                  <pre
                    className="group focus-visible:nextra-focus overflow-x-auto subpixel-antialiased text-[.9em] bg-white dark:bg-black py-4 ring-1 ring-inset ring-gray-300 dark:ring-neutral-700 contrast-more:ring-gray-900 contrast-more:dark:ring-gray-50 contrast-more:contrast-150 rounded-b-md not-prose"
                    tabIndex="0"
                  >
                    <div className="group-hover:opacity-100 group-focus:opacity-100 opacity-0 transition focus-within:opacity-100 flex gap-1 absolute right-4 top-14">
                      <button
                        className="transition border border-gray-300 dark:border-neutral-700 contrast-more:border-gray-900 contrast-more:dark:border-gray-50 rounded-md p-1.5 md:hidden"
                        title="Toggle word wrap"
                        type="button"
                        data-headlessui-state=""
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          height="16"
                        >
                          <path d="M4 19h6v-2H4v2zM20 5H4v2h16V5zm-3 6H4v2h13.25c1.1 0 2 .9 2 2s-.9 2-2 2H15v-2l-3 3l3 3v-2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4z"></path>
                        </svg>
                      </button>
                    </div>
                    <div className="nextra-code" dir="ltr">
                      <CSVPreviewer
                        key={index}
                        csvData={csvData.slice(1)}
                        headers={csvData[0]}
                      />
                    </div>
                  </pre>
                </div>
              )
            })}
          </div>
          {loadedCSV && (
            <div className="flex flex-col items-center">
              <div className=" flex justify-start">
                <button
                  className=" flex h-10 items-center gap-2 w-44 betterhover:hover:bg-gray-600 dark:betterhover:hover:bg-gray-300 justify-center rounded-md border border-transparent bg-black px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-gray-800 dark:bg-white dark:text-black dark:focus:ring-white sm:text-sm  transition-all "
                  onClick={handleUpload}
                >
                  Generate Study
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  )
}
