"use client"
import { ActiveAnchorProvider } from "@/contexts/active-anchor"
import { useMenu } from "@/contexts/menu"
import { ArrowRightIcon } from "@/nextra/icons"
import { useMounted } from "@/utils/hooks/use-mounted"
import React, { createContext, useEffect, useRef, useState } from "react"

// Advanced
export const OnFocusItemContext = createContext(null)
OnFocusItemContext.displayName = "OnFocusItem"

export default function AdminSidebar() {
  const { menu, setMenu } = useMenu()
  const [focused, setFocused] = useState(null)
  const [showSidebar, setSidebar] = useState(true)
  const [showToggleAnimation, setToggleAnimation] = useState(false)

  // const anchors = useMemo(() => toc.filter((v) => v.depth === 2), [toc])
  const sidebarRef = useRef(null)
  const containerRef = useRef(null)
  const mounted = useMounted()

  useEffect(() => {
    if (menu) {
      document.body.classList.add("overflow-hidden", "md:overflow-auto")
    } else {
      document.body.classList.remove("overflow-hidden", "md:overflow-auto")
    }
  }, [menu])

  useEffect(() => {
    const activeElement = sidebarRef.current?.querySelector("li.active")

    if (activeElement && (window.innerWidth > 767 || menu)) {
      const scroll = () => {
        scrollIntoView(activeElement, {
          block: "center",
          inline: "center",
          scrollMode: "always",
          boundary: containerRef.current,
        })
      }
      if (menu) {
        // needs for mobile since menu has transition transform
        setTimeout(scroll, 300)
      } else {
        scroll()
      }
    }
  }, [menu])

  const items = [
    {
      title: "Title",
      type: "file",
    },
  ]
  const anchors = [
    {
      value: "Thanh",
      id: "item 1",
    },
    {
      value: "Thanh",
      id: "item 1",
    },
  ]

  return (
    <ActiveAnchorProvider>
      {/* <OnFocusItemContext.Provider
        value={(item) => {
          setFocused(item)
        }}
      >
        <File items={items} anchors={anchors} />
      </OnFocusItemContext.Provider> */}
      <aside className="nextra-sidebar-container flex flex-col md:top-16 md:shrink-0 motion-reduce:transform-none transform-gpu transition-all ease-in-out print:hidden md:w-64 md:sticky md:self-start max-md:[transform:translate3d(0,-100%,0)]">
        <div className="overflow-y-auto overflow-x-hidden p-4 grow md:h-[calc(100vh-var(--nextra-navbar-height)-var(--nextra-menu-height))] nextra-scrollbar">
          <div className="transform-gpu overflow-hidden transition-all ease-in-out motion-reduce:transition-none">
            <div className="transition-opacity duration-500 ease-in-out motion-reduce:transition-none opacity-100">
              <ul className="flex flex-col gap-1 nextra-menu-desktop max-md:hidden">
                <li className="flex gap-1 justify-start px-2 py-1 items-center cursor-pointer text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-primary-100/5 dark:hover:text-gray-50 contrast-more:text-gray-900 contrast-more:dark:text-gray-50 contrast-more:border-transparent contrast-more:hover:border-gray-900 contrast-more:dark:hover:border-gray-50">
                  <a
                    className="flex rounded px-2 py-1.5 text-sm transition-colors  [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:border"
                    href="/getting-started"
                  >
                    <ArrowRightIcon className="inline h-5 shrink-0 ltr:rotate-180"></ArrowRightIcon>
                    Back
                  </a>
                </li>

                {/* <li className="flex flex-col gap-1">
                  <a
                    className="flex rounded px-2 py-1.5 text-sm transition-colors cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:border text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-primary-100/5 dark:hover:text-gray-50 contrast-more:text-gray-900 contrast-more:dark:text-gray-50 contrast-more:border-transparent contrast-more:hover:border-gray-900 contrast-more:dark:hover:border-gray-50"
                    href="/3016305937616653569333637041687329300459960027609473183645834287473477392975/rules"
                  >
                    Rules
                  </a>
                </li> */}
                <li className="flex flex-col gap-1">
                  <a
                    className="flex rounded px-2 py-1.5 text-sm transition-colors cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:border text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-primary-100/5 dark:hover:text-gray-50 contrast-more:text-gray-900 contrast-more:dark:text-gray-50 contrast-more:border-transparent contrast-more:hover:border-gray-900 contrast-more:dark:hover:border-gray-50"
                    href="/3016305937616653569333637041687329300459960027609473183645834287473477392975/home"
                  >
                    Home
                  </a>
                </li>
                <li className="flex flex-col gap-1">
                  <a
                    className="flex rounded px-2 py-1.5 text-sm transition-colors cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:border text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-primary-100/5 dark:hover:text-gray-50 contrast-more:text-gray-900 contrast-more:dark:text-gray-50 contrast-more:border-transparent contrast-more:hover:border-gray-900 contrast-more:dark:hover:border-gray-50"
                    href="/3016305937616653569333637041687329300459960027609473183645834287473477392975/backblaze"
                  >
                    Backblaze
                  </a>
                </li>

                <li className="flex flex-col gap-1">
                  <a
                    className="flex rounded px-2 py-1.5 text-sm transition-colors cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:border text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-primary-100/5 dark:hover:text-gray-50 contrast-more:text-gray-900 contrast-more:dark:text-gray-50 contrast-more:border-transparent contrast-more:hover:border-gray-900 contrast-more:dark:hover:border-gray-50"
                    href="/3016305937616653569333637041687329300459960027609473183645834287473477392975/input"
                  >
                    Input Codes
                  </a>
                </li>

                <li className="flex flex-col gap-1">
                  <a
                    className="flex rounded px-2 py-1.5 text-sm transition-colors cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:border text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-primary-100/5 dark:hover:text-gray-50 contrast-more:text-gray-900 contrast-more:dark:text-gray-50 contrast-more:border-transparent contrast-more:hover:border-gray-900 contrast-more:dark:hover:border-gray-50"
                    href="/3016305937616653569333637041687329300459960027609473183645834287473477392975/systems"
                  >
                    Systems
                  </a>
                </li>

                <li className="flex flex-col gap-1">
                  <a
                    className="flex rounded px-2 py-1.5 text-sm transition-colors cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:border text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-primary-100/5 dark:hover:text-gray-50 contrast-more:text-gray-900 contrast-more:dark:text-gray-50 contrast-more:border-transparent contrast-more:hover:border-gray-900 contrast-more:dark:hover:border-gray-50"
                    href="/3016305937616653569333637041687329300459960027609473183645834287473477392975/upload_origin"
                  >
                    Upload Origin Videos
                  </a>
                </li>

                <li className="flex flex-col gap-1">
                  <a
                    className="flex rounded px-2 py-1.5 text-sm transition-colors cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:border text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-primary-100/5 dark:hover:text-gray-50 contrast-more:text-gray-900 contrast-more:dark:text-gray-50 contrast-more:border-transparent contrast-more:hover:border-gray-900 contrast-more:dark:hover:border-gray-50"
                    href="/3016305937616653569333637041687329300459960027609473183645834287473477392975/upload_mismatch"
                  >
                    Upload Mismatched Videos
                  </a>
                </li>

                <li className="flex flex-col gap-1">
                  <a
                    className="flex rounded px-2 py-1.5 text-sm transition-colors cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:border text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-primary-100/5 dark:hover:text-gray-50 contrast-more:text-gray-900 contrast-more:dark:text-gray-50 contrast-more:border-transparent contrast-more:hover:border-gray-900 contrast-more:dark:hover:border-gray-50"
                    href="/3016305937616653569333637041687329300459960027609473183645834287473477392975/csv"
                  >
                    Upload CSV Studies
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </aside>
    </ActiveAnchorProvider>
  )
}
