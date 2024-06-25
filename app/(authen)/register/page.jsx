"use client"

import React, { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
// import { useRouter } from 'next/router';
import Loading from "@/components/loading/loading.jsx"

import { Callout } from "@/nextra"

export default function RegisterPage({ searchParams }) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(searchParams.error)

  // const handleRegister = useCallback(
  //   async (e) => {
  //     e.preventDefault()
  //     // setLoading(true)

  //     // const supabase = createClient()

  //     // const data = {
  //     //     email: email,
  //     //     password: password,
  //     // }

  //     // const { error } = await supabase.auth.signUp(data)

  //     // setLoading(false)

  //     // if (error) {
  //     //     console.log("error", error)
  //     //     setErrorMessage("Could not register with email " + email)
  //     // } else {
  //     //     router.refresh();
  //     //     router.push("/login?info=Check email to continue sign in process")
  //     // }
  //   },
  //   [email, password, router]
  // )

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-neutral-900">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl dark:border-neutral-800">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 dark:border-neutral-800 dark:bg-spaceblack-500 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-neutral-100">
            Sign Up
          </h3>
          <p className="text-sm text-gray-500">
            Create an account with your email and password
          </p>
        </div>
        <form
          onSubmit={handleRegister}
          className="flex flex-col space-y-4 bg-gray-50 dark:bg-spaceblack-500 px-4 py-8 sm:px-16"
          encType="multipart/form-data"
          method="POST"
        >
          <input
            type="hidden"
            name="$ACTION_ID_701a4455ede9e1ad6f73c225388290b1fa671339"
          />
          <div>
            <label
              htmlFor="email"
              className="block text-xs text-gray-600 uppercase"
            >
              Email Address
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="sample@gmail.com"
              autoComplete="email"
              required=""
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 dark:border-neutral-800 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm  bg-black/[.05] dark:bg-gray-50/10 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              name="email"
            />
          </div>
          <div>
            <label
              htmlFor="current-password"
              className="block text-xs text-gray-600 uppercase"
            >
              Password
            </label>
            <input
              id="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="current-password"
              required=""
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 dark:border-neutral-800 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm  bg-black/[.05] dark:bg-gray-50/10 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              name="current-password"
            />
          </div>
          <button
            type="submit"
            aria-disabled="false"
            className="flex h-10 w-full items-center bg-primary-600 font-bold dark:border-neutral-800 text-white justify-center rounded-md border text-sm transition-all focus:outline-none"
          >
            {loading ? (
              <Loading color="#fff" />
            ) : (
              <>
                Sign Up
                <span aria-live="polite" className="sr-only" role="status">
                  Submit form
                </span>
              </>
            )}
          </button>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a
              className="font-semibold text-gray-800 dark:text-gray-100"
              href="/login"
            >
              Sign in
            </a>{" "}
            instead.
          </p>
          {errorMessage ? <Callout type="error">{errorMessage}</Callout> : ""}
        </form>
      </div>
    </div>
  )
}
