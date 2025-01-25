"use client"

import { Fragment, useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Loading } from "@/components/loading/loading"
import BoardIcon from "../icons/board"
import Image from "next/image"
import { clsx as cn } from "clsx"
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { ArrowRightIcon } from "@/nextra/icons"

export default function AuthButton() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)

  if (status === "loading") {
    return (
      <div className="flex justify-center ">
        <Loading />
      </div>
    )
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <a
          className="text-sm items-center font-bold contrast-more:text-gray-700 contrast-more:dark:text-gray-100 max-md:hidden whitespace-nowrap flex gap-1 p-1 rounded-md  hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          aria-current="false"
          href="/getting-started"
        >
          <BoardIcon />
          Dashboard
        </a>
        <Menu>
          <MenuButton className="flex py-1 px-2 hover:bg-gray-200 rounded-md items-center gap-1">
            <span
              className="text-sm flex items-center gap-2  font-medium subpixel-antialiased contrast-more:text-gray-700 contrast-more:dark:text-gray-100"
              aria-current="true"
            >
              {session.user.name || "User"}
              {session?.user ? (
                <Image
                  src={session.user.image}
                  width={26}
                  height={26}
                  className="rounded-full border"
                  alt="User avatar"
                />
              ) : (
                ""
              )}
            </span>
            <ArrowRightIcon className="*:origin-center *:transition-transform *:rotate-90 h-4" />
          </MenuButton>
          <MenuItems
            as="div"
            anchor="bottom"
            transition="true"
            className={cn(
              "focus-visible:nextra-focus",
              "w-48 px-2 py-1",
              "nextra-scrollbar transition-opacity motion-reduce:transition-none",
              "border border-black/5 dark:border-white/20",
              "backdrop-blur-md bg-nextra-bg/70",
              "z-20 rounded-md py-1 text-sm shadow-lg",
              "max-h-[min(calc(100vh-5rem),256px)]!"
            )}
          >
            <MenuItem
              as="div"
              className={cn(
                "block py-1.5 transition-colors ps-3 pe-9",
                "text-gray-600 dark:text-gray-400"
              )}
            >
              <form action={signOut}>
                <button
                  className="text-sm py-1 px-2 underline data-[focus]:bg-blue-100 contrast-more:text-gray-700 contrast-more:dark:text-gray-100 max-md:hidden whitespace-nowrap subpixel-antialiased hover:underline rounded-md transition-all"
                  aria-current="true"
                >
                  Logout
                </button>
              </form>
            </MenuItem>
            {/* <MenuItem
          as="div"
          className={cn(
            "block py-1.5 transition-colors ps-3 pe-9",
            "text-gray-600 dark:text-gray-400"
          )}
        >
          <a className="block data-[focus]:bg-blue-100" href="/support">
            Support
          </a>
        </MenuItem>
        <MenuItem
          as="div"
          className={cn(
            "block py-1.5 transition-colors ps-3 pe-9",
            "text-gray-600 dark:text-gray-400"
          )}
        >
          <a className="block data-[focus]:bg-blue-100" href="/license">
            License
          </a>
        </MenuItem> */}
          </MenuItems>
        </Menu>
        {/* <div className="flex items-center gap-4">
      <span
        className="text-sm flex items-center gap-2  font-medium subpixel-antialiased contrast-more:text-gray-700 contrast-more:dark:text-gray-100"
        aria-current="true"
      >
        {session.user.name || "User"}
        {session?.user ? (
          <Image
            src={session.user.image}
            width={35}
            height={35}
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
    </div> */}
      </div>
    )
  }

  return (
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
  )
}
