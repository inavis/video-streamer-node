import express, { response } from "express";
import multer from "multer";
import ffmpeg from "fluent-ffmpeg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

import {  } from "../helper.js";


const router = express.Router();

//using multer for multi part storage
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },

    //adding filter -> only mp4 files allowed
    //using callback(cb) for that
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).send({messge:'only jpg, png, mp4 is allowed'}), false);
        }
        cb(null, true)
    }
})

//mentioning only sinle file is uploaded
var upload = multer({ storage: storage }).single("file")

router.post("/upload", (req, res) => {

    upload(req, res, err => {
        console.log("err",err)
        if (err) {
            return res.json({ message:"some error occured" })
        }
        return res.json({ message:"file upload success", filepath: res.req.file.path, filename: res.req.file.filename })
    })

});


router.post("/thumbnail",(req,res)=>{

    let thumbsfilepath ="";
    let fileduration ="";
    console.log(req.body)

    //getting file duratiion from metadata
    ffmpeg.ffprobe(req.body.filepath, function(err, metadata){
        console.dir(metadata);
        console.log(metadata.format.duration);

        fileduration = metadata.format.duration;
    })

    //passing file path of video to ffmpeg
    ffmpeg(req.body.filepath)
        .on('filenames', function (filenames) {
            console.log('Will generate ' + filenames.join(', '))
            //getting file path of thumbnail
            thumbsfilepath = "uploads/thumbnails/" + filenames[0];
        })
        .on('end', function () {
            console.log('Screenshots taken');
            return res.json({ message:"Thumbnail Uploaded", thumbsfilepath: thumbsfilepath, fileduration: fileduration})
        })
        .screenshots({
            // Will take screens at 20%, 40%, 60% and 80% of the video
            count: 3,
            folder: 'uploads/thumbnails',
            size:'320x240',
            // %b input basename ( filename w/o extension )
            filename:'thumbnail-%b.png'
        });
})


export const videoRouter = router;
