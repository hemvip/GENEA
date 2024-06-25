import { Table, Td, Th, Tr } from "@/nextra"
import React from "react"

export default function Study({ study, index }) {
  console.log(study)
  return (
    <Tr>
      <Td>{index + 1}</Td>
      <Td align="center">{study.name}</Td>
      <Td align="center">{study.pages.length}</Td>
      <Td align="center">{study.status}</Td>
    </Tr>
  )
}
