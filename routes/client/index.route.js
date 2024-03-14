const productRoutes = require('./product.route')
const homeRoutes = require('./home.route');

module.exports = (app) => {
    app.use('/product', productRoutes);
    app.use('/', homeRoutes);
   
}