import axios from 'axios'


//image upload using imageBB
export const imageUpload = async imageData => {
    const formData = new FormData()
    formData.append('image', imageData)

    const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host}`,
        formData
    )
    return data?.data?.display_url
}


// Save user to MongoDB
export const saveUser = async userData => {
    const { data } = await axios.post(
        `${import.meta.env.VITE_api_url}users`,
        userData
    )
    return data
}