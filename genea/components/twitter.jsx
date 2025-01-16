import Link from "next/link"
import React from "react"

export default function Twitter() {
  return (
    <Link
      className="twitter-timeline"
      href="https://twitter.com/genea_workshop?ref_src=twsrc%5Etfw"
    >
      Tweets by genea_workshop
    </Link>
  )
}
