const express = require('express');
const router = express.Router();
const data = require('../data');
const { getUsername } = require('../data/users');
const postsData = data.posts;
const commentsData = data.comments;
const usersData = data.users;
const reportsData = data.reports;

router.get('/', async (req, res) => {
    try {
        let newestPosts = await postsData.getAllPostsByNewest();
        let mostCommentedPosts = await postsData.getAllPostsByMostCommented();
        let mostLikedPosts = await postsData.getAllPostsByMostLiked();
        let posts = {newest: newestPosts,
                     mostCommented: mostCommentedPosts,
                     mostLiked: mostLikedPosts};

        //console.log(posts);
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
        let commentsList = await postsData.getSortedCommentsByPost(req.params.id);
        let currentLikes = await postsData.getNetLikeCount(req.params.id);
        const error = req.query.error;
        if (req.session.user) {
            if (error) {
                res.render('singlePost', {post: post, commentsList: commentsList, user: req.session.user, currentLikes: currentLikes, error: error});
            } else {
                res.render('singlePost', {post: post, commentsList: commentsList, user: req.session.user, currentLikes: currentLikes});
            }
        } else {
            res.render('singlePost', {post: post, commentsList: commentsList, currentLikes: currentLikes});
        }
    } catch (e) {
        res.render('error', {error: e});
    }
});

router.post('/:id/edit', async (req, res) => {
    try {
        console.log('edit post');
        let editedPost = await postsData.editPost(req.params.id, req.body.topic, req.body.body, req.body.tags);
        res.redirect(`/posts/${req.params.id}`);
    } catch (e) {
        res.render('error', {error: e});
    }
});

router.post('/:id/delete', async (req, res) => {
    try {
        console.log('route delete post');
        await postsData.removePost(req.params.id);
        res.redirect('/');
    } catch (e) {
        res.render('error', {error: e});
    }
});

router.post('/:id/comment', async (req, res) => {
    try {
        let userId = req.session.user.id;
        let userName = req.session.user.username;
        console.log('post comment');
        let post = await postsData.addCommentToPost(userId, userName, req.params.id, req.body.comment);
        console.log(post);
        res.redirect(`/posts/${req.params.id}`);
    } catch (e) {
        res.redirect(`/posts/${req.params.id}?error=${e}`);
    }
});

router.post('/:id/createReport', async (req, res) => {
    try {
        await reportsData.createReport(req.params.id, req.body.report);
        res.redirect(`/posts/${req.params.id}`);
    } catch (e) {
        res.render('error', {error: e});
    }
    
});

router.post('/addLike/:id/:userId', async (req, res) => {
    try {
        await postsData.addLike(req.params.id, req.params.userId);
        let likeCount = await postsData.getNetLikeCount(req.params.id);
        res.json({likeCount: likeCount});
    } catch (e) {
        res.render('error', {error: e});
    }
});

router.post('/addDislike/:id/:userId', async (req, res) => {
    try {
        await postsData.addDislike(req.params.id, req.params.userId);
        let likeCount = await postsData.getNetLikeCount(req.params.id);
        res.json({likeCount: likeCount});
    } catch (e) {
        res.render('error', {error: e});
    }
});


module.exports = router;