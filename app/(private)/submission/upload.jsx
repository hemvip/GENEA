"use client"

import { useSession } from "next-auth/react"
import React, { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Callout } from "@/nextra"
import Loading from "@/components/loading/loading"
import axios from "axios"

export default function Upload() {
  const { data: session, status } = useSession()
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [errorMsg, setErrorMsg] = useState("")
  const [uploading, setUploading] = useState("")
  const [success, setSuccess] = useState("")

  const [email, setEmail] = useState("")
  const [teamname, setTeamName] = useState("")

  useEffect(() => {
    if (session) {
      setEmail(session.email)
      setTeamName(session.name)
    }
  }, [session])

  const onDrop = useCallback(async (acceptedFiles) => {
    setErrorMsg("")
    setUploading("")
    setSuccess("")

    // Do something with the files, like upload to a server
    // console.log(acceptedFiles)
    setFiles(acceptedFiles)
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
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!session) {
      setErrorMsg("Please login with github")
      return
    }

    if (files.length <= 0) {
      setErrorMsg("Please upload video")
      return
    }

    // if (!email) {
    //   setErrorMsg("Please add email address")
    //   return
    // }

    // if (!teamname) {
    //   setErrorMsg("Please add your team name")
    //   return
    // }

    try {
      setUploading("Uploading your submission, please waiting ...")
      const formData = new FormData()
      formData.append("userId", session.userId)
      formData.append("email", email)
      formData.append("teamname", teamname)

      for (let i = 0; i < files.length; i++) {
        formData.append("video", files[i])
      }

      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const { success, msg, error } = response.data
      if (success) {
        setSuccess(msg)
      } else {
        setErrorMsg(msg)
        console.log(error)
      }
    } catch (error) {
      setErrorMsg(error)
    } finally {
      setUploading("")
    }
  }

  if (status === "loading") {
    return (
      <div className="flex w-full p-32 justify-center ">
        <Loading />
      </div>
    )
  }

  if (!session) {
    return <Callout type="error">Please login with github</Callout>
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
      <div className="w-full p-12  justify-center ">
        <div className="flex w-full justify-center">
          <Loading className="" />
        </div>

        <Callout type="warning" className="mt-0">
          {uploading}
        </Callout>
      </div>
    )
  }

  return (
    <form className="mt-6 flex flex-col w-[80%] px-10 gap-4">
      <div className="flex flex-row items-center gap-4">
        <label htmlFor="name" className="w-[20%] flex justify-end">
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
        <label htmlFor="email-address" className="w-[20%] flex justify-end">
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
        <label htmlFor="username" className="w-[20%] flex justify-end">
          Github username
        </label>
        <input
          disabled={true}
          className="flex-grow disabled:bg-gray-200 min-w-0 appearance-none rounded-md border border-[#666666] bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
          id="username"
          type="username"
          name="username"
          value={session.username}
        />
      </div>

      <div className="flex flex-row items-center gap-4">
        <label htmlFor="userId" className="w-[20%] flex justify-end">
          Your ID
        </label>
        <input
          disabled={true}
          className="flex-grow min-w-0 disabled:bg-gray-200 appearance-none rounded-md border border-[#666666] bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
          id="userId"
          type="userId"
          name="userId"
          value={session.userId}
        />
      </div>

      <div className="flex flex-row items-center gap-4">
        <label htmlFor="upload" className="w-[20%] flex justify-end">
          Videos upload
        </label>
        <div
          {...getRootProps()}
          style={{ border: "2px dashed #666666" }}
          className="w-[80%] p-4 cursor-pointer rounded-lg text-center appearance-none border border-[#666666] bg-white text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
        >
          <input id="upload" {...getInputProps()} accept="video/*" />
          {previews.length > 0 && (
            <ul className="w-full flex flex-wrap gap-2 justify-center">
              {previews.map(({ file, url }, index) => (
                <li
                  key={index}
                  className="w-32 flex flex-col justify-center items-center gap-1 p-2  border rounded-md border-black"
                >
                  <video width="160" height="120" controls>
                    <source src={url} type={file.type} />
                    Your browser does not support the video tag.
                  </video>
                  <p>{file.name}</p>
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
          <Callout type="error" className="mt-0  ">
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
            Submission
          </button>
        </div>
      </div>
    </form>
  )
}
