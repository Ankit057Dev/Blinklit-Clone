//cloudinary configuration to save images data in db uploaded by user
import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
})//credientials


const uploadImageCloudinary = async(image)=>{
    const buffer = image?.buffer || Buffer.from(await image.arrayBuffer())// create image to an array buffer

    const uploadImage = await new Promise ((resolve,reject)=>{
        cloudinary.uploader.upload_stream({folder : "blinkit clone"},(error,uploadResult)=>{
            return resolve(uploadResult)
        }).end(buffer)
    })

    return uploadImage
}

export default uploadImageCloudinary