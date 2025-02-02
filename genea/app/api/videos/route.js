import clientPromise from "@/server/mongodb"
import { ObjectId } from "bson"

export async function GET(req, res) {
  const client = await clientPromise
  const db = client.db("hemvip")

  const videos = await db.collection("videos").find({}).toArray()

  return Response.json(
    { videos: videos, success: true, error: null },
    { status: 200 }
  )
}

export async function POST(req, res) {
  const formData = await req.formData()
  const userId = formData.get("userId")
  const email = formData.get("email")
  const teamid = formData.get("teamid")
  const teamname = formData.get("teamname")

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const client = await clientPromise
  const db = client.db("hemvip")
  if (!db) {
    return Response.json(
      {
        success: false,
        msg: "Cannot connect to MongoDB storage.",
        error: null,
      },
      { status: 500 }
    )
  }

  try {
    const update = [
      {
        url: "https://genealeaderboard.s3.us-east-005.backblazeb2.com/videos/original/SD/12_zhao_2_2_2_segment_3.mp4",
        systemid: new ObjectId("6794c08c3febc50fe3c557eb"),
        systemname: "BA",
        inputcode: "1_wayne_0_1_1",
        path: "videos/original/SD/12_zhao_2_2_2_segment_3.mp4",
        submitat: new Date(),
      },
      {
        url: "https://genealeaderboard.s3.us-east-005.backblazeb2.com/videos/original/SD/12_zhao_2_2_2_segment_3.mp4",
        systemid: new ObjectId("6794c08c3febc50fe3c557eb"),
        systemname: "BA",
        inputcode: "1_wayne_0_1_1",
        path: "videos/original/SD/12_zhao_2_2_2_segment_3.mp4",
        submitat: new Date(),
      },
    ]

    const result = await db.collection("videos").insertMany(filter)
    console.log("result", result)

    if (result.modifiedCount >= 0) {
      return Response.json(
        {
          success: true,
          msg: "Your submission are update successfully.",
          error: null,
        },
        { status: 200 }
      )
    } else if (result.upsertedId) {
      return Response.json(
        {
          success: true,
          msg: "Your submission are created successfully.",
          error: null,
        },
        { status: 200 }
      )
    }

    return Response.json(
      {
        success: false,
        msg: "Upload success but failed insert videos, please contact for support.",
        error: null,
      },
      { status: 500 }
    )
  } catch (error) {
    console.log("Exception: ", error)
    return Response.json(
      {
        success: false,
        msg: "Your videos is failed, please contact for support.",
        error: error,
      },
      { status: 500 }
    )
  }
}
