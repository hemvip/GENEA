import clientPromise from "@/server/mongodb"

export async function GET(req, res) {
  const client = await clientPromise
  const db = client.db("hemvip")

  const inputcode = await db.collection("inputcode").find({}).toArray()
  const { codes } = inputcode[0]
  return Response.json(
    { codes: codes, success: true, error: null },
    { status: 200 }
  )
}
