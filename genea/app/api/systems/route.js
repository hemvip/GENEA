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
