"use client"

import { Loading } from "@/components"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Layout({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  function navigateStart() {
    router.refresh()
    router.push("/getting-started")
  }

  useEffect(() => {
    if (status === "authenticated" && session) {
      console.log("session", session)
      console.log("go hereexxxx")
      localStorage.setItem("email", session.email || "")
      localStorage.setItem("avatar", session.user?.image || "")
      localStorage.setItem("name", session.name || "")
      localStorage.setItem("userid", session.id || "")
      localStorage.setItem("expires", session.expires || "")
      localStorage.setItem("sessionToken", session.sessionToken || "")

      navigateStart()
    }
  }, [session])

  if (status === "loading") {
    return (
      <div className="flex justify-center ">
        <Loading />
      </div>
    )
  }

  return <div className="mx-auto flex max-w-[90rem]"></div>
}
