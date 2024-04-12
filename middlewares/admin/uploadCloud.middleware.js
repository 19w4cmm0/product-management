const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// Cloudinary
cloudinary.config({
    cloud_name: "daysqccvf",
    api_key: "846979937448696",
    api_secret: "-oGlY2IK-81cg2xWdUrbL2n7sBA",
})
// End Cloudinary

module.exports.upload = (req, res, next) => {
    if(req.file) {
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream
        ((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        })

        streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  }
    async function upload(req) {
      let result = await streamUpload(req);
      req.body[req.file.fieldname] = result.secure_url;
      next();
    }
    upload(req);
    }else {
    next(); 
    }
}