const Product = require("../../models/product.model");
// [GET] /products
module.exports.product = async (req, res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({position: "desc"});

    const newProduct = products.map(item => {
        item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed(0);
        return item;
    });


    res.render("client/pages/product/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products
});
}

// [GET] /product/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            status: "active",
            slug: req.params.slug
        }
        const product = await Product.findOne(find);
        res.render("client/pages/product/detail", {
            pageTitle: product.title,
            product: product
    });
    } catch(error) {
        res.redirect(`/product`);
    }
}