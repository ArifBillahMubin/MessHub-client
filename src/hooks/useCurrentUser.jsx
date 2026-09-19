import { useState, useEffect, useCallback } from 'react'
import useAuth from './useAuth'
import useAxiosSecure from './useAxiosSecure'

// Returns the full MongoDB user document for the authenticated user.
// { currentUser, isUserLoading, refetchUser }
// - currentUser.hasMess — whether the user belongs to a mess
// - refetchUser()       — call after create/join mess to force a fresh fetch
const useCurrentUser = () => {
    const { user, loading } = useAuth()
    const axiosSecure = useAxiosSecure()

    const [currentUser, setCurrentUser] = useState(null)
    const [isUserLoading, setIsUserLoading] = useState(true)
    // Incrementing this triggers the effect to re-run without changing deps signature
    const [fetchTick, setFetchTick] = useState(0)

    const refetchUser = useCallback(() => {
        setFetchTick(t => t + 1)
    }, [])

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
    }, [user?.email, loading, axiosSecure, fetchTick])

    return { currentUser, isUserLoading, refetchUser }
}

export default useCurrentUser
