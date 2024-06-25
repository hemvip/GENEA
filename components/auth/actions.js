"use server"

import { createClient } from "@/utils/supabase/server"
// import { redirect } from "next/router";
import { redirect } from "next/navigation"

export const signOut = async (e) => {
  const supabase = createClient()
  await supabase.auth.signOut()
  return redirect("/login")
}

export async function getFirstUser() {
  const client = await clientPromise
  const collection = client.db("hemvip").collection("users")
  const results = await collection.findOne(
    {},
    {
      projection: { _id: 0, emailVerified: 0 },
    }
  )
  if (results) {
    return {
      ...results,
      bioMdx: await getMdxSource(results.bio || placeholderBio),
    }
  } else {
    return null
  }
}
