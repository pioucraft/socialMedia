const express = require("express")
const query = require("../../javascript/db")
const multer = require("multer")
const path = require('path');

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, res, file, callback) {
      callback(null, __dirname + "/images/");
    },
    filename: function (req, file, callback) {
        const originalExtension = path.extname(file.originalname);
        let fileName = crypto.randomUUID()
        callback(null, fileName + originalExtension)
        res.send({"fileName": fileName + originalExtension})
    }
});
  
const upload = multer({
    storage: storage,
    fileFilter: (req, res, file, callback) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/gif" ||
        file.mimetype == "image/webp"
      ) {
        callback(null, true);
      } else {
        callback(null, false);
        return callback(new Error("Only .png, .jpg, .jpeg, .gif and .webp format allowed!"));
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
        await uploadMiddleware(req, res, async (err) => {console.log(err)})
    }   
    else {
        res.status(401)
    }
})

module.exports = router
