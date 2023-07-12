const productModel = require('../model/productModel')
const mongoose = require('mongoose')
const categoryModel = require('../model/categoryModel')
const sharp = require('sharp')

const viewProducts = async (req, res) => {
    try {
        const categoryList = await categoryModel.find()
        const productList = await productModel.find().populate("category")
        res.render('admin/products', {
            session: req.session.admin,
            documentTitle: "Product Management",
            categories: categoryList,
            products: productList
        })
    }
    catch (err) {
        console.log(err);
        res.redirect('/admin/dashboard')
    }
}

const addProducts = async (req, res) => {
    try {
        let frontImage = `${req.body.name}_front_image_${Date.now()}.png`
        sharp(req.files.frontImage[0].buffer)
            .toFormat("png")
            .png({ quality: 80 })
            .toFile(`public/img/products/${frontImage}`);
        req.body.frontImage = frontImage;
        let thumbnail = `${req.body.name}_thumbnail_${Date.now()}.png`;
        sharp(req.files.thumbnail[0].buffer)
            .toFormat("png")
            .png({ quality: 80 })
            .toFile(`public/img/products/${thumbnail}`);
        req.body.thumbnail = thumbnail;
        const newImages = [];
        for (i = 0; i < 3; i++) {
            imageName = `${req.body.name}_image${i}_${Date.now()}.png`;
            sharp(req.files.images[i].buffer)
                .toFormat("png")
                .png({ quality: 80 })
                .toFile(`public/img/products/${imageName}`);
            newImages.push(imageName);
        }
        req.body.images = newImages;
        // let categoryName= req.body.category;
        req.body.category = new mongoose.Types.ObjectId(req.body.category);

        console.log(req.body);

        const newProduct = new productModel({
            name: req.body.name,
            category: req.body.category,
            brand: req.body.brand,
            description: req.body.description,
            varientName: req.body.VarientName || " ",
            price: req.body.price,
            discountPrice: req.body.price,
            inventory: req.body.inventory,

            thumbnail: req.body.thumbnail,
            frontImage: req.body.frontImage,
            images: req.body.images,

        })


        await productModel.insertMany([newProduct]);
        console.log("product added successfully");
        res.redirect('/admin/productManagement')
    }
    catch (err) {
        console.log(err);
        res.redirect('/admin/dashboard')
    }
}

const editProducts = async (req, res) => {

    try {
        const id = req.params.id
        const editProduct = await productModel.findOne({ _id: id }).populate("category");
        const categoryList = await categoryModel.find({})

        if (editProduct) {
            res.render('admin/editProducts', {
                session: req.session.admin,
                documentTitle: "Product Management",
                categories: categoryList,
                product: editProduct
            })
        }
        else {
            res.redirect('/admin/dashboard')
        }
    }
    catch (err) {
        console.log(err);
        res.redirect('/admin/dashboard')
    }
}

const saveEditProducts = async (req, res) => {
    try {

        if (JSON.stringify(req.files) !== "{}") {
            console.log("req.files", req.files);
            if (req.files.frontImage) {
                let frontImage = `${req.body.name}_frontImage_${Date.now()}.png`;
                sharp(req.files.frontImage[0].buffer)
                    .toFormat("png")
                    .png({ quality: 80 })
                    .toFile(`public/img/products/${frontImage}`);
                req.body.frontImage = frontImage;
            }

            if (req.files.thumbnail) {
                let thumbnail = `${req.body.name}_thumbnail_${Date.now()}.png`;
                sharp(req.files.thumbnail[0].buffer)
                    .toFormat("png")
                    .png({ quality: 80 })
                    .toFile(`public/img/products/${thumbnail}`);
                req.body.thumbnail = thumbnail;
            }
            if (req.files.images) {
                const newImages = [];
                for (i = 0; i < 3; i++) {
                    imageName = `${req.body.name}_image${i}_${Date.now()}.png`;
                    sharp(req.files.images[i].buffer)
                        .toFormat("png")
                        .png({ quality: 80 })
                        .toFile(`public/img/products/${imageName}`);
                    newImages.push(imageName);
                }
                req.body.images = newImages;
            }
        }
        req.body.category = new mongoose.Types.ObjectId(req.body.category);
        const editProducts = await productModel.updateOne(
            {
                _id: req.params.id
            }, {
            $set: {
                name: req.body.name,
                category: req.body.category,
                brand: req.body.brand,
                description: req.body.description,
                varientName: req.body.VarientName || " ",
                price: req.body.price,
                discountPrice: req.body.price,
                inventory: req.body.inventory,
                thumbnail: req.body.thumbnail,
                frontImage: req.body.frontImage,
                images: req.body.images,
            }
        }
        )

        res.redirect('/admin/productManagement')
    }
    catch (err) {
        console.log(err);
        res.redirect('/admin/dashboard')
    }
}

const changeListing = async (req, res) => {

    try {
        const currentProduct = await productModel.findById(req.params.id);
        let currentListing = currentProduct.listed;
        if (currentListing == true) {
            currentListing = false;
        } else {
            currentListing = true;
        }
        currentListing = Boolean(currentListing);
        await productModel.findByIdAndUpdate(currentProduct._id, {
          listed: currentListing,
        });
        res.json({
            data:"success"
        })
    }
    catch (err) {
        console.log(err);
        res.redirect('/admin/dashboard')
    }
}

module.exports = { viewProducts, addProducts, editProducts, saveEditProducts, changeListing }