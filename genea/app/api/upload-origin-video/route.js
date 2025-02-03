import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3"
import clientPromise from "@/server/mongodb"
import { ObjectId } from "bson"

const BUCKET_NAME = "genealeaderboard"

export async function POST(req, res) {
  const formData = await req.formData()
  const inputcode = formData.get("inputcode")
  const systemid = formData.get("systemid")
  console.log("formData", formData)

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

  //  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ******* Create System Folder *******
  try {
    // Create a PutObjectCommand to create the folder
    const createSystemFolderCMD = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: `videos/systems/${systemid}`, // The folder name is the key ending with '/'
    })

    // Send the command
    const response = await s3.send(createSystemFolderCMD)
    console.log("Folder created successfully:", response)
  } catch (error) {
    console.error("Error creating folder:", error)
  }

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ******* Upload videos *******
  const videofiles = []

  try {
    for (let [key, value] of formData.entries()) {
      if (key === "video") {
        const arrayBuffer = await value.arrayBuffer()
        const uniqueKey = `videos/systems/${systemid}/${value.name}`
        console.log("Uploading uniqueKey: ", uniqueKey)

        // Create the parameters for the PutObjectCommand
        const params = {
          Bucket: BUCKET_NAME,
          Key: uniqueKey,
          Body: new Uint8Array(arrayBuffer),
          ContentType: value.type,
        }
        console.log("params", params)
        // Upload the video file to B2 storage
        const uploadResult = await s3.send(new PutObjectCommand(params))
        // const uploadResult = await parallelUploads3.done()
        console.log("Upload complete:", uploadResult)

        const filename = value.name.split(".")
        if (filename.length > 1) {
          filename.pop()
        }
        const inputid = filename.join(".")
        console.log(
          "go here",
          `https://genealeaderboard.s3.${process.env.B2_REGION}.backblazeb2.com/${uniqueKey}`
        )
        videofiles.push({
          _id: new ObjectId(),
          inputid: inputid,
          videoid: uploadResult.ETag.replace(/\"/g, ""),
          teamid: systemid,
          url: `https://genealeaderboard.s3.${process.env.B2_REGION}.backblazeb2.com/${uniqueKey}`,
        })
      }
    }

    // Check if the document exists
    const existingDocument = await db
      .collection("videos")
      .findOne({ userId: systemid })

    if (existingDocument) {
      const updateDoc = {
        $push: { videos: { $each: videofiles } },
      }
      const updateResult = await db
        .collection("videos")
        .updateOne({ userId: systemid }, updateDoc)
      // console.log("updateResult", updateResult)

      if (updateResult.modifiedCount) {
        return Response.json(
          {
            success: true,
            msg: "Your submission updated successfully.",
            error: null,
          },
          { status: 200 }
        )
      }
    } else {
      const insertResult = await db.collection("submissions").insertOne({
        userId: systemid,
        teamname,
        email,
        videos: videofiles,
        bvh: [],
      })
      // console.log("insertResult", insertResult)

      if (insertResult.insertedId) {
        return Response.json(
          {
            success: true,
            msg: "Your videos inserted successfully.",
            error: null,
          },
          { status: 200 }
        )
      }
    }

    return Response.json(
      {
        success: false,
        msg: "Upload success but failed insert videos, please contact for support.",
        error: null,
      },
      { status: 500 }
    )
  } catch (error) {
    console.log("Exception: ", error)
    return Response.json(
      {
        success: false,
        msg: "Your videos is failed, please contact for support.",
        error: error,
      },
      { status: 500 }
    )
  }
}

export async function PATCH(req, res) {
  const client = await clientPromise
  const db = client.db("hemvip")

  // Parse the request body
  const { csv } = await req.json()

  if (!id) {
    return res.status(400).json({ success: false, message: "ID is required" })
  }

  try {
    // Update the video document with the given ID
    const updatedVideo = await db.collection("videos").findOneAndUpdate(
      { _id: new ObjectId(id) }, // Using ObjectId if the id is MongoDB ObjectId type
      {
        $set: {
          name: name || undefined,
          description: description || undefined,
        },
      },
      { returnDocument: "after" } // Returns the document after the update
    )

    if (!updatedVideo.value) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" })
    }

    return res.status(200).json({
      success: true,
      video: updatedVideo.value,
      message: "Video updated successfully",
    })
  } catch (error) {
    console.error("Error updating video:", error)
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" })
  }
}
