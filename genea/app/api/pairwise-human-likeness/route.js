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
  // ~~~~~~~~~~~~~ Parse Input ~~~~~~~~~~~~~
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

  // ~~~~~~~~~~~~~ System name ~~~~~~~~~~~~~
  try {
    const systems = await db
      .collection("systems")
      .find({}, { projection: { _id: 0, name: 1 } })
      .toArray()
    const systemNames = systems.map((doc) => doc.name)
    console.log("systemNames", systemNames)
  } catch (error) {
    console.log("Exception: ", error)
    return Response.json(
      {
        success: false,
        msg: "Your request is failed, please contact for support.",
        error: error,
      },
      { status: 500 }
    )
  }

  // ~~~~~~~~~~~~~ Insert many studies ~~~~~~~~~~~~~
  try {
    const studiesData = Array.from(csvList).map((csv) => csv.data.slice(1))
    const studyDefaultConfig = {
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

    studiesData.forEach((item) => {
      const pages = Array.from(item).map((row) => {
        const inputName = row[0]
        const sysA = String(row[1]).replace(/\s+/g, "")
        const sysB = String(row[2]).replace(/\s+/g, "")
        console.log("row[0]", inputName, sysA, sysB)
        return row
      })
      console.log("pages", pages)
      return
    })

    const pages = []

    // const result = await db.collection("studies").insertMany(studiesData)
    studyValue.insertedCount = new ObjectId(1111)
    let result = studyValue

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
        msg: "Upload success but failed insert request, please contact for support.",
        error: null,
      },
      { status: 500 }
    )
  } catch (error) {
    console.log("Exception: ", error)
    return Response.json(
      {
        success: false,
        msg: "Your request is failed, please contact for support.",
        error: error,
      },
      { status: 500 }
    )
  }
}
