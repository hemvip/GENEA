"use client"

import { useCallback, useState } from "react"
import Loading from "@/components/loading/loading.jsx"
import { useRouter } from "next/navigation"
// import { useRouter } from 'next/router';
import { Callout } from "@/nextra"
import { loginAction } from "./actions"

export default function LoginPage({ searchParams }) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(searchParams.error)
  const [inforMessage, setInforMessage] = useState(searchParams.info)

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      setLoading(true)

      // type-casting here for convenience
      // in practice, you should validate your inputs
      const data = {
        email: email,
        password: password,
      }
      try {
        const { error } = await loginAction(data)
        if (error) {
          // console.log(error)
          setErrorMessage("Could not authenticate user")
          // redirect("/login?message=Could not authenticate user");
        } else {
          router.push("/getting-started")
        }
      } catch (error) {
      } finally {
        setLoading(false)
      }
    },
    [email, password, router]
  )

  return (
    <>
      <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-neutral-900">
        <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl dark:border-neutral-800">
          <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 dark:border-neutral-800 dark:bg-spaceblack-500 bg-white px-4 py-6 pt-8 text-center sm:px-16">
            <h3 className="text-xl font-semibold dark:text-neutral-100">
              Sign In
            </h3>
            <p className="text-sm text-gray-500">
              Use your email and password to sign in
            </p>
          </div>
          <form
            className="flex flex-col space-y-4 bg-gray-50 dark:bg-spaceblack-500 px-4 py-8 sm:px-16"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase text-gray-900 contrast-more:text-gray-800 dark:text-gray-300 contrast-more:dark:text-gray-300"
              >
                Email Address
              </label>
              <input
                id="email"
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sample@gmail.com"
                autoComplete="email"
                required
                className="mt-1 block w-full appearance-none rounded-md border border-gray-300 dark:border-neutral-800 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm  bg-black/[.05] dark:bg-gray-50/10 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                type="email"
                name="email"
              />
            </div>
            <div>
              <label
                htmlFor="current-password"
                className="block text-xs uppercase text-gray-900 contrast-more:text-gray-800 dark:text-gray-300 contrast-more:dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="current-password"
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full appearance-none rounded-md border border-gray-300 dark:border-neutral-800 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm  bg-black/[.05] dark:bg-gray-50/10 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                type="current-password"
                name="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              aria-disabled="false"
              className="flex h-10 w-full font-bold text-white bg-green-500 dark:border-neutral-800 items-center justify-center rounded-md border text-sm transition-all focus:outline-none"
            >
              {loading ? (
                <Loading color="#fff" />
              ) : (
                <>
                  Sign in
                  <span aria-live="polite" className="sr-only" role="status">
                    Submit form
                  </span>
                </>
              )}
            </button>
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <a
                className="font-semibold text-gray-800 dark:text-gray-100"
                href="/register"
              >
                Sign up
              </a>{" "}
              for free.
            </p>
            {errorMessage ? <Callout type="error">{errorMessage}</Callout> : ""}
            {inforMessage ? <Callout type="info">{inforMessage}</Callout> : ""}
          </form>
        </div>
      </div>
    </>
  )
}
