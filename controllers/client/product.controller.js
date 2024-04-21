const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");
const ProductCategory = require("../../models/product-category.model");
const productsCategoryHelper = require("../../helpers/products-category")

// [GET] /products
module.exports.product = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({position: "desc"});

    const newProduct = productsHelper.priceNewProducts(products);
        

    res.render("client/pages/product/index", {
        pageTitle: "Danh sách sản phẩm",
        products: newProduct
});
}

// [GET] /product/detail/:slugProduct
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            status: "active",
            slug: req.params.slugProduct
        }
        const product = await Product.findOne(find);
        // Tìm danh mục cho từng sản phẩm
        if(product.product_category_id) {
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            });
            product.category = category;
        }
        // End

        // Giá mới 
        product.priceNew = productsHelper.priceNewProduct(product);

        res.render("client/pages/product/detail", {
            pageTitle: product.title,
            product: product
    });
    } catch(error) {
        res.redirect(`/product`);
    }
}

// [GET] /product/:slugCategory
module.exports.category = async (req, res) => {
    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        status: "active",
        deleted: false
    });

    

    const listSubCategory = await productsCategoryHelper.getSubCategory(category.id);
    const listSubCategoryId = listSubCategory.map(item => item.id);

    const products = await Product.find({
        product_category_id: { $in: [category.id, ...listSubCategoryId]},
        deleted: false
    }).sort({ position: "desc" });

    const newProducts = productsHelper.priceNewProducts(products);

    res.render("client/pages/product/index", {
        pageTitle: category.title,
        products: newProducts
});
}