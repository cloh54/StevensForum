const express = require('express');
const router = express.Router();
const path = require('path');
//const { route } = require('../../../Lab8/routes/people');
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
            const topic = req.body.topic;
            const body = req.body.body;
            const tags = req.body.tags; // this will be an array
            let post = await postData.createPost(userId, topic, body, tags);
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

    //routes for user account

    router.get('/register', async (req, res) => {
        if (req.session.user) {
            res.redirect('/');
        }
        res.render('userRegister');
    });
    
    router.post('/register', async (req, res) => {
        try {
            
            let result = await userData.createUser(req.body.usernameInput, req.body.passwordInput);
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
            let userId = await userData.checkUser(req.body.usernameInput, req.body.passwordInput);
            if (userId) {
              req.session.user = {id: userId, username: req.body.usernameInput};
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
            res.render('profile', {user: req.session.user});
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