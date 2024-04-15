const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelpers = require("../../helpers/createTree")

// [GET] /admin/product-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelpers.tree(records);


    res.render("admin/pages/product-category/index",{
        pageTitle: "Danh mục sản phẩm",
        records: newRecords
    });
};

// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };
    
    const records = await ProductCategory.find(find)

    const newRecords = createTreeHelpers.tree(records);

    res.render("admin/pages/product-category/create",{
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords
    });
};

// [POST] /admin/product-category/create
module.exports.createPost = async (req, res) => {
    if(req.body.position == ""){
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    

    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };


        const data = await ProductCategory.findOne(find); 
        const dataALL = await ProductCategory.find({
            deleted: false
        });
        const newRecords = createTreeHelpers.tree(dataALL);

   
        res.render("admin/pages/product-category/edit",{
            pageTitle: "Chỉnh sửa danh mục",
            data: data,
            dataTree: newRecords
        });
    }catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/product-category`);
    }
    };

// [PATCH] /admin/product-category/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    req.body.position = parseInt(req.body.position);

    try {
        await ProductCategory.updateOne({_id: id}, req.body); 
        req.flash("success", `Cập nhật thành công!`);
    } catch (error) {
        req.flash("success", `Cập nhật thất bại!`);
    }

    res.redirect("back");
};