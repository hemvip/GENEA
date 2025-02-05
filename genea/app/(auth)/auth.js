"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_WORKER_URL

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    console.log("useEffect", loading)
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/user`, {
        credentials: "include", // Important for sending cookies
      })

      if (res.ok) {
        const data = await res.json()
        console.log("checkUser.data", data)
        setUser(data.user.payload)
      }
    } catch (error) {
      console.log("Error checking user session:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = () => {
    window.location.href = `${API_URL}/auth/github`
  }

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      })
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
