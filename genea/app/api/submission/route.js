import clientPromise from "@/server/mongodb"
import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3"
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
  // console.log("go here", formData.get("motion_files").name)

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const s3 = new S3Client({
    endpoint: process.env.B2_ENDPOINT,
    region: process.env.B2_REGION,
    credentials: {
      accessKeyId: process.env.B2_KEYID,
      secretAccessKey: process.env.B2_APPLICATIONKEY,
    },
  })
  if (!s3) {
    return Response.json(
      {
        success: false,
        msg: "Cannot connect to blackblaze storage.",
        error: null,
      },
      { status: 500 }
    )
  }

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

  const bvhfiles = []

  try {
    for (let [key, value] of formData.entries()) {
      if (key === "motion_files") {
        const arrayBuffer = await value.arrayBuffer()
        // const uniqueKey = `bvh/${userId}/${Date.now()}_${value.name}`
        const uniqueKey = `bvh/${userId}/${value.name}`
        console.log("Uploading uniqueKey: ", uniqueKey)

        // Create the parameters for the PutObjectCommand
        const params = {
          Bucket: "gesture",
          Key: uniqueKey,
          Body: new Uint8Array(arrayBuffer),
          ContentType: "binary/octet-stream",
        }

        // const parallelUploads3 = new Upload({
        //   client: s3,
        //   params: params,
        //   leavePartsOnError: true, // Whether to abort the multipart upload on error
        // })

        // parallelUploads3.on("httpUploadProgress", (progress) => {
        //   console.log("progress", progress.Key)
        // })

        // Upload the video file to B2 storage
        const uploadResult = await s3.send(new PutObjectCommand(params))
        // const uploadResult = await parallelUploads3.done()
        // console.log("Upload complete:", uploadResult)

        const filename = value.name.split(".")
        if (filename.length > 1) {
          filename.pop()
        }
        const inputid = filename.join(".")
        bvhfiles.push({
          _id: new ObjectId(),
          inputid: inputid,
          bvhid: uploadResult.ETag.replace(/\"/g, ""),
          teamid: userId,
          url: `https://gesture.s3.${process.env.B2_REGION}.backblazeb2.com/${uniqueKey}`,
        })
      }
    }

    // Check if the document exists
    const existingDocument = await db
      .collection("submissions")
      .findOne({ userId: userId })

    if (existingDocument) {
      const updateDoc = {
        $push: { bvh: { $each: bvhfiles } },
      }
      const updateResult = await db
        .collection("submissions")
        .updateOne({ userId: userId }, updateDoc)

      console.log("updateResult", updateResult)
      if (updateResult.modifiedCount) {
        return Response.json(
          {
            success: true,
            msg: "Your submission uploaded successfully.",
            error: null,
          },
          { status: 200 }
        )
      }
    } else {
      const insertResult = await db
        .collection("submissions")
        .insertOne({ userId, teamname, email, videos: [], bvh: bvhfiles })
      console.log("insertResult", insertResult)

      if (insertResult.insertedId) {
        return Response.json(
          {
            success: true,
            msg: "Your submission inserted successfully.",
            error: null,
          },
          { status: 200 }
        )
      }
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
