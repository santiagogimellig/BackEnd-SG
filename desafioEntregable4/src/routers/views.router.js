import express from 'express';

const router = express.Router();

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {
        productos: getProductList()
    });
});

export default router;