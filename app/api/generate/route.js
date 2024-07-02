import clientPromise from "@/server/mongodb"

export async function POST(req, res) {
  const data = await req.json()

  const {
    totalInput,
    totalSubmission,
    fractionTotalCodes,
    ncheck,
    completionCode,
    failCode,
  } = data

  // ~~~~~~~~~ CONNECT DATABASE ~~~~~~~~~
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

  // ~~~~~~~~~ GET INPUT CODES ~~~~~~~~~
  const inputcodes = await db.collection("inputcode").find({}).toArray()
  if (inputcodes.length === 0) {
    return Response.json(
      {
        success: false,
        msg: "No input codes found, please contact for support.",
        error: null,
      },
      { status: 500 }
    )
  }
  const { codes } = inputcodes[0]
  // console.log("codes", codes)

  // ~~~~~~~~~ GET SUBMISSION ~~~~~~~~~
  const submissions = await db.collection("submissions").find({}).toArray()
  if (submissions.length === 0) {
    return Response.json(
      {
        success: false,
        msg: "No submissions found, please contact for support.",
        error: null,
      },
      { status: 500 }
    )
  }
  const pairwises = []
  for (let i = 0; i < submissions.length; i++) {
    for (let j = i + 1; j < submissions.length; j++) {
      pairwises.push({
        id: String(submissions[i]._id),
        id: String(submissions[j]._id),
      })
    }
  }

  // ~~~~~~~~~ TEMPLATE FOR STUDY ~~~~~~~~~
  const templateStudies = {
    status: "new",
    name: "Pairwise Comparison of Gesture Generation AI Model Studies",
    prolific_userid: "",
    prolific_studyid: "",
    prolific_sessionid: "",
    completion_code: "CMTN9LUK",
    total_actions: [],
    pages: [],
  }

  codes.map((inputcode) => {
    // const input
  })

  // const teamitems = submissions.map((submission) => {
  //   return submission.videoitems
  // })

  return Response.json({ codes, pairwises }, { status: 200 })
  // const codes = inputcodes[0].codes

  const studies = []

  // codes.map((code) => {
  //   const crossInputId = []

  //   teamitems.map((teamitem) => {
  //     teamitem.map((videoitem) => {
  //       if (videoitem.inputid === code) {
  //         crossInputId.push(videoitem)
  //       }
  //     })
  //   })

  //   for (let i = 0; i < crossInputId.length; i++) {
  //     for (let j = i + 1; j < crossInputId.length; j++) {
  //       studies.push({ videos: [crossInputId[i], crossInputId[j]] })
  //     }
  //   }
  //   // console.log(inputid)
  // })

  // console.log(submissions[0].submissions)

  // const insertResult = await db
  //   .collection("studies")
  //   .insertOne({ userId, teamname, email, submissions })

  // if (insertResult.insertedId) {
  if (submissions) {
    return Response.json(
      {
        success: true,
        msg: "Your submission uploaded successfully.",
        codes: [], //codes,
        videoitems: [],
        studies: studies,
        error: null,
      },
      { status: 200 }
    )
  } else {
    return Response.json(
      {
        success: false,
        msg: "Upload success but failed insert submissions, please contact for support.",
        inputids: "",
        videoitems: "",
        studies: "",
        error: null,
      },
      { status: 500 }
    )
  }
  // }
  //  catch (error) {
  //   return Response.json(
  //     {
  //       success: false,
  //       msg: "Your submissions is failed, please contact for support.",
  //       inputids: "",
  //       videoitems: "",
  //       studies: "",
  //       error: error,
  //     },
  //     { status: 500 }
  //   )
  // }
}
