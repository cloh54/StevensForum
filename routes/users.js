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
        res.render('homepage', {})
    })

router
    .route('/createPost')
    .get(async (req, res) => {
        if (!req.session.user) {
            res.redirect('/login');
        } else {
            res.render('createPost');
        }
    })
    .post(async (req, res) => {
        try {
            const userId = req.session.user.id;
            const topic = req.body.topic;
            const body = req.body.body;
            const tags = req.body.tags; // this will be an array
            let post = await postData.createPost(userId, topic, body, tags);
            res.render('singlePost', {post: post});
        } catch (e) {
            res.status(400);
            res.render('createPost', {error: e});
        }
    }) 

router
    .route('/search')
    .post(async (req, res) => {
        try {
            if (req.body.searchOptions === 'topic') {
                res.redirect('/posts/searchByTopic');
            } else {
                res.redirect('/posts/searchByTags');
            }
        } catch (e) {
            res.status(500);
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
            res.redirect('/');
        }
        res.render('userLogin');
    });
    
    router.post('/login', async(req,res) => {
        try {
            let result = await userData.checkUser(req.body.usernameInput, req.body.passwordInput);
            if (result.authenticatedUser === true) {
              req.session.user = {username: req.body.usernameInput};
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
        }
        res.render('profile', {});
    });
    
    router.get('/logout', async(req,res) => {
        if (!req.session.user) {
            res.redirect('/login');
        }
        req.session.destroy();
        res.render('logout');
    });

    module.exports = router;