const express = require("express")
const query = require("../../javascript/db")
const multer = require("multer")
const path = require('path');

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, __dirname + "/images/");
    },
    filename: function (req, file, cb) {
        const originalExtension = path.extname(file.originalname);
        let fileName = crypto.randomUUID()
        cb(null, fileName + originalExtension)
    }
});
  
const upload = multer({
    storage: storage,
    fileFilter: (req, res, file, cb) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/gif" ||
        file.mimetype == "image/webp"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Only .png, .jpg, .jpeg, .gif and .webp format allowed!"));
      }
    },
    limits: { fileSize: 15000000 },
});

router.post("/:handle/:token", async (req, res) => {
    let handle = req.params.handle
    let token = req.params.token
    let realToken = (await query("SELECT * FROM Users WHERE handle = $1;", [handle])).rows[0].token
    if(realToken == token) {
        const uploadMiddleware = await upload.single("files");
        uploadMiddleware(req, res, async (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'File upload failed.' });
            } else {
                // Send the filename in the response
                const filename = req.file.filename;
                res.status(200).json({ filename: filename });
            }
        })
    }   
    else {
        res.status(401)
    }
})

module.exports = router
