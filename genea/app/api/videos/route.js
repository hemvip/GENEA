import clientPromise from "@/server/mongodb"

export async function GET(req, res) {
  const client = await clientPromise
  const db = client.db("hemvip")

  const videos = await db.collection("videos").find({}).toArray()

  return Response.json(
    { videos: videos, success: true, error: null },
    { status: 200 }
  )
}
