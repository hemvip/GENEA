import { Callout } from "@/nextra"
import { ArrowLeftIcon, ArrowRightIcon } from "@/nextra/icons"
import { File } from "@/nextra/sidebar"
import { useSession } from "next-auth/react"
// import { Sidebar } from "@/nextra/sidebar"
import React from "react"
import AdminSidebar from "./AdminSidebar"

export default function Layout({ children }) {
  return (
    <div className="mx-auto flex max-w-[90rem]">
      <AdminSidebar />
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
              </ul>
            </div>
          </div>
        </div>
      </aside>
      <div id="reach-skip-nav"></div>
      <article className="w-full break-words nextra-content flex min-h-[calc(100vh-var(--nextra-navbar-height))] min-w-0 justify-center pb-8 pr-[calc(env(safe-area-inset-right)-1.5rem)]">
        <main className="w-full min-w-0 max-w-6xl px-6 pt-4 md:px-12">
          {children}
        </main>
      </article>
    </div>
  )
}
