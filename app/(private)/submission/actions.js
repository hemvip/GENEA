"use server"
import clientPromise from "@/server/mongodb"

export default async function fetchInputCodes() {
  const client = await clientPromise
  const db = client.db("HemVip")

  const inputcode = await db.collection("inputcode").find({}).toArray()
  const { codes, videocodes } = inputcode[0]
  return { codes, videocodes }
}
