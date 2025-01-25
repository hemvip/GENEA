"use client"

import React, { Fragment, useCallback, useEffect, useState } from "react"
import axios from "axios"
import { Select } from "@headlessui/react"
import { useDropzone } from "react-dropzone"
import { Callout } from "@/nextra"
import { Loading } from "@/components/loading/loading"
import { clsx as cn } from "clsx"
import BVHFile from "@/components/icons/bvhfile"
import VideoFile from "@/components/icons/videofile"
import { ArrowLeftIcon } from "@/nextra/icons"

// export default function UploadVideos({ codes, teams }) {
export default function UploadCSV({ teams }) {
  // const [team, setTeam] = useState(teams[0])
  // const [teamID, setTeamID] = useState(teams[0].userId)
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [errorMsg, setErrorMsg] = useState("")
  const [uploading, setUploading] = useState("")
  // const [uploadProgress, setUploadProgress] = useState({})
  const [progress, setProgress] = useState({})
  const [success, setSuccess] = useState("")

  // const [missingList, setMissingList] = useState([])

  const onDrop = useCallback(async (acceptedFiles) => {
    setErrorMsg("")
    setUploading("")
    setSuccess("")

    setFiles(acceptedFiles)
    setProgress({})

    // const selectedFiles = Array.from(acceptedFiles).map((file) => ({
    //   file,
    //   url: URL.createObjectURL(file),
    // }))
    console.log("selectedFiles", acceptedFiles)
    setPreviews(acceptedFiles)

    try {
      // handleUpload()
      // console.log(response.data.message)
    } catch (error) {
      console.error("Error uploading files:", error)
    }
    setUploading("")
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  })

  // const uploadPromise = (file, onProgress) => {
  //   const formData = new FormData()
  //   formData.append("userId", teamID)
  //   formData.append("video", file)

  //   return axios
  //     .post("/api/upload", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //       onUploadProgress: (progressEvent) => {
  //         const percentCompleted = Math.round(
  //           (progressEvent.loaded * 100) / progressEvent.total
  //         )
  //         onProgress(file.name, percentCompleted)
  //       },
  //     })
  //     .then((response) => {
  //       console.log("response", response)
  //       return response.data
  //     })
  //     .catch((error) => {
  //       console.error("error", error.response.data)
  //       return error.response.data
  //     })
  // }

  const handleUpload = async (e) => {
    e.preventDefault()

    if (files.length <= 0) {
      setErrorMsg("Please upload video")
      return
    }

    try {
      setUploading("Uploading your videos, please waiting ...")

      const uploadPromises = Array.from(files).map((file) => {
        return uploadPromise(file, (fileName, percent) => {
          setProgress((prevProgress) => {
            // console.log("prevProgress", prevProgress)
            return {
              ...prevProgress,
              [fileName]: percent,
            }
          })
        })
      })

      const results = await Promise.all(uploadPromises)
      // console.log("results", results)
      const allSuccessful = results.every((result) => result.success)
      if (allSuccessful) {
        const { success, msg, error } = results.at(-1)
        setSuccess(msg)
        console.log("Success", success, "msg", msg, "error", error)
      } else {
        const failedResult = results.filter((result) => !result.success)[0]
        const { success, msg, error } = failedResult
        setErrorMsg(msg)
        console.log("Success", success, "msg", msg, "error", error)
      }
    } catch (error) {
      console.log("EXCEPTION ", error)
      setErrorMsg(
        "EXCEPTION: Error with uploading your videos, please contact support"
      )
      console.log("Exception", error)
    } finally {
      setUploading("")
    }
  }

  if (success) {
    return (
      <div className="w-full p-12 justify-center ">
        <Callout type="info" className="mt-0">
          {success}
        </Callout>
      </div>
    )
  }

  if (uploading) {
    return (
      <div className="w-full px-12  justify-center ">
        <p className="text-center p-4">Uploading...</p>
        <div className="flex flex-col gap-2">
          {files.map((file, idx) => {
            return (
              <div
                className=" mx-32 flex gap-2 items-center border-gray-200 py-2 px-8 shadow"
                key={idx}
              >
                <div className="p-1 bg-gray-200 rounded-lg">
                  <VideoFile />
                </div>
                <span className="text-sm">{file.name}</span>
                <div className="flex-grow">
                  <div className="overflow-hidden mx-auto max-w-96 h-2 text-xs flex rounded-3xl bg-blue-200">
                    {progress[file.name] ? (
                      <div
                        style={{ width: `${progress[file.name]}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      >
                        <span className="relative left-0 right-0 w-full text-center text-blue-800"></span>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <span className="text-xs bg-gray-200 px-2 rounded-xl">
                  {`${progress[file.name] || 0}%`}
                </span>
              </div>
            )
          })}
        </div>
        <Callout type="warning" className="mt-0">
          {uploading}
        </Callout>
      </div>
    )
  }

  return (
    <form className="mt-6 flex flex-col w-[80%] px-10 gap-4">
      {/* <div className="flex flex-row items-center gap-4">
        <label htmlFor="name" className="w-[20%] flex justify-end">
          Team
        </label>
        <div className="relative items-center align-middle flex-grow">
          <Select
            name="status"
            onChange={(e) => setTeamID(e.target.value)}
            className={cn(
              "block w-full appearance-none py-1.5 px-3 text-sm/6  items-center rounded border border-black",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
              "text-black"
            )}
          >
            {({ focus, hover }) => (
              // <select
              //   className={cn(
              //     "border",
              //     focus && "bg-blue-100",
              //     hover && "shadow",
              //     "flex-grow min-w-0 appearance-none rounded-md border border-[#666666] bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
              //   )}
              //   onChange={(e) => setTeamID(e.target.value)}
              //   aria-label="Project status"
              // >
              <>
                {teams.map((team, index) => (
                  <option
                    key={index}
                    className="text-gray-800 dark:text-gray-100 relative cursor-pointer whitespace-nowrap py-1.5 transition-colors ltr:pl-3 ltr:pr-9 rtl:pr-3 rtl:pl-9"
                    value={team.userId}
                  >
                    {team.teamname}
                  </option>
                ))}
              </>
              // </select>
            )}
          </Select>
          <ArrowLeftIcon
            className="pointer-events-none absolute top-2.5 right-2.5 size-5  ltr:rotate-90"
            aria-hidden="true"
          />
        </div>
      </div> */}

      {/* <div className="flex flex-row items-center gap-4">
        <label htmlFor="userId" className="w-[20%] flex justify-end">
          Team ID
        </label>
        <input
          disabled={true}
          className="flex-grow min-w-0 disabled:bg-gray-200 appearance-none rounded-md border border-[#666666] bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
          id="userId"
          type="userId"
          name="userId"
          value={teamID}
        />
      </div> */}

      <div className="flex flex-row items-center gap-4">
        <label htmlFor="upload" className="w-[20%] flex justify-end">
          CSV Upload
        </label>
        <div
          {...getRootProps()}
          style={{ border: "2px dashed #666666" }}
          className="w-[80%] p-4 cursor-pointer rounded-lg min-h-36 flex flex-col items-center justify-center text-center appearance-none border border-[#666666] bg-white text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
        >
          <input
            id="upload"
            {...getInputProps()}
            type="file"
            accept=".csv"
            multiple={true}
          />
          {previews && previews.length > 0 && (
            <ul className="w-full flex flex-wrap gap-2 justify-center">
              {previews.map((previewFile, index) => {
                console.log("object", previewFile)
                return (
                  <li
                    key={index}
                    title={previewFile.name}
                    className="w-32 flex flex-col justify-center items-center gap-1 p-2  border rounded-md border-black"
                  >
                    {/* <div width="160" height="120" controls></div> */}
                    <p className="">{previewFile.name}</p>
                  </li>
                )
              })}
            </ul>
          )}
          {isDragActive ? (
            <p>Drop csv files here...</p>
          ) : (
            <p>Drag and drop csv files here, or click to select csv</p>
          )}
        </div>
      </div>

      {errorMsg && (
        <div className="w-full pl-[20%]">
          <Callout type="error" className="mt-0">
            {errorMsg}
          </Callout>
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className="pl-[20%] flex justify-start">
          <button
            className=" flex h-10 items-center gap-2 w-44 betterhover:hover:bg-gray-600 dark:betterhover:hover:bg-gray-300 justify-center rounded-md border border-transparent bg-black px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-gray-800 dark:bg-white dark:text-black dark:focus:ring-white sm:text-sm  transition-all "
            onClick={handleUpload}
          >
            Generate Study
          </button>
        </div>
      </div>
    </form>
  )
}
