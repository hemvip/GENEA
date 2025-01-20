import { Description, Field, Label, Select } from "@headlessui/react"
import { Fragment, useState } from "react"
import { clsx as cn } from "clsx"
import { ArrowLeftIcon, ArrowRightIcon } from "@/nextra/icons"

export default function SubmissionList({ teams, teamID, setTeamID }) {
  return (
    <>
      <Select
        name="status"
        onChange={(e) => setTeamID(e.target.value)}
        className={cn(
          "block w-full bg-black/5 appearance-none py-1.5 px-3 text-sm/6  items-center rounded border  border-black",
          "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
          "text-black"
        )}
      >
        {({ focus, hover }) => (
          <>
            {teams.map((team, index) => (
              <option
                key={index}
                className="text-gray-800 dark:text-gray-100 relative cursor-pointer whitespace-nowrap py-1.5 transition-colors ltr:pl-3 ltr:pr-9 rtl:pr-3 rtl:pl-9"
                value={team.userId}
              >
                {team.teamname}
              </option>
            ))}
          </>
        )}
      </Select>
      <ArrowLeftIcon
        className="pointer-events-none absolute top-2.5 right-2.5 size-5  ltr:rotate-90"
        aria-hidden="true"
      />
    </>
  )
}
