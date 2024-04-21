const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

// [GET]
module.exports.index = async (req, res) => {
    // Lấy ra sản phẩm nổi bật
    const productsFeatured = await Product.find({
        deleted: false,
        status: "active",
        featured: "1"
    }).limit(4);

    const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);

    // Lấy ra sản phẩm mới
    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({position: "desc"}).limit(4);

    const newProductsNew = productsHelper.priceNewProducts(productsNew);


    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    });
}