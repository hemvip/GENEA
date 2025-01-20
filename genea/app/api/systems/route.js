import clientPromise from "@/server/mongodb"

export async function GET(req, res) {
  const client = await clientPromise
  const db = client.db("hemvip")

  const systems = await db.collection("systems").find({}).toArray()
  const submissions = await db.collection("submissions").find({}).toArray()

  const teamMap = submissions.reduce((acc, team) => {
    acc[team._id] = team.teamname // Assuming 'teamname' is the field you want to add
    return acc
  }, {})

  const systemsWithTeamname = systems.map((system) => ({
    ...system,
    teamname: teamMap[system.user_id] || null, // Add 'teamname' or null if not found
  }))

  // const { systems } = systems
  // console.log(systemsWithTeamname)
  return Response.json(
    { systems: systemsWithTeamname, success: true, error: null },
    { status: 200 }
  )
}

export async function POST(req, res) {
  const { name, type, description, userId } = await req.json()
  // const  = formData.get("name")
  // const type = formData.get("type")
  // const description = formData.get("description")
  // const userId = formData.get("userId")

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
    const update = {
      user_id: userId,
      name: name,
      description: description,
      type: type,
    }

    const result = await db.collection("systems").insertOne(update)
    console.log("result", result)

    if (result.insertedId) {
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
