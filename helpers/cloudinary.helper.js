const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

 cloudinary.config({ 
        cloud_name: 'drakip2hi', 
        api_key: '232596455559333', 
        api_secret: '6GGLJsPVo72_fCMRMvVE4Y5uvZc' 
    });

module.exports.storage = new CloudinaryStorage({
    cloudinary : cloudinary
})