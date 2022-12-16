const express = require('express');
const router = express.Router();
const data = require('../data');
const reportsData = data.reports;
const postsData = data.posts;

router.get('/', async (req, res) => {
    try {
        if (!req.session.user) {
            res.redirect('/');
        }
        let reportList = await reportsData.getAllReports();
        const reportListWithPosts = reportList.map(async object => {
            const post = await getPostById(object.postid);
            return {
            _id: object._id,
            post: post,
            body: object.body
            };
        });
        res.render('reports', {list: reportListWithPosts, user: req.session.user});
    } catch (e) {
        res.render('error', {error: e});
    }
});

router.post('/createReport', async (req, res) => {
    try {
        await reportsData.createReport(req.body.postId);
        res.redirect(`/posts/${postId}`, {user: req.session.user});
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