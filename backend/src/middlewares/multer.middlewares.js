
import multer from "multer";
import path from "path";
import fs from "fs";

const tempPath = path.join(process.cwd(), "public", "temp");

// ensure folder exists
if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("Multer storing file..."); // ✅ DEBUG
        cb(null, tempPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

export const upload = multer({ storage });


/*import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ 
    storage, 
}) */
