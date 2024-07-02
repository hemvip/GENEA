"use server"

import clientPromise from "@/server/mongodb"

export async function updateGeneratedCode(newCodes) {
  const client = await clientPromise
  const db = client.db("hemvip")

  console.log("newCodes", newCodes)

  const deleteResult = await db.collection("inputcode").deleteMany({})
  console.log("deleteResult", deleteResult)

  const res = await db.collection("inputcode").insertOne({ codes: newCodes })
  return res
}

export async function fetchInputCodes() {
  const client = await clientPromise
  const db = client.db("hemvip")

  const inputcode = await db.collection("inputcode").find({}).toArray()
  const { codes } = inputcode[0]
  return { codes }
}
