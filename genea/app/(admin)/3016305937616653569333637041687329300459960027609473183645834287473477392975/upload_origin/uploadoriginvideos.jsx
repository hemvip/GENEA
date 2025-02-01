"use client"

import React, { Fragment, useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Callout } from "@/nextra"
import { Loading } from "@/components/loading/loading"
import axios from "axios"
import clsx from "clsx"
import BVHFile from "@/components/icons/bvhfile"
import { Select } from "@headlessui/react"
import VideoFile from "@/components/icons/videofile"
import SystemList from "./systemlist"
import {
  VIDEO_START_UPLOAD_API_ENDPOINT,
  VIDEO_UPLOAD_PART_API_ENDPOINT,
  VIDEO_COMPLETE_UPLOAD_API_ENDPOINT,
} from "@/config/constants"
import { UploadStatus } from "@/components/UploadStatus"

// export default function UploadVideos({ codes, teams }) {
export default function UploadOriginVideos({ systemList }) {
  // const [team, setTeam] = useState(teams[0])
  const [selectedIndex, setSelectedIndex] = useState(0)
  // const [systemID, setSystemID] = useState("")
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [errorMsg, setErrorMsg] = useState("")
  const [uploading, setUploading] = useState("")
  // const [uploadProgress, setUploadProgress] = useState({})
  const [progress, setProgress] = useState({})
  const [successMsg, setSuccessMsg] = useState("")
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const [description, setDescription] = useState("")
  // const [missingList, setMissingList] = useState([])
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const onDrop = useCallback(async (acceptedFiles) => {
    setErrorMsg("")
    setUploading("")
    setSuccessMsg("")

    // const missing = []
    // codes.map((code) => {
    //   const found = acceptedFiles.find((file) => file.name === `${code}.mp4`)
    //   if (!found) {
    //     missing.push(`${code}.mp4`)
    //   }
    // })
    // setMissingList(missing)

    // Do something with the files, like upload to a server
    // console.log("acceptedFiles", acceptedFiles)
    setFiles(acceptedFiles)
    // setProgress({})
    setProgress(
      Array.from(acceptedFiles).reduce((progressItems, fileItem) => {
        progressItems[fileItem.name] = { percent: 0, status: "pending" }
        return progressItems
      }, {})
    )

    const selectedFiles = Array.from(acceptedFiles).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
    setPreviews(selectedFiles)

    try {
      // handleUpload()
      // console.log(response.data.message)
    } catch (error) {
      console.error("Error uploading files:", error)
    }
    setUploading("")
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  useEffect(() => {
    console.log("selectedIndex", selectedIndex, systemList)
    setDescription(systemList[selectedIndex].description)
  }, [selectedIndex, systemList])

  useEffect(() => {
    setSelectedIndex(0)
  }, [systemList])

  const updateUploadProgress = useCallback((fileName, percent, status) => {
    setProgress((prevProgress) => {
      return {
        ...prevProgress,
        [fileName]: { percent: percent, status: status },
      }
    })
  }, [])

  const uploadFile = async (file, index, systemname) => {
    const chunkSize = 5 * 1024 * 1024 // 5MB chunks
    const totalChunks = Math.ceil(file.size / chunkSize)
    console.log("totalChunks", totalChunks)
    const fileName = file.name
    const totalSize = file.size
    console.log("uploadFile.systemname", systemname)

    try {
      // *************** START UPLOAD ***************
      updateUploadProgress(fileName, 0, "uploading")

      console.log(
        "VIDEO_START_UPLOAD_API_ENDPOINT",
        VIDEO_START_UPLOAD_API_ENDPOINT
      )

      // Start multipart upload
      const startResp = await axios.post(
        VIDEO_START_UPLOAD_API_ENDPOINT,
        {
          systemname: systemname,
          fileName: fileName,
          totalSize: totalSize,
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      const { uploadId } = startResp.data
      console.log("uploadId", uploadId)

      // Upload all parts
      // const uploadChunkResp = await Promise.all(uploadPromises)

      // *************** PARTS UPLOAD ***************
      const parts = []
      for (let i = 1; i <= totalChunks; i++) {
        const start = (i - 1) * chunkSize
        const end = Math.min(start + chunkSize, file.size)
        const chunk = file.slice(start, end)

        const formData = new FormData()
        formData.append("systemname", systemname)
        formData.append("file", chunk, fileName)
        formData.append("partNumber", i.toString())
        formData.append("uploadId", uploadId)
        formData.append("fileName", fileName)
        formData.append("totalSize", totalSize)
        formData.append("chunkSize", chunk.size)

        const uploadChunkResp = await axios.post(
          VIDEO_UPLOAD_PART_API_ENDPOINT,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
              )
              const overallProgress = Math.round(
                ((i - 1 + percentCompleted / 100) * 100) / totalChunks
              )

              updateUploadProgress(fileName, overallProgress, "uploading")
            },
          }
        )
        // uploadChunkResp.push(result)
        parts.push({
          PartNumber: parts.length + 1,
          ETag: uploadChunkResp.data.ETag.replace(/\"/g, ""),
        })
      }

      // *************** COMPLETE UPLOAD ***************
      // Complete multipart upload
      console.log("parts", parts)
      const completeUploadResp = await axios.post(
        VIDEO_COMPLETE_UPLOAD_API_ENDPOINT,
        {
          systemname: systemname,
          uploadId: uploadId,
          fileName: fileName,
          fileSize: totalSize,
          parts: JSON.stringify(parts),
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      updateUploadProgress(fileName, 100, "completed")

      return completeUploadResp.data
      // return partUploadResponse.data
    } catch (err) {
      console.error("Error uploading file:", err)
      // setErrorMsg("Error uploading file")
      updateUploadProgress(fileName, 0, "error")
      const { success, msg, error } = err.response.data
      return { success, msg, error }
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    if (files.length <= 0) {
      setErrorMsg("Please upload video")
      return
    }

    const systemname = systemList[selectedIndex].name

    if (!systemname) {
      setErrorMsg("System selected not found")
      return
    }

    // if (missingList.length > 0) {
    //   setErrorMsg("Please upload missing files")
    //   return
    // }

    try {
      setUploading("Uploading your videos, please waiting ...")

      // const uploadPromises = Array.from(files).map((file) => {
      //   return uploadPromise(file, (fileName, percent) => {
      //     setProgress((prevProgress) => {
      //       // console.log("prevProgress", prevProgress)
      //       return {
      //         ...prevProgress,
      //         [fileName]: percent,
      //       }
      //     })
      //   })
      // })

      console.log("systemname", systemname)

      const results = []
      // const results = await Promise.all(uploadPromises)
      for (let index = 0; index < files.length; index++) {
        const result = await uploadFile(files[index], index, systemname)
        results.push(result)
      }
      // console.log("results", results)
      const allSuccessful = results.every((result) => result.success)
      if (allSuccessful) {
        const { success, msg, error } = results.at(-1)
        setSuccessMsg(msg)
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

  if (systemList.length <= 0) {
    return <></>
  }

  if (successMsg) {
    return (
      <div className="w-full p-12 justify-center ">
        <Callout type="info" className="mt-0">
          {successMsg}
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
            // console.log("progress", progress)

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
                  <div className="overflow-hidden mx-auto max-w-72 h-2 text-xs flex rounded-3xl min-w-20 bg-blue-200">
                    {progress[file.name] && progress[file.name].percent ? (
                      <div
                        style={{ width: `${progress[file.name].percent}%` }}
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
                  {`${progress[file.name].percent || 0}%`}
                </span>

                {progress[file.name] && progress[file.name].status && (
                  <UploadStatus type={progress[file.name].status} />
                )}
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
    <form className="mt-6 flex flex-col px-4 gap-4">
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <div className="flex flex-row items-center gap-4">
        <label htmlFor="name" className="w-[20%] text-right">
          System Name
        </label>
        <div className="w-[80%] items-center align-middle flex-grow">
          <SystemList
            systemList={systemList}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
          />
        </div>
      </div>

      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <div className="flex flex-row items-center gap-4">
        <label htmlFor="name" className="w-[20%] text-right">
          Team Name
        </label>
        <div className="w-[80%] items-center align-middle flex-grow ">
          <input
            disabled={true}
            className="w-full disabled:bg-gray-200 appearance-none rounded-md border border-[#666666] bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
            id="description"
            type="text"
            name="description"
            value={description}
          />
        </div>
      </div>

      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <div className="flex flex-row items-center gap-4">
        <label htmlFor="upload" className="w-[20%] text-right">
          Videos Upload
        </label>
        <div
          {...getRootProps()}
          style={{ border: "2px dashed #666666" }}
          className="w-[80%] p-4 cursor-pointer rounded-lg min-h-36 flex flex-col items-center justify-center text-center appearance-none border border-[#666666] bg-white text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
        >
          <input id="upload" {...getInputProps()} accept="video/*" />
          {previews.length > 0 && (
            <ul className="w-full flex flex-wrap gap-2 justify-center">
              {previews.map(({ file, url }, index) => (
                <li
                  title={file.name}
                  key={index}
                  className="min-w-24 max-w-40  flex flex-col justify-center items-center gap-1 p-2 border rounded-md border-black"
                >
                  <video title={file.name} width={200} height={80} controls>
                    <source src={url} type={file.type} />
                    Your browser does not support the video tag.
                  </video>
                  <p
                    title={file.name}
                    className="w-32 overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {file.name}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <p>Drag and drop some files here, or click to select files</p>
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

      {/* {missingList.length > 0 && (
        <Callout type="error">
          You upload missing following files:
          <div className="flex flex-wrap gap-2 text-sm">
            {missingList.map((filemis, index) => (
              <code key={index} className="text-xs px-2">
                {filemis}
              </code>
            ))}
          </div>
        </Callout>
      )} */}

      <div className="flex flex-col items-center">
        <div className="pl-[20%] flex justify-start">
          <button
            className=" flex h-10 items-center gap-2 w-44 betterhover:hover:bg-gray-600 dark:betterhover:hover:bg-gray-300 justify-center rounded-md border border-transparent bg-black px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-gray-800 dark:bg-white dark:text-black dark:focus:ring-white sm:text-sm  transition-all "
            onClick={handleUpload}
          >
            Upload Video
          </button>
        </div>
      </div>
    </form>
  )
}
