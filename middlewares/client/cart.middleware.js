const Cart = require("../../models/cart.model")

module.exports.cartId = async (req, res, next) => {
    // Kiểm tra xem user đã có cart chưa
    //Nếu chưa tạo một cart mới vào db
    if(!req.cookies.cartId) {
        const cart = new Cart();
        await cart.save();

        // Thêm cartId vào cookie
        const expiresTime = 1000 * 60 *60 * 24 * 365;
        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresTime)
        });
        // Nếu có, lấy cart đó ra và cho cart thành biến locals
    } else {
        const cart = await Cart.findOne({
            _id: req.cookies.cartId
        });
        // Tính tổng quantity
        cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);

        res.locals.miniCart = cart;
    }
    next();
}