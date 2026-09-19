import { useState, useEffect, useCallback } from 'react'
import useAuth from './useAuth'
import useAxiosSecure from './useAxiosSecure'
import useCurrentUser from './useCurrentUser'

// Returns the user's effective role inside their active mess (from messMembers collection).
// This is separate from users.role (global account role).
//
// Possible values:
//   "manager" — user created or was promoted to manager in their current mess
//   "member"  — user joined a mess as a regular member
//   null      — user has no active mess membership yet (hasMess === false)
//
// Usage:
//   const [messRole, isMessRoleLoading, refetchMessRole] = useMessRole()
const useMessRole = () => {
    const { user, loading } = useAuth()
    const axiosSecure = useAxiosSecure()
    const { currentUser } = useCurrentUser()

    const [messRole, setMessRole] = useState(null)
    const [isMessRoleLoading, setIsMessRoleLoading] = useState(true)
    const [fetchTick, setFetchTick] = useState(0)

    const refetchMessRole = useCallback(() => {
        setFetchTick(t => t + 1)
    }, [])

    useEffect(() => {
        if (loading) return
        if (!user?.email) {
            setMessRole(null)
            setIsMessRoleLoading(false)
            return
        }

        // If hasMess is definitively false, skip the network call
        if (currentUser && !currentUser.hasMess) {
            setMessRole(null)
            setIsMessRoleLoading(false)
            return
        }

        setIsMessRoleLoading(true)
        axiosSecure
            .get(`/users/mess-role?email=${user.email}`)
            .then(res => setMessRole(res.data.messRole ?? null))
            .catch(() => setMessRole(null))
            .finally(() => setIsMessRoleLoading(false))
    }, [user?.email, loading, axiosSecure, fetchTick, currentUser?.hasMess])

    return [messRole, isMessRoleLoading, refetchMessRole]
}

export default useMessRole
