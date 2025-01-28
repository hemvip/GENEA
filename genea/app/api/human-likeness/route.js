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

export async function POST(req, res) {
  const client = await clientPromise
  const db = client.db("hemvip")

  const formData = await req.formData()
  const userId = formData.get("csvData")
  const email = formData.get("email")
  const teamid = formData.get("teamid")
  const teamname = formData.get("teamname")

  const studies = await db.collection("studies").insertOne(req.body)

  return Response.json(
    { studies: studies, success: true, error: null },
    { status: 200 }
  )
}
