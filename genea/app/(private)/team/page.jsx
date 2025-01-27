"use client"

import React, { useEffect, useState } from "react"
import Study from "./VideoInfo"
import { Code, Pre, Table, Th, Tr } from "@/nextra"
import cn from "clsx"
import VideoInfo from "./VideoInfo"
import BVHInfo from "./BVHInfo"
import axios from "axios"

export default function Page() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchTeams() {
    const res = await axios.get("/api/submission")
    if (res.data.success) {
      setTeams(res.data.submissions)
    } else {
      console.error(res.error)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

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
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left dark:border-neutral-700">
              <th className="pl-6 font-semibold">ID</th>
              <th className="pl-6 font-semibold">Submission name</th>
              <th className="pl-6 font-semibold">Systems name</th>
              <th className="pl-6 font-semibold">Videos</th>
            </tr>
          </thead>
          <tbody className="align-baseline text-gray-900 dark:text-gray-100">
            {teams.map((team, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 dark:border-neutral-700/50 align-middle"
              >
                <td className="py-2 pl-6">{index + 1}</td>
                <td className="py-2 pl-6">{team.teamname}</td>
                <td className="py-2 pl-6">
                  <div className="overflow-y-auto relative first:mt-0 flex flex-col gap-2 max-h-96 max-w-96">
                    {team.bvh &&
                      team.bvh.map((bvh, index) => {
                        return <BVHInfo submission={bvh} key={index} />
                      })}
                  </div>
                </td>
                <td className="py-2 pl-6 h-16">
                  <div className="overflow-y-auto relative first:mt-0 flex flex-col gap-2 max-h-96 max-w-96">
                    {team.videos &&
                      team.videos.map((info, index) => {
                        return <VideoInfo submission={info} key={index} />
                      })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
