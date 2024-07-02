import clientPromise from "@/server/mongodb"

export async function GET(req, res) {
  const client = await clientPromise
  const db = client.db("hemvip")

  const submissions = await db.collection("submissions").find({}).toArray()

  return Response.json(
    { submissions: submissions, success: true, error: null },
    { status: 200 }
  )
}
