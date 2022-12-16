const express = require('express');
const router = express.Router();
const data = require('../data');
const reportsData = data.reports;

router.get('/', async (req, res) => {
    if (req.session.user) {
        res.redirect('/');
    }
    let reportList = await reportsData.getAllReports();
    res.render('reports', {reportList: reportList});
});

module.exports = router;