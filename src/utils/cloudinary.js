import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary config (keep this once in your file)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
    try {
        // ❌ No file → skip
        if (!filePath) {
            console.log("No file path provided");
            return null;
        }

        // ❌ File doesn't exist → skip safely
        if (!fs.existsSync(filePath)) {
            console.log("File does not exist:", filePath);
            return null;
        }

        // 🚀 Upload to Cloudinary
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
        });

        console.log("✅ File uploaded:", response.secure_url);

        // 🧹 Delete local file after success
        fs.unlinkSync(filePath);

        return response;
    } catch (error) {
        console.log("❌ Cloudinary upload error:", error.message);

        // 🧹 Safe cleanup if something fails
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return null;
    }
};

export { uploadOnCloudinary };


//cloudinary.uploader.upload("https://upload.wikimedia.orgorg/wikipedia/commons/a/ae/Olympic_flag.jpg" ,
//{ public_id: "olympic_flag" },
//function(error, result) { console.log(result); });
