"use server"
import clientPromise from "@/server/mongodb"

export default async function fetchSubmission() {
  const client = await clientPromise
  const db = client.db("hemvip")

  const submission = await db.collection("submission").find({}).toArray()
  return submission
}
