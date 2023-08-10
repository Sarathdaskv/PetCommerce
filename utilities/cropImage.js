 const multer=require("multer");

 const storageEngine = multer.diskStorage({
    destination: "public/img/users",
    filename: (req, file, cb) => {
        cb(null, `${req.body.userName}_${Date.now()}.jpeg`)
    },
  });

  const upload = multer({ storage: storageEngine });

  module.exports=upload;