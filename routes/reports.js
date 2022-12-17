const express = require('express');
const router = express.Router();
const data = require('../data');
const reportsData = data.reports;
const postsData = data.posts;

router.get('/', async (req, res) => {
    try {
        if (!req.session.user) {
            res.redirect('/');
        } else if (!req.session.user.admin) {
            res.render('reports', {user: req.session.user});
        } else {
            let reportList = await reportsData.getAllReports();
            console.log(reportList);
            // the below is returns promise pending 
            // const reportListWithPosts = reportList.map(async object => {
            //     const post = await postsData.getPostById(object.postId.toString());
            //     return {
            //     _id: object._id,
            //     post: post,
            //     body: object.body
            //     };
            // });
            const reportListWithPosts = [];
            for (let i=0; i<reportList.length; i++) {
                let report = reportList[i];
                const post = await postsData.getPostById(report.postId.toString());
                reportListWithPosts.push({_id: report._id,
                                          post: post,
                                          body: report.body});
            }
            console.log(reportListWithPosts);
            res.render('reports', {list: reportListWithPosts, user: req.session.user});
        }
    } catch (e) {
        res.render('error', {error: e});
    }
});

router.delete('/deleteReported', async (req, res) => {
    try {
        await postsData.removePost(req.body.postId);
        await reportsData.removeReport(req.body._id);
        res.redirect('/reports/', {user: req.session.user});
    } catch (e) {
        res.render('error', {error: e});
    }
});


module.exports = router;