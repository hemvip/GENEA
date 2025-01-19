import { Description, Field, Label, Select } from "@headlessui/react"
import { Fragment, useState } from "react"
import { clsx as cn } from "clsx"
import { ArrowLeftIcon, ArrowRightIcon } from "@/nextra/icons"

export default function SubmissionList({ teams }) {
  const [teamID, setTeamID] = useState(teams[0].userId)

  return (
    <div className="flex flex-row items-center gap-4">
      <label htmlFor="name" className="w-[20%] flex justify-end">
        Submission
      </label>
      <div className="relative items-center align-middle flex-grow">
        <Select
          name="status"
          onChange={(e) => setTeamID(e.target.value)}
          className={cn(
            "block w-full appearance-none py-1.5 px-3 text-sm/6  items-center rounded border border-black",
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
      </div>
      {/* <Select name="status" as={Fragment}>
        {({ focus, hover }) => (
          <select
            className={cn(
              "border",
              focus && "bg-blue-100",
              hover && "shadow",
              "flex-grow min-w-0 appearance-none rounded-md border border-[#666666] bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 dark:border-[#888888] dark:bg-transparent dark:text-white dark:focus:border-white sm:text-sm"
            )}
            onChange={(e) => setTeamID(e.target.value)}
            aria-label="Project status"
          >
            {teams.map((team, index) => (
              <option
                key={index}
                className="text-gray-800 dark:text-gray-100 relative cursor-pointer whitespace-nowrap py-1.5 transition-colors ltr:pl-3 ltr:pr-9 rtl:pr-3 rtl:pl-9"
                value={team.userId}
              >
                {team.teamname}
              </option>
            ))}
          </select>
        )}
      </Select> */}
    </div>
  )
}
