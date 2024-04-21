const User = require("../../models/user.model");


// Kiểm tra xem có token trong cookie không và kiểm tra token đó có khớp với Account không
// Tìm role ứng với account
// Gáng user ( thông tin account) và role vào res local
module.exports.requireAuth = async (req, res, next) => {
    if(!req.cookies.tokenUser) {
        res.redirect(`/user/login`);
        return;
    } else {
        const user = await  User.findOne({tokenUser: req.cookies.tokenUser}).select("-password");
        if(!user) {
            res.redirect(`/user/login`);
        } else {
            next();
        }
    }
}