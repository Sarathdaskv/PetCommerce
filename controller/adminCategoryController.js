const categoryModel = require('../model/categoryModel')

const listCategory = async (req, res) => {
    try {
        const categoryList = await categoryModel.find();
        res.render('admin/categories', {
            documentTitle: "Category Management",
            session: req.session.admin,
            details: categoryList
        })
    }
    catch (err) { 
        console.log(err);
        res.redirect('/admin/login')
    }
}

const addCategory = async (req, res) => {
    try {
        let inputCategory = req.body.category;
        inputCategory = inputCategory.toLowerCase();
        const category = await categoryModel.findOne({ name: inputCategory })
        const categoryList = await categoryModel.find();
        if (category) {
            res.render('admin/categories', { 
                documentTitle: "Category Management",
                session: req.session.admin,
                details: categoryList,
                errorMessage: 'Category already exists'
            })
        }
        else {
            const data = new categoryModel({
                name: inputCategory
            })
            await categoryModel.insertMany([data]);
            res.redirect('/admin/categories')
        }
    }
    catch (err) {
        console.log(err);
        res.redirect('/admin/Login')
    }
}

const editCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        
        const currentCategory = await categoryModel.findById(categoryId);
        console.log(currentCategory);
        req.session.currentCategory = currentCategory;
        res.render('admin/editCategory', {
            documentTitle: "Category Management",
            session: req.session.admin,
            category: currentCategory
        })
        
    }
    catch (err) {
        console.log(err);
        res.redirect('/admin/Login')
    }
}
const saveCategory = async (req, res) => {
    try {
        const currentCategory = req.session.currentCategory;
        let newCategory = req.body.name;
        const duplicationCheck = await categoryModel.findOne({
            name: newCategory
        });
        if (duplicationCheck) {
            res.render("admin/editCategory", {
                session: req.session.admin,
                documentTitle: "Edit Category ",
                errorMessage: "Duplication of categories not allowed",
                category: null,
            });

        } else {
            await categoryModel.updateOne(
                { _id: currentCategory._id },
                { $set: { name: newCategory } }
            );
            res.redirect("/admin/categories");
        }
    }
    catch (err) {
        console.log(err);
        res.redirect('/admin/login')
    }
}

const deleteCategory=async(req,res)=>{
    try{
       
        const categoryId = req.params.id;
        console.log(categoryId);
        const deleteCategory=await categoryModel.findByIdAndDelete(categoryId);
        res.json({
            data:'success'
        })
    }
    catch(err){
        console.log(err);
        res.redirect('/admin/login')
    }
}

module.exports = { listCategory, addCategory, editCategory, saveCategory,deleteCategory }