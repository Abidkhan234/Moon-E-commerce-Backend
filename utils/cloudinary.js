import cloudinary from '../config/cloudinaryConfig.js'

import fs from 'fs-extra'

const imageUploader = async (localFilePath) => {
    try {

        if (!localFilePath) {
            return;
        }
        const publicFile = await cloudinary.uploader.upload(localFilePath, {
            folder: "Moon_E-commerce",
        });

        if (!publicFile) {
            return;
        }

        fs.removeSync(localFilePath);

        return publicFile;
    } catch (error) {
        console.log(error);
        if (localFilePath) {
            fs.removeSync(localFilePath);
        }
    }
}

const imageDestroyer = async (publicId) => {
    try {

        if (!publicId) {
            return;
        }

        const { result } = await cloudinary.uploader.destroy(publicId);

        return result
    } catch (error) {
        console.log(error);
        throw error
    }
}

export { imageUploader, imageDestroyer }