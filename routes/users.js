const express = require('express');
const router = express.Router();
const path = require('path');
const { posts } = require('../data');
const data = require('../data');
const postData = data.posts;
const userData = data.users;
const commentData = data.comments;

router
    //routes for homepage
    .route('/')
    .get(async (req, res) => {
        const trendingPosts = await postData.getTrendingPosts();
        if (req.session.user) {
            res.render('homepage', {user: req.session.user, posts: trendingPosts});
        } else {
            res.render('homepage', {posts: trendingPosts});
        }
    })

router
    .route('/createPost')
    .get(async (req, res) => {
        if (!req.session.user) {
            res.redirect('/login');
        } else {
            res.render('createPost', {user: req.session.user});
        }
    })
    .post(async (req, res) => {
        try {
            const userId = req.session.user.id;
            const userName = req.session.user.username;
            const topic = req.body.topic;
            const body = req.body.body;
            const tags = req.body.tags; 
            let post = await postData.createPost(userId, userName, topic, body, tags);
            if (req.session.user) {
                res.render('singlePost', {post: post, user: req.session.user});
            } else {
                res.render('singlePost', {post: post});
            }
        } catch (e) {
            res.status(400);
            console.log(e);
            res.render('createPost', {error: e, user: req.session.user});
        }
    }) 

router.get('/about', async (req, res) => {
    try {
        if (!req.session.user) {
            res.render('about');
        } else {
            res.render('about', {user: req.session.user})
        }
    } catch (e) {
        res.status(500);
        res.render('error', {error: e});
    }
})

    //routes for user account

    router.get('/register', async (req, res) => {
        if (req.session.user) {
            res.redirect('/');
        }
        res.render('userRegister');
    });
    
    router.post('/register', async (req, res) => {
        try {
            let adminStatus = false;
            if (req.body.role === 'admin') {
                adminStatus = true;
            }
            let result = await userData.createUser(req.body.usernameInput, req.body.passwordInput, adminStatus);
            if (result) {
              res.redirect('/login');
            } else {
              res.status(500).json({error: 'Internal Server Error'});
            }
        } catch (e) {
            res.status(400).render('userRegister', {error: e});
        }
        });
    

    router.get('/login', async (req, res) => {
        if (req.session.user) {
            res.redirect('/', {user: req.session.user});
        } else {
            res.render('userLogin');
        }
    });
    
    router.post('/login', async(req,res) => {
        try {
            let user = await userData.checkUser(req.body.usernameInput, req.body.passwordInput);
            console.log(user);
            if (user) {
                req.session.user = {id: user._id.toString(), username: req.body.usernameInput, admin: user.admin};
                console.log(req.session.user);
                res.redirect('/');
            } else {
                res.status(500).json({error: 'Internal Server Error'});
            }
          } catch (e) {
                res.status(400).render('userLogin', {error: e});
          }
    });
    
    
    router.get('/profile', async(req,res) => {
        if (!req.session.user) {
            res.redirect('/login');
        } else {
            try {
                let userId = req.session.user.id;
                let user = await userData.getUserById(userId);
                console.log(user);
                let postIdList = user.posts;
                let postsMade = [];
                for (let i=0; i<postIdList.length; i++) {
                    let p = await postData.getPostById(postIdList[i].toString());
                    postsMade.push(p);
                }
    
                let commentIdList = user.comments;
                console.log('commentIdList');
                console.log(commentIdList);
                let unique = new Set();
                //get the posts the user commented in. make sure they are unique
                for (let i=0; i<commentIdList.length; i++) {
                    let commentId = commentIdList[i].toString();
                    let comment = await commentData.getCommentById(commentId);
                    let pId = comment.postId.toString();
                    unique.add(pId);
                }
                let postIdCommentedIn = Array.from(unique);
                let postsCommentedIn = [];
                for (let i=0; i<postIdCommentedIn.length; i++) {
                    let p = await postData.getPostById(postIdCommentedIn[i]);
                    postsCommentedIn.push(p);
                }

                const reputation = await postData.getUserNetLikeCount(userId);
                
                res.render('profile', {user: req.session.user, postsMade: postsMade, postsCommentedIn: postsCommentedIn, reputation: reputation});
            } catch (e) {
                res.status(400).render('error', {error: e});
            }
        }
    });
    
    router.get('/logout', async(req,res) => {
        if (!req.session.user) {
            res.redirect('/login');
        }
        req.session.destroy();
        res.render('logout');
    });

    module.exports = router;