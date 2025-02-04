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
        message: "Cannot connect to MongoDB storage.",
        error: null,
      },
      { status: 500 }
    )
  }

  // ~~~~~~~~~~~~~ systems ~~~~~~~~~~~~~
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
        message: "Your request is failed, please contact for support.",
        error: error,
      },
      { status: 500 }
    )
  }

  // ~~~~~~~~~~~~~ study_config ~~~~~~~~~~~~~
  try {
    const studyConfig = await db
      .collection("study_config")
      .findOne({ type: "pairwise-emotion-studies" })
    console.log("studyConfig", studyConfig)
  } catch (error) {
    console.log("Exception: ", error)
    return Response.json(
      {
        success: false,
        message: "Your request is failed, please contact for support.",
        error: error,
      },
      { status: 500 }
    )
  }

  // ~~~~~~~~~~~~~ Insert many studies ~~~~~~~~~~~~~
  try {
    const studiesData = Array.from(csvList).map((csv) => csv.data.slice(1))
    // const studyDefaultConfig = {
    //   status: "new",
    //   name: "Pairwise Comparison of Gesture Generation AI Model Studies",
    //   description: "description",
    //   prolific_userid: null,
    //   prolific_studyid: null,
    //   prolific_sessionid: null,
    //   completion_code: null,
    //   fail_code: null,
    //   global_actions: [],
    //   pages: [],
    //   time_start: null,
    //   type: systemType,
    // }

    const studies = studiesData.forEach((item) => {
      const pairwises = Array.from(item).map((row) => {
        const inputcode = row[0]
        const sysA = String(row[1]).replace(/\s+/g, "")
        const sysB = String(row[2]).replace(/\s+/g, "")
        console.log("row[0]", inputcode, sysA, sysB)

        return {
          pageid: new ObjectId(),
          type: "video",
          question:
            "Pairwise Comparison of Gesture Generation AI Model Studies",
          selected: {},
          actions: [],
          videos: [
            {
              teamid: "6684003c3b7dd703e06fc914",
              inputid: inputcode,
              videoid: `videos/${sysA}`,
              url: "https://hemvip.s3.amazonaws.com/videos/6684003c3b7dd703e06fc914/6684003c3b7dd703e06fc914.mp4",
            },
            {
              teamid: "6684003c3b7dd703e06fc914",
              inputid: inputcode,
              videoid: `videos/${sysB}`,
              url: "https://hemvip.s3.amazonaws.com/videos/6684003c3b7dd703e06fc914/6684003c3b7dd703e06fc914.mp4",
            },
          ],
        }
      })
      console.log("pairwises", pairwises)
      const pages = pairwises.map((pairwise) => {
        const page = {}

        return pairwise
      })
      return {
        ...studyConfig,
        pages: pages,
        type: systemType,
        time_start: new Date(),
        status: "new",
      }
    })

    const pages = []

    // const result = await db.collection("studies").insertMany(studiesData)
    studyValue.insertedCount = new ObjectId(1111)
    let result = studyValue

    if (result.insertedCount) {
      return Response.json(
        {
          success: true,
          message: "Your submission are update successfully.",
          error: null,
        },
        { status: 200 }
      )
    }

    return Response.json(
      {
        success: false,
        message:
          "Upload success but failed insert request, please contact for support.",
        error: null,
      },
      { status: 500 }
    )
  } catch (error) {
    console.log("Exception: ", error)
    return Response.json(
      {
        success: false,
        message: "Your request is failed, please contact for support.",
        error: error,
      },
      { status: 500 }
    )
  }
}

export async function PATCH(req, res) {
  const client = await clientPromise
  const db = client.db("hemvip")

  try {
    const { csv } = await req.json()

    if (!csv) {
      return Response.json(
        {
          success: false,
          message: "CSV data is required",
          studies: "",
          error: "CSV data is required",
        },
        { status: 400 }
      )
    }

    console.log("csv", csv)

    const resultQueries = await Promise.all(
      Array.from(csv).map(async (row, index) => {
        const inputcode = row[0]
        const sysA = String(row[1]).replace(/\s+/g, "")
        const sysB = String(row[2]).replace(/\s+/g, "")

        const queryA = { inputcode, systemname: sysA }
        const queryB = { inputcode, systemname: sysB }

        const [rsA, rsB] = await Promise.all([
          db.collection("videos").findOne(queryA),
          db.collection("videos").findOne(queryB),
        ])

        console.log("rs", rsA, rsB)

        return {
          inputcode: inputcode,
          name1: sysA,
          name2: sysB,
          result1: rsA,
          result2: rsB,
          index: String(index + 1),
        }
      })
    )

    for (const {
      inputcode,
      name1,
      name2,
      result1,
      result2,
      index,
    } of resultQueries) {
      if (!result1 || !result2) {
        let missingNames = []
        if (!result1) missingNames.push(name1)
        if (!result2) missingNames.push(name2)

        return Response.json(
          {
            success: false,
            message: `Video ${inputcode} in line ${index} not found for: ${missingNames.join(", ")}`,
            studies: "",
            error: null,
          },
          { status: 200 }
        )
      }
    }

    return Response.json(
      {
        success: true,
        message: "Video updated successfully",
        studies: "",
        error: null,
      },
      { status: 200 }
    )
  } catch (error) {
    console.log("Error updating video:", error)
    return Response.json(
      {
        success: false,
        message: "Internal Server Error",
        studies: "",
        error,
      },
      { status: 500 }
    )
  }
}
