"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Callout } from "@/nextra"
import { Loading } from "@/components/loading/loading"
import axios from "axios"
import BVHFile from "@/components/icons/bvhfile"
import {
  COMPLETE_UPLOAD_API_ENDPOINT,
  START_UPLOAD_API_ENDPOINT,
  UPLOAD_PART_API_ENDPOINT,
} from "@/config/constants"
import { UploadStatus } from "@/components/UploadStatus"
import { useAuth } from "@/contexts/auth"

export default function UploadNPY({ codes }) {
  const { email, name: teamname, username, userId, isSignedIn } = useAuth()
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [errorMsg, setErrorMsg] = useState("")
  const [uploading, setUploading] = useState("")
  // const [uploadProgress, setUploadProgress] = useState({})
  const [progress, setProgress] = useState({})
  const [successMsg, setSuccessMsg] = useState("")

  // const [email, setEmail] = useState("")
  // const [teamname, setTeamName] = useState("")

  const [missingList, setMissingList] = useState([])

  // useEffect(() => {
  //   setEmail(email)
  //   setTeamName(name)
  // }, [])

  const onDrop = useCallback(
    async (acceptedFiles) => {
      setErrorMsg("")
      setUploading("")
      setSuccessMsg("")

      const missing = []
      codes.map((code) => {
        const found = acceptedFiles.find((file) => file.name === `${code}.npy`)
        if (!found) {
          missing.push(`${code}.npy`)
        }
      })
      setMissingList(missing)
      setFiles(acceptedFiles)
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
    },
    [codes]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const updateUploadProgress = useCallback((fileName, percent, status) => {
    setProgress((prevProgress) => {
      return {
        ...prevProgress,
        [fileName]: { percent: percent, status: status },
      }
    })
  }, [])

  const uploadFile = async (file, index, teamid) => {
    const chunkSize = 5 * 1024 * 1024 // 5MB chunks
    const totalChunks = Math.ceil(file.size / chunkSize)
    console.log("totalChunks", totalChunks)
    const fileName = file.name
    const fileSize = file.size
    console.log("uploadFile.userId", teamid)

    try {
      updateUploadProgress(fileName, 0, "uploading")

      console.log("START_UPLOAD_API_ENDPOINT", START_UPLOAD_API_ENDPOINT)

      // Start multipart upload
      const startResp = await axios.post(
        START_UPLOAD_API_ENDPOINT,
        {
          userId: teamid,
          fileName: fileName,
          fileSize: fileSize,
        },
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      const { uploadId } = startResp.data

      // Upload all parts
      // const uploadChunkResp = await Promise.all(uploadPromises)
      const parts = []
      for (let i = 1; i <= totalChunks; i++) {
        const start = (i - 1) * chunkSize
        const end = Math.min(start + chunkSize, file.size)
        const chunk = file.slice(start, end)

        const formData = new FormData()
        formData.append("userId", teamid)
        formData.append("file", chunk, fileName)
        formData.append("partNumber", i.toString())
        formData.append("uploadId", uploadId)
        formData.append("fileName", fileName)
        formData.append("fileSize", fileSize)
        formData.append("chunkSize", chunk.size)

        const uploadChunkResp = await axios.post(
          UPLOAD_PART_API_ENDPOINT,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              "Content-Length": chunk.size,
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

      // Complete multipart upload
      console.log("parts", parts)
      const completeUploadResp = await axios.post(
        COMPLETE_UPLOAD_API_ENDPOINT,
        {
          userId: teamid,
          uploadId: uploadId,
          fileName: fileName,
          fileSize: fileSize,
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

    if (isSignedIn === false) {
      setErrorMsg("Please login with github")
      return
    }

    if (files.length <= 0) {
      setErrorMsg("Please upload video")
      return
    }

    if (missingList.length > 0) {
      setErrorMsg("Please upload missing files")
      return
    }

    if (!email) {
      setErrorMsg("Please add email address")
      return
    }

    if (!teamname) {
      setErrorMsg("Please add your team name")
      return
    }

    try {
      setUploading("Uploading your submission, please waiting ...")
      const teamid = String(username).toLowerCase()

      //~~~~~~~~  Update submission info to database ~~~~~~~~
      const formData = new FormData()
      formData.append("userId", userId)
      formData.append("email", email)
      formData.append("teamid", teamid)
      formData.append("teamname", teamname)
      const res = await axios.post("/api/submission", formData)
      console.log("res", res)

      if (!res.data.success) {
        console.log(res.data)
        setErrorMsg(
          "Duplicated submission, only submit once, please contact support"
        )
      }

      //~~~~~~~~  Upload all bvh files ~~~~~~~~
      // Upload all files concurrently
      // const results = await Promise.all(
      //   files.map((file, index) => uploadFile(file, index, session.userId))
      // )
      console.log("files", files)
      const results = []
      for (let index = 0; index < files.length; index++) {
        const result = await uploadFile(files[index], index, teamid)
        results.push(result)
      }
      console.log("results.uploadFile", results)
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
      console.log(error)
      setErrorMsg(
        "EXCEPTION: Error with uploading your submission, please contact support"
      )
      console.log("Exception", error)
    } finally {
      // setUploading("")
    }
  }

  if (status === "loading") {
    return (
      <div className="flex w-full p-32 justify-center ">
        <Loading />
      </div>
    )
  }

  if (!isSignedIn) {
    return <Callout type="error">Please login with github</Callout>
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
        <div className="flex flex-col gap-2">
          {files.map((file, idx) => {
            // console.log("file", file)
            // console.log("progress", progress)

            return (
              <div
                className=" mx-32 flex gap-2 items-center border-gray-200 py-2 px-8 shadow"
                key={idx}
              >
                <div className="p-1 bg-gray-200 rounded-lg">
                  <BVHFile />
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
        {successMsg ? (
          <div className="w-full p-12 justify-center ">
            <Callout type="info" className="mt-0">
              {successMsg}
            </Callout>
          </div>
        ) : (
          <Callout type="warning" className="mt-0">
            {uploading}
          </Callout>
        )}
      </div>
    )
  }

  return (
    <form className="mt-6 flex flex-col px-4 gap-4">
      <div className="flex flex-row items-center gap-4">
        <label htmlFor="name" className="w-[20%] text-right">
          Team Name
        </label>
        <input
          className="flex-grow min-w-0 appearance-none rounded-md border border-[#666666] bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
          id="name"
          type="name"
          name="name"
          value={teamname}
          onChange={(e) => setTeamName(e.target.value)}
        />
      </div>

      <div className="flex flex-row items-center gap-4">
        <label htmlFor="email-address" className="w-[20%] text-right">
          Email address
        </label>
        <input
          className="flex-grow min-w-0 appearance-none rounded-md border border-[#666666] bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
          id="email-address"
          type="email"
          name="email-address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-row items-center gap-4">
        <label htmlFor="username" className="w-[20%] text-right">
          Username <span>*</span>
        </label>
        <input
          disabled={true}
          className="flex-grow disabled:bg-gray-200 min-w-0 appearance-none rounded-md border border-[#666666] bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
          id="username"
          type="username"
          name="username"
          value={username}
        />
      </div>

      <div className="flex flex-row items-center gap-4">
        <label htmlFor="userId" className="w-[20%] text-right">
          Your ID <span>*</span>
        </label>
        <input
          disabled={true}
          className="flex-grow min-w-0 disabled:bg-gray-200 appearance-none rounded-md border border-[#666666] bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
          id="userId"
          type="userId"
          name="userId"
          value={userId}
        />
      </div>

      <div className="flex flex-row items-center gap-4">
        <label htmlFor="upload" className="w-[20%] text-right">
          NPY Files Upload
        </label>
        <div
          {...getRootProps()}
          style={{ border: "2px dashed #666666" }}
          className="w-[80%] p-4 cursor-pointer rounded-lg min-h-36 flex flex-col items-center justify-center text-center appearance-none border border-[#666666] bg-white text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
        >
          <input id="upload" {...getInputProps()} accept=".npy" />
          {previews.length > 0 && (
            <ul className="w-full flex flex-wrap gap-2 justify-center">
              {previews.map(({ file, url }, index) => (
                <li
                  title={file.name}
                  key={index}
                  className="w-32 flex flex-col justify-center items-center gap-1 p-2  border rounded-md border-black"
                >
                  <p
                    title={file.name}
                    className="overflow-hidden text-ellipsis whitespace-nowrap w-28"
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

      {missingList.length > 0 && (
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
      )}

      <div className="flex flex-col items-center">
        <div className="pl-[20%] flex justify-start">
          <button
            className=" flex h-10 items-center gap-2 w-44 betterhover:hover:bg-gray-600 dark:betterhover:hover:bg-gray-300 justify-center rounded-md border border-transparent bg-black px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-gray-800 dark:bg-white dark:text-black dark:focus:ring-white sm:text-sm  transition-all "
            onClick={handleUpload}
          >
            Submission
          </button>
        </div>
      </div>
    </form>
  )
}
