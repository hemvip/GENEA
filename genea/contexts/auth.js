"use client"

import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext({
  accessToken: "",
  email: "",
  name: "",
  avatar: "",
  userId: "",
  signIn: () => {},
  signOut: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [avatar, setAvatar] = useState("")
  const [userId, setUserId] = useState("")

  useEffect(() => {
    const email = localStorage.getItem("email")
    const avatar = localStorage.getItem("avatar")
    const name = localStorage.getItem("name")
    const userId = localStorage.getItem("userId")
  }, [])

  // actions list sample will be replace by [] here
  return (
    <AuthContext.Provider value={{ accessToken, email, name, avatar, userId }}>
      {children}
    </AuthContext.Provider>
  )
}
