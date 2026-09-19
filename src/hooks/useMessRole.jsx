import { useState, useEffect, useCallback } from 'react'
import useAuth from './useAuth'
import useAxiosSecure from './useAxiosSecure'

// Returns the user's effective role inside their active mess (from messMembers collection).
// This is separate from users.role (global account role).
//
// Possible values:
//   "manager" — user created or was promoted to manager in their current mess
//   "member"  — user joined a mess as a regular member
//   null      — user has no active mess membership (backend returns null when hasMess=false)
//
// NOTE: does NOT import useCurrentUser internally.
// Each call to useCurrentUser() creates an isolated state instance — importing it here
// would mean the instance used by this hook never receives the refetchUser() trigger
// fired from CreateMessForm after a mess is created. The backend already short-circuits
// correctly when hasMess=false, so we let the backend handle that guard.
//
// Usage:
//   const [messRole, isMessRoleLoading, refetchMessRole] = useMessRole()

const useMessRole = () => {
    const { user, loading } = useAuth()
    const axiosSecure = useAxiosSecure()

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

        setIsMessRoleLoading(true)
        axiosSecure
            .get(`/users/mess-role?email=${user.email}`)
            .then(res => setMessRole(res.data.messRole ?? null))
            .catch(() => setMessRole(null))
            .finally(() => setIsMessRoleLoading(false))
    }, [user?.email, loading, axiosSecure, fetchTick])

    return [messRole, isMessRoleLoading, refetchMessRole]
}

export default useMessRole
