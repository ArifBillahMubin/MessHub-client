import { useState, useEffect } from 'react'
import useAuth from './useAuth'
import useAxiosSecure from './useAxiosSecure'

const useRole = () => {
    const { user, loading } = useAuth()
    const axiosSecure = useAxiosSecure()

    const [role, setRole] = useState(null)
    const [isRoleLoading, setIsRoleLoading] = useState(true)

    useEffect(() => {
        if (loading) return
        if (!user?.email) {
            setRole(null)
            setIsRoleLoading(false)
            return
        }

        setIsRoleLoading(true)
        axiosSecure
            .get(`/user/role?email=${user.email}`)
            .then(res => setRole(res.data.role))
            .catch(() => setRole(null))
            .finally(() => setIsRoleLoading(false))
    }, [user?.email, loading, axiosSecure])

    return [role, isRoleLoading]
}

export default useRole
