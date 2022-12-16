const express = require('express');
const router = express.Router();
const data = require('../data');
const reportsData = data.reports;
const postsData = data.posts;

router.get('/', async (req, res) => {
    if (req.session.user) {
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
    res.render('reports', {list: reportListWithPosts});
});

router.post('/createReport', async (req, res) => {
    await reportsData.createReport(req.body.postId);
    res.redirect(`/posts/${postId}`);
});

router.delete('/deleteReported', async (req, res) => {
    await postsData.removePost(req.body.postId);
    await reportsData.removeReport(req.body._id);
    res.redirect('/reports/');
});


module.exports = router;