import axios from "axios";

export const uploadImageImgbb = async (profile_img) => {
    const key = process.env.imgbb_key;

    if(typeof profile_img === "string") {
        return profile_img
    }

    try {
        if (profile_img) {
            const data = new FormData()
            data.append('image', profile_img)

            let url = `https://api.imgbb.com/1/upload?key=${key}`;

            const res = await axios.post(url, data, {})
            
            if (res.data.success) {
                return res.data.data.image.url
            }
        }
    } catch (e) {
        return e.message
    }
}


