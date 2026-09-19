import { useMutation } from '@tanstack/react-query'
import useAxiosSecure from './useAxiosSecure'
import useAuth from './useAuth'

// Mutation hook for POST /messes.
// Automatically injects the authenticated user's email so the frontend
// never needs to manually pass it — the backend resolves the user from email.
//
// Usage:
//   const { mutate: createMess, isPending, isSuccess, data, error } = useCreateMess()
//   createMess({ name, description, location, maxMembers })
const useCreateMess = () => {
    const axiosSecure = useAxiosSecure()
    const { user } = useAuth()

    return useMutation({
        mutationFn: async (formData) => {
            const payload = {
                email: user.email,   // backend resolves _id from this — no uid sent
                name: formData.name,
                description: formData.description || '',
                location: {
                    address: formData.location.address || '',
                    area: formData.location.area || '',
                    city: formData.location.city || '',
                    cityCorporation: formData.location.cityCorporation || '',
                    latitude: formData.location.latitude,
                    longitude: formData.location.longitude,
                },
                maxMembers: Number(formData.maxMembers),
            }

            const res = await axiosSecure.post('/messes', payload)
            return res.data  // { success, messCode, messId, name, message }
        },
    })
}

export default useCreateMess
