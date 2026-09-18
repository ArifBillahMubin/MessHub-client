import { useState, useEffect } from 'react'
import useAuth from './useAuth'
import useAxiosSecure from './useAxiosSecure'

// Returns the full MongoDB user document for the authenticated user.
// Provides { currentUser, isUserLoading } — use hasMess from currentUser.hasMess
const useCurrentUser = () => {
    const { user, loading } = useAuth()
    const axiosSecure = useAxiosSecure()

    const [currentUser, setCurrentUser] = useState(null)
    const [isUserLoading, setIsUserLoading] = useState(true)

    useEffect(() => {
        if (loading) return
        if (!user?.email) {
            setCurrentUser(null)
            setIsUserLoading(false)
            return
        }

        setIsUserLoading(true)
        axiosSecure
            .get(`/users/me?email=${user.email}`)
            .then(res => setCurrentUser(res.data))
            .catch(() => setCurrentUser(null))
            .finally(() => setIsUserLoading(false))
    }, [user?.email, loading])

    return { currentUser, isUserLoading }
}

export default useCurrentUser
