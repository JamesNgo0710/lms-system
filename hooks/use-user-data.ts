import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'

interface ExtendedUserData {
  bio?: string
  phone?: string
  location?: string
  skills?: string
  interests?: string
  joinedDate?: string
  image?: string
}

export function useUserData() {
  const { data: session } = useSession()
  const [userData, setUserData] = useState<ExtendedUserData>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user?.id && session.accessToken) {
      fetchUserData()
    }
  }, [session?.user?.id, session?.accessToken])

  const fetchUserData = async () => {
    if (!session?.user?.id || !session.accessToken) return

    setLoading(true)
    setError(null)

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await axios.get(`${API_URL}/api/users/${session.user.id}`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Accept': 'application/json',
        },
      })

      const data = response.data
      setUserData({
        bio: data.bio,
        phone: data.phone,
        location: data.location,
        skills: data.skills,
        interests: data.interests,
        joinedDate: data.joined_date,
        image: data.profile_image,
      })
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError('Failed to fetch user data')
    } finally {
      setLoading(false)
    }
  }

  const refreshUserData = () => {
    fetchUserData()
  }

  return {
    userData,
    loading,
    error,
    refreshUserData,
  }
}