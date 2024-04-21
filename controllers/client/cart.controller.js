const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helpers/products");

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);

    // Tìm cart trong db
    const cart = await Cart.findOne({
        _id: cartId
    })

    // Kiểm tra xem product thêm vào đã có trong cart chưa
    const existProductInCart = cart.products.find(item => item.product_id == productId);

    // Nếu có -> cập nhật quantity  
    if(existProductInCart) {
        const newQuantity = quantity + existProductInCart.quantity;
        await Cart.updateOne(
            {
                _id: cartId,
                'products.product_id': productId
            },
            {
                'products.$.quantity': newQuantity
            }
        );
    // Nếu không có -> push một product mới vào cart
    } else {
        const objectCart = {
            product_id: productId,
            quantity: quantity
        };
    
        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                $push: { products: objectCart }
            }
        );
    }

   
    req.flash("success", "Thêm vào giỏ hàng thành công!");

    res.redirect("back");

}

// [GET] /cart/
module.exports.index = async (req, res) => {
    //Lấy ra cartId từ cookie
    const cartId = req.cookies.cartId;
    // Lấy cart từ db 
    const cart = await Cart.findOne({
        _id: cartId
    });
    // Nếu cart đó có sản phẩm thì lọc qua từng products của cart
    if(cart.products.length > 0) {
        for(const item of cart.products) {
            // Lấy ra id của từng product
            const productId = item.product_id;
            // Lấy ra thông tin chi tiết của từng product
            const productInfo = await Product.findOne({
                _id: productId
            });
            // Tính giá mới
            productInfo.priceNew = productHelper.priceNewProduct(productInfo);
            item.productInfo = productInfo;
            // Tính tổng giá của product
            item.totalPrice = item.quantity*productInfo.priceNew;
        }
    }
    //Tính tổng giá của cart
    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);
    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart
    });
}

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;

    await Cart.updateOne({
        _id: cartId
    }, {
        "$pull": { products: { "product_id": productId}}
    });

    req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng!");
    res.redirect("back");
}

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = req.params.quantity;

    await Cart.updateOne(
        {
            _id: cartId,
            'products.product_id': productId
        },
        {
            'products.$.quantity': quantity
        }
    );

    req.flash("success", "Cập nhật số lượng thành công!");
    res.redirect("back");
}