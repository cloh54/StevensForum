const express = require('express');
const router = express.Router();
const data = require('../data');
const postsData = data.posts;

router.post('/searchByTopic', async (req,res) => {
    try {
        let posts = await postsData.searchPostByTopic(req.body.search);
        res.render('viewPosts', {word: req.body.search, posts: posts});
    } catch (e) {
        res.render('error', {error: e});
    }
});

router.get('/:id', async (req,res) => {
    try {
        let post = await postsData.getPostById(req.params.id);
        let commentsList = post.comments;
        res.render('singlePost', {post: post, commentsList: commentsList});
    } catch (e) {
        res.render('error', {error: e});
    }
});

router.post('/searchByTags', async (req, res) => {
    try {
        let posts = await postsData.searchPostByTags();
        res.render('viewPosts', {posts: posts});
    } catch (e) {
        res.render('error', {error: e});
    }
});



module.exports = router;