import Link from "next/link"
import Script from "next/script"
import React from "react"

export default function Twitter() {
  return (
    <>
      <Link
        className="twitter-timeline"
        href="https://twitter.com/genea_workshop?ref_src=twsrc%5Etfw"
      >
        Tweets by genea_workshop
      </Link>
      <Script
        async
        src="https://platform.twitter.com/widgets.js"
        charset="utf-8"
      ></Script>
    </>
  )
}
