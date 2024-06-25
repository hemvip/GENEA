"use server"

import clientPromise from "@/server/mongodb"

export default async function updateGeneratedCode(newCodes) {
  const client = await clientPromise
  const db = client.db("HemVip")

  const res = await db
    .collection("inputcode")
    .updateOne({}, { $set: { codes: newCodes } })
  return res
}
