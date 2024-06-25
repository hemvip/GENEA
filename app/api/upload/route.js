// "use server"

import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3"
import { v4 as uuid } from "uuid"
import { Upload } from "@aws-sdk/lib-storage"
import clientPromise from "@/server/mongodb"

export async function POST(req, res) {
  const formData = await req.formData()
  const userId = formData.get("userId")
  const email = formData.get("email")
  const teamname = formData.get("teamname")

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

  const videoitems = []

  try {
    for (let [key, value] of formData.entries()) {
      if (key === "video") {
        const arrayBuffer = await value.arrayBuffer()
        const uniqueKey = `genea/${userId}/${Date.now()}_${value.name}`
        console.log("Uploading uniqueKey: ", uniqueKey)

        // Create the parameters for the PutObjectCommand
        const params = {
          Bucket: "gesture",
          Key: uniqueKey,
          Body: new Uint8Array(arrayBuffer),
          ContentType: value.type,
        }

        const parallelUploads3 = new Upload({
          client: s3,
          params: params,
          leavePartsOnError: false, // Whether to abort the multipart upload on error
        })

        parallelUploads3.on("httpUploadProgress", (progress) => {
          console.log("progress", progress.Key)
        })

        const uploadResult = await parallelUploads3.done()
        // console.log("Upload complete:", uploadResult)

        const filename = value.name.split(".")
        if (filename.length > 1) {
          filename.pop()
        }
        const inputid = filename.join(".")
        videoitems.push({
          inputid: inputid,
          videoid: uploadResult.Key,
          teamid: userId,
          url: uploadResult.Location,
        })

        // Upload the video file to B2 storage
        // await s3.send(new PutObjectCommand(putObjectParams))
      }
    }

    const insertResult = await db
      .collection("submissions")
      .insertOne({ userId, teamname, email, videoitems })
    // console.log("insertResult", insertResult)

    if (insertResult.insertedId) {
      return Response.json(
        {
          success: true,
          msg: "Your submission uploaded successfully.",
          error: null,
        },
        { status: 200 }
      )
    } else {
      return Response.json(
        {
          success: false,
          msg: "Upload success but failed insert submissions, please contact for support.",
          error: null,
        },
        { status: 500 }
      )
    }
  } catch (error) {
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
