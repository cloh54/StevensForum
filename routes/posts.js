const express = require('express');
const router = express.Router();
const data = require('../data');
const postsData = data.posts;

router.get('/', async (req, res) => {
    try {
        let posts = await postsData.getAllPostsByNewest();
        if (req.session.user) {
            res.render('viewPosts', {posts: posts, newPosts: true, user: req.session.user});
        } else {
            res.render('viewPosts', {posts: posts, newPosts: true});
        } 
    } catch (e) {
        res.render('error', {error: e});
    }
});

router
    .route('/search')
    .post(async (req, res) => {
        try {
            console.log('search');
            console.log(req.body);
            if (req.body.searchOptions === 'topic') {
                try {
                    let posts = await postsData.searchPostByTopic(req.body.search);
                    if (req.session.user) {
                        res.render('viewPosts', {input: req.body.search, posts: posts, searchBy: 'topic', user: req.session.user});
                    } else {
                        res.render('viewPosts', {input: req.body.search, posts: posts, searchBy: 'topic'});
                    }
                    
                } catch (e) {
                    res.render('error', {error: e});
                }
            } else if (req.body.searchOptions === 'tags') {
                try {
                    let posts = await postsData.searchPostByTags(req.body.search);
                    if (req.session.user) {
                        res.render('viewPosts', {input: req.body.search, posts: posts, searchBy: 'tags', user: req.session.user});
                    } else {
                        res.render('viewPosts', {input: req.body.search, posts: posts, searchBy: 'tags'});
                    }
                    
                } catch (e) {
                    res.render('error', {error: e});
                }
            }
        } catch (e) {
            res.status(500);
        }
    })

router.get('/:id', async (req,res) => {
    try {
        let post = await postsData.getPostById(req.params.id);
        let commentsList = post.comments;
        if (req.session.user) {
            res.render('singlePost', {post: post, commentsList: commentsList, user: req.session.user});
        } else {
            res.render('singlePost', {post: post, commentsList: commentsList});
        }
    } catch (e) {
        res.render('error', {error: e});
    }
});



module.exports = router;