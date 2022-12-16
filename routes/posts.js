const express = require('express');
const router = express.Router();
const data = require('../data');
const postsData = data.posts;

router.get('/', async (req, res) => {
    try {
        let posts = await postsData.getAllPostsByNewest();
        res.render('viewPosts', {posts: posts});
    } catch (e) {
        res.render('error', {error: e});
    }
});

router.post('/searchByTopic', async (req,res) => {
    try {
        let posts = await postsData.searchPostByTopic(req.body.search);
        res.render('viewPosts', {input: req.body.search, posts: posts, searchBy: 'topic'});
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
        let posts = await postsData.searchPostByTags(req.body.tags);
        res.render('viewPosts', {input: req.body.tags, posts: posts, searchBy: 'tags'});
    } catch (e) {
        res.render('error', {error: e});
    }
});



module.exports = router;