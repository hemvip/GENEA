import clientPromise from "@/server/mongodb"

export async function GET(req, res) {
  // try {
  const client = await clientPromise
  const db = client.db("HemVip")
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

  const inputcodes = await db.collection("inputcode").find({}).toArray()
  const codes = inputcodes[0].codes

  const submissions = await db.collection("submissions").find({}).toArray()
  const teamitems = submissions.map((submission) => {
    return submission.videoitems
  })

  const templateStudies = {
    status: "new",
    name: "Pairwise Comparison of Gesture Generation AI Model Studies",
    prolific_userid: "",
    prolific_studyid: "",
    prolific_sessionid: "",
    completion_code: "CMTN9LUK",
    total_actions: [],
    pages: [
      {
        pageid: "3242342",
        type: "generic",
        name: "Startup guide to participate gesture generation study",
        content: "",
        actions: [],
      },
      {
        pageid: "3242342",
        type: "video",
        name: "Page 1 of Y",
        content: "How human-like was the agent in this video?",
        selected: {
          value: 9,
          label: "Right better",
        },
        actions: [],
        videos: [
          {
            teamid: "123123",
            inputid: "56567342159353489347",
            value: 4,
            url: "https://github.com/hmthanh/GENEA/raw/main/public/gesture_video.mp4",
          },
          {
            teamid: "645634",
            inputid: "56567342159353489347",
            value: 9,
            url: "https://github.com/hmthanh/GENEA/raw/main/public/gesture_video.mp4",
          },
        ],
      },
      {
        pageid: "3242342",
        type: "video",
        name: "Page 2 of Y",
        content: "How human-like was the agent in this video?",
        selected: {
          value: 9,
          label: "Right better",
        },
        actions: [],
        videos: [
          {
            teamid: "123123",
            inputid: "56567342159353489347",
            value: 4,
            url: "https://github.com/hmthanh/GENEA/raw/main/public/gesture_video.mp4",
          },
          {
            teamid: "645634",
            inputid: "56567342159353489347",
            value: 9,
            url: "https://github.com/hmthanh/GENEA/raw/main/public/gesture_video.mp4",
          },
        ],
      },
      {
        pageid: "3242342",
        type: "finish",
        name: "Finish page",
        content: "",
        actions: [],
      },
    ],
  }
  const studies = []

  codes.map((code) => {
    const crossInputId = []

    teamitems.map((teamitem) => {
      teamitem.map((videoitem) => {
        if (videoitem.inputid === code) {
          crossInputId.push(videoitem)
        }
      })
    })

    for (let i = 0; i < crossInputId.length; i++) {
      for (let j = i + 1; j < crossInputId.length; j++) {
        studies.push({ videos: [crossInputId[i], crossInputId[j]] })
      }
    }
    // console.log(inputid)
  })
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
        codes: codes,
        videoitems: teamitems,
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
