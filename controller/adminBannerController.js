const sharp = require('sharp')
const bannerModel = require('../model/banerModel')

const viewBanners = async (req, res) => {

    try {
        const ViewBanners = await bannerModel.find();
        res.render('admin/banner', {
            session: req.session.admin,
            allBanners: ViewBanners,
            documentTitle: "Banner Management ",
        })
    }
    catch (err) {
        console.log(err);
        res.redirect('/admin/dashboard')
    }
}

const addNewBanners = async (req, res) => {
    try {
        if (req.file) {
            let bannerImage = `${req.body.title}_${Date.now()}.png`;
            sharp(req.file.buffer)
                .toFormat("png")
                .png({ quality: 100 })
                .toFile(`public/img/banners/${bannerImage}`);

            req.body.image = bannerImage;
        }
        const newBanner = new bannerModel(req.body);
        newBanner.save();
        res.redirect("/admin/bannerManagement");
    }
    catch (err) {
        console.log(err);
        res.redirect('/admin/dashboard')
    }
}

const changeBannerActivity = async (req, res) => {
    try {
       
        let newActivity = req.body.currentActivity === "true";
        newActivity = !newActivity;
        
        await bannerModel.findByIdAndUpdate(req.body.bannerId, {
            $set: {
                active: newActivity,
            },
        });
        res.json({
            data: {
                activity: 1,
            },
        });
    }
    catch (err) {
        console.log(err);
        res.redirect('/admin/dashboard')
    }
}


const deleteBanner = async (req, res) => {
    try {
        console.log("sarath");
      await bannerModel.findByIdAndDelete(req.body.bannerId);
      res.json({
        data:'success'
    })
    } catch (err) {
        console.log(err);
        res.redirect('/admin/dashboard')
    }
  };


module.exports = { viewBanners, addNewBanners, changeBannerActivity,deleteBanner }