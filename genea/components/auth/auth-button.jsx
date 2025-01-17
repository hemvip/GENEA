"use client"

import { useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Loading } from "@/components/loading/loading"
import BoardIcon from "../icons/board"

export default function AuthButton() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  console.log("session", session)

  if (status === "loading") {
    return <div className="flex justify-center ">{/* <Loading /> */}</div>
  }

  return (
    <>
      {session?.user ? (
        // ("hmthanh" ? (
        <>
          <a
            className="text-sm items-center font-bold contrast-more:text-gray-700 contrast-more:dark:text-gray-100 max-md:hidden whitespace-nowrap flex gap-1 border p-1 rounded-md border-gray-950  hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            aria-current="false"
            href="/getting-started"
          >
            <BoardIcon />
            Dashboard
          </a>
          <div className="flex items-center gap-4">
            <span
              className="text-sm flex items-center gap-2  font-medium subpixel-antialiased contrast-more:text-gray-700 contrast-more:dark:text-gray-100"
              aria-current="true"
            >
              {/* Hi, {"hmthanh" || "User"} */}
              {/* Hi,  */}
              {session.user.name || "User"}
              {session?.user ? (
                <img
                  src={session.user.image}
                  width={35}
                  className="rounded-full border"
                  alt="User avatar"
                />
              ) : (
                ""
              )}
            </span>
            <form action={signOut}>
              <button
                className="text-sm py-1 px-2 underline  contrast-more:text-gray-700 contrast-more:dark:text-gray-100 max-md:hidden whitespace-nowrap subpixel-antialiased hover:underline rounded-md transition-all"
                aria-current="true"
              >
                Logout
              </button>
            </form>
          </div>
        </>
      ) : (
        <button
          disabled={loading}
          onClick={() => {
            setLoading(true)
            signIn("github", { callbackUrl: `/getting-started` })
          }}
          className={`${
            loading
              ? "bg-gray-200 border-gray-300"
              : "bg-black hover:bg-white border-black"
          } w-36 h-8 py-1 text-white hover:text-black border rounded-md text-sm transition-all`}
        >
          {loading ? <Loading color="gray" /> : "Log in with GitHub"}
        </button>
      )}
    </>
  )
}
