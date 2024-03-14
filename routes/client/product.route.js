const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render("client/pages/home/product/index")
})

module.exports = router;