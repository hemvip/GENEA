import clientPromise from "@/server/mongodb"
import { shuffleArray } from "./utils"
import {
  ATTENTION_CHECK_PAGE,
  FINISH_PAGE,
  MAIN_PAGE,
  STARTUP_PAGE,
  TEMPLATE_STUDY,
  VIDEO_CHECK_EQUAL,
  VIDEO_CHECK_LEFTBETTER,
  VIDEO_CHECK_RIGHTBETTER,
  VIDEO_ITEM,
} from "./constant"
import { ObjectId } from "bson"

export async function POST(req, res) {
  const data = await req.json()

  const { fractionTotalCodes, ncheck, completionCode, failCode } = data
  console.log("fractionTotalCodes", fractionTotalCodes, "ncheck", ncheck)

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
  console.log("codes", codes.length)

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
  const videoSources = {}
  submissions.map((submission) => {
    submission.videos.map((video) => {
      const videokey = submission.userId + "_" + video.inputid
      videoSources[videokey] = { url: video.url, videoid: video.videoid }
    })
  })
  // console.log("videoSources", videoSources)

  let pairwises = []
  for (let i = 0; i < submissions.length; i++) {
    for (let j = i + 1; j < submissions.length; j++) {
      pairwises.push([submissions[i].userId, submissions[j].userId])
    }
  }
  pairwises = shuffleArray(pairwises)
  console.log("pairwises", pairwises.length)
  // console.log(pairwises.length)

  // ~~~~~~~~~ RANDOM ATTENTION CHECK POSITION ~~~~~~~~~
  const nscreenPerStudy = codes.length / fractionTotalCodes
  // Random position of attention check
  let randPos = new Set()
  while (randPos.size < ncheck) {
    let randomPos = Math.floor(Math.random() * nscreenPerStudy)
    randPos.add(randomPos)
  }
  const randAttentionPos = Array.from(randPos)
  console.log("randAttentionPos", randAttentionPos)

  // ~~~~~~~~~ GENERATE STUDY ~~~~~~~~~
  const studies = []

  for (let i = 0; i < codes.length; i += nscreenPerStudy) {
    const splittedCode = codes.slice(i, i + nscreenPerStudy)
    // console.log("splittedCode", JSON.stringify(splittedCode))

    pairwises.map((pairwise) => {
      const pageItem = []

      // ~~~~~~ Startup Page ~~~~~~
      pageItem.push({ ...STARTUP_PAGE, pageid: new ObjectId() })

      // ~~~~~~ Main Page ~~~~~~
      splittedCode.map((code, pos) => {
        // Attention check
        randAttentionPos.map((attentionPos) => {
          if (pos === attentionPos) {
            const attentionValues = [
              VIDEO_CHECK_LEFTBETTER,
              VIDEO_CHECK_EQUAL,
              VIDEO_CHECK_RIGHTBETTER,
            ]
            const randomIndex = Math.floor(
              Math.random() * attentionValues.length
            )
            console.log("randomIndex", randomIndex)
            const videoCheck = [
              {
                ...attentionValues[randomIndex],
                _id: new ObjectId(),
              },
              {
                ...attentionValues[randomIndex],
                _id: new ObjectId(),
              },
            ]
            const choices = ["Left Better", "Equal", "Right Better"]

            pageItem.push({
              ...ATTENTION_CHECK_PAGE,
              videos: videoCheck,
              attention_correct_value: choices[randomIndex],
              type: "check",
              pageid: new ObjectId(),
            })
          }
        })

        const videos = []
        // First video
        const videokey1 = pairwise[0] + "_" + code
        videos.push({
          ...VIDEO_ITEM,
          _id: new ObjectId(),
          teamid: String(pairwise[0]),
          inputid: code,
          videoid: videoSources[videokey1].videoid,
          url: videoSources[videokey1].url,
        })
        // Second video
        const videokey2 = pairwise[1] + "_" + code
        videos.push({
          ...VIDEO_ITEM,
          _id: new ObjectId(),
          teamid: String(pairwise[1]),
          inputid: code,
          videoid: videoSources[videokey2].videoid,
          url: videoSources[videokey2].url,
        })

        pageItem.push({
          ...MAIN_PAGE,
          pageid: new ObjectId(),
          videos,
        })
      })

      // ~~~~~~ Finish Page ~~~~~~
      pageItem.push({ ...FINISH_PAGE, pageid: new ObjectId() })

      studies.push({
        ...TEMPLATE_STUDY,
        _id: new ObjectId(),
        completion_code: completionCode,
        fail_code: failCode,
        pages: pageItem,
      })
    })
  }

  console.log("studies", studies.length)

  const insertResult = await db.collection("studies").insertMany(studies)

  if (insertResult.insertedIds) {
    return Response.json(
      {
        success: true,
        msg: "Your studies generated successfully.",
        studies: studies,
        error: null,
      },
      { status: 200 }
    )
  } else {
    return Response.json(
      {
        success: false,
        msg: "Generate studies failed, please contact for support.",
        studies: "",
        error: null,
      },
      { status: 500 }
    )
  }

  // return Response.json({ codes, pairwises, studies }, { status: 200 })
  // const codes = inputcodes[0].codes

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

  // if (insertResult.insertedId) {
  if (submissions) {
    return Response.json(
      {
        success: true,
        msg: "Your submission uploaded successfully.",
        codes: [], //codes,
        videos: [],
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
        videos: "",
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
  //       videos: "",
  //       studies: "",
  //       error: error,
  //     },
  //     { status: 500 }
  //   )
  // }
}
