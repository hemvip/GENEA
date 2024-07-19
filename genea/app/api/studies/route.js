import clientPromise from "@/server/mongodb"

export async function GET(req, res) {
  const client = await clientPromise
  const db = client.db("hemvip")

  const studies = await db.collection("studies").find({}).toArray()

  return Response.json(
    { studies: studies, success: true, error: null },
    { status: 200 }
  )
}
