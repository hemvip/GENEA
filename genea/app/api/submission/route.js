import clientPromise from "@/server/mongodb"
import { ObjectId } from "bson"

export async function GET(req, res) {
  const client = await clientPromise
  const db = client.db("hemvip")

  const submissions = await db.collection("submissions").find({}).toArray()

  return Response.json(
    { submissions: submissions, success: true, error: null },
    { status: 200 }
  )
}

export async function POST(req, res) {
  const formData = await req.formData()
  const userId = formData.get("userId")
  const email = formData.get("email")
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
    const filter = { _id: new ObjectId(userId) }
    const update = {
      $set: {
        userId: userId,
        teamname: teamname,
        email: email,
        submittedAt: new Date(),
      },
    }

    const result = await db
      .collection("submissions")
      .updateOne(filter, update, { upsert: true })
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
        msg: "Upload success but failed insert submissions, please contact for support.",
        error: null,
      },
      { status: 500 }
    )
  } catch (error) {
    console.log("Exception: ", error)
    return Response.json(
      {
        success: false,
        msg: "Your submissions is failed, please contact for support.",
        error: error,
      },
      { status: 500 }
    )
  }
}
