const express = require('express');
const router = express.Router();
const path = require('path');
const { posts } = require('../data');
const data = require('../data');
const postData = data.posts;
const userData = data.users;

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
              res.redirect('/');
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
            let userId = req.session.user.id;
            let user = await userData.getUserById(userId);
            console.log(user);
            let posts = user.posts;
            let comments = user.comments;
            //get the posts the user commented in. make sure they are unique
            res.render('profile', {user: req.session.user, posts: posts, comments: comments});
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