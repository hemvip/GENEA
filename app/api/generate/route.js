import clientPromise from "@/server/mongodb"
import { shuffleArray } from "./utils"
import {
  ATTENTION_CHECK_PAGE,
  FINISH_PAGE,
  MAIN_PAGE,
  STARTUP_PAGE,
  TEMPLATE_STUDY,
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
  // Random position of attention check
  let randPos = new Set()
  while (randPos.size < ncheck) {
    let randomPos = Math.floor(Math.random() * pairwises.length)
    randPos.add(randomPos)
  }
  const randAttentionPos = Array.from(randPos)

  // ~~~~~~~~~ GENERATE STUDY ~~~~~~~~~
  const studies = []
  for (let i = 0; i < codes.length; i += fractionTotalCodes) {
    const splittedCode = codes.slice(i, i + fractionTotalCodes)
    splittedCode.map((code) => {
      const pageItem = []
      // ~~~~~~ Startup Page ~~~~~~
      pageItem.push({ ...STARTUP_PAGE, pageid: new ObjectId() })

      // ~~~~~~ Main Page ~~~~~~
      pairwises.map((pairwise, pos) => {
        randAttentionPos.map((attentionPos) => {
          if (pos === attentionPos) {
            pageItem.push({ ...ATTENTION_CHECK_PAGE, pageid: new ObjectId() })
          }
        })

        pageItem.push({ ...MAIN_PAGE, pageid: new ObjectId() })
      })

      // ~~~~~~ Finish Page ~~~~~~
      pageItem.push({ ...FINISH_PAGE, pageid: new ObjectId() })

      studies.push({
        ...TEMPLATE_STUDY,
        completion_code: completionCode,
        fail_code: failCode,
        pages: pageItem,
      })
    })
  }

  console.log("studies", studies.length)

  // const teamitems = submissions.map((submission) => {
  //   return submission.videoitems
  // })

  return Response.json({ codes, pairwises, studies }, { status: 200 })
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
