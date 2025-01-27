"use client"

import React, { useEffect, useState, useMemo } from "react"
import cn from "clsx"
import axios from "axios"
import SystemList from "./SystemList"
import { Loading } from "@/components"

export default function Page() {
  const [systems, setSystems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSystems() {
      setLoading(true)
      const res = await axios.get("/api/systems")
      if (res.data.success) {
        setSystems(res.data.systems)
        setLoading(false)
      } else {
        console.error(res.error)
      }
    }

    fetchSystems()
  }, [])

  const systemList = useMemo(() => systems, [systems])

  return (
    <div>
      <h2 className="font-semibold tracking-tight text-slate-900 dark:text-slate-100 mt-10 border-b pb-1 text-3xl border-neutral-200/70 contrast-more:border-neutral-400 dark:border-primary-100/10 contrast-more:dark:border-neutral-400">
        Team Submission
      </h2>
      <h4 className="font-semibold tracking-tight text-slate-900 dark:text-slate-100 mt-8 text-xl">
        System naming convention
      </h4>
      <ul className="mt-6 list-disc first:mt-0 ltr:ml-6 rtl:mr-6">
        <li className="my-2">
          natural mocap data (ground truth):{" "}
          <code className="nextra-code" dir="ltr">
            NA
          </code>
        </li>
        <li className="my-2">
          submitted systems:{" "}
          <code className="nextra-code" dir="ltr">
            SA
          </code>
          ,{" "}
          <code className="nextra-code" dir="ltr">
            SB
          </code>
          , ...,{" "}
          <code className="nextra-code" dir="ltr">
            SZ
          </code>
        </li>
        <li className="my-2">
          baseline systems:{" "}
          <code className="nextra-code" dir="ltr">
            BA
          </code>
          ,{" "}
          <code className="nextra-code" dir="ltr">
            BB
          </code>
          ,{" "}
          <code className="nextra-code" dir="ltr">
            BC
          </code>
          , ...
        </li>
      </ul>
      <h4 className="font-semibold tracking-tight text-slate-900 dark:text-slate-100 mt-8 text-xl">
        System submission
      </h4>
      <div
        className={cn(
          "-mx-6 mb-4 mt-6 overflow-x-auto overscroll-x-contain px-6 pb-4 ",
          "mask-gradient"
        )}
      >
        {loading ? (
          <div className="flex w-full p-32 justify-center">
            <Loading />
          </div>
        ) : (
          <SystemList systems={systemList} />
        )}
      </div>
    </div>
  )
}
