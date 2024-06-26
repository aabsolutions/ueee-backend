const {v2: cloudinary} = require('cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  })

const cloudUploadFile = async (urlFileToUpload, type) => {
  return await cloudinary.uploader.upload(urlFileToUpload, {
    folder: `ueee/${type}`
  })
}

const cloudDeleteFile = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId)
}

module.exports = { cloudUploadFile, cloudDeleteFile }