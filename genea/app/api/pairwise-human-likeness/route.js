import clientPromise from "@/server/mongodb"
import { ObjectId } from "bson"

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
  const { csvList, systemType } = await req.json()

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
    const studiesData = Array.from(csvList).map((csv) => csv.data)

    studiesData.forEach((item) => {})

    console.log("items", item)
    const pages = []

    const studyValue = {
      status: "new",
      name: "Pairwise Comparison of Gesture Generation AI Model Studies",
      description: "description",
      prolific_userid: null,
      prolific_studyid: null,
      prolific_sessionid: null,
      completion_code: null,
      fail_code: null,
      global_actions: [],
      pages: [],
      time_start: null,
      type: systemType,
    }

    // const result = await db.collection("studies").insertMany(studiesData)
    studyValue.insertedCount = new ObjectId(1111)
    let result = studyValue
    // console.log("result", result)

    if (result.insertedCount) {
      return Response.json(
        {
          success: true,
          msg: "Your submission are update successfully.",
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
