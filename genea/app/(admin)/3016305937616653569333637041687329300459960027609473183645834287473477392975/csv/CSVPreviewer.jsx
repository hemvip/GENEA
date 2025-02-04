import CheckmarkIcon from "@/icons/checkmark"
import CircleLoading from "@/icons/circleloading"
import DismissIcon from "@/icons/dismiss"
import { Callout } from "@/nextra"
import CSVTable from "./CSVTable"
import CSVIcon from "@/icons/csv"

export default function CSVPreviewer({
  data: csvData,
  filename,
  state,
  errorMsg,
}) {
  return (
    <div
      data-pagefind-ignore="all"
      className="nextra-code relative not-first:mt-6"
    >
      <div className="px-4 text-xs text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-neutral-900 flex items-center h-10 gap-2 rounded-t-md border border-gray-300 dark:border-neutral-700 contrast-more:border-gray-900 contrast-more:dark:border-gray-50 border-b-0">
        <CSVIcon className="w-4 h-4" />
        <span className="truncate">{filename}</span>
        <button
          className="transition cursor-pointer ms-auto"
          type="button"
          title="Validate failed"
          data-headlessui-state=""
        >
          {state === "loading" ? (
            <CircleLoading />
          ) : state === "success" ? (
            <CheckmarkIcon className="nextra-copy-icon w-6 h-6  stroke-green-500" />
          ) : state === "new" ?
          null : (
            <DismissIcon className="nextra-copy-icon w-6 h-6  stroke-red-500" />
          )}
        </button>
      </div>
      <pre
        className="group focus-visible:nextra-focus overflow-x-auto subpixel-antialiased text-[.9em] bg-white dark:bg-black py-4 ring-1 ring-inset ring-gray-300 dark:ring-neutral-700 contrast-more:ring-gray-900 contrast-more:dark:ring-gray-50 contrast-more:contrast-150 rounded-b-md not-prose"
        tabIndex="0"
      >
        <div className="nextra-code px-4" dir="ltr">
          <CSVTable csvData={csvData.slice(1)} headers={csvData[0]} />
          {errorMsg && <Callout type="error">{errorMsg}</Callout>}
        </div>
      </pre>
    </div>
  )
}
