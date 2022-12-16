const express = require('express');
const router = express.Router();
const path = require('path');
const { route } = require('../../../Lab8/routes/people');
const { posts } = require('../data');
const data = require('../data');
const postData = data.posts;

router

    //routes for user actions on homepage
    .route('/')
    .get(async (req, res) => {
        try {
            const user = req.session.user;
            if (user === undefined || user === null) {
                res.render('homepage');
            } else {
                res.render('homepage', {user: req.session.user})
            }
        } catch (e) {
            res.status(500);
        }
    })

router
    .route('/search')
    .get(async (req, res) => {
        try {
            const searchString = req.body.searchString;
            let posts = await postData.searchPostByTopic(searchString);
            res.render('viewPosts', {posts: posts});
        } catch (e) {
            res.status(400);
        }
    })

router 
    .route('/tag')
    .get(async (req, res) => {
        try {
            const searchTag = req.body.searchTag;
            let posts = await postData.searchPostByTags(searchTag);
            res.render('viewPosts', {posts: posts});
        } catch (e) {
            res.status(400);
        }
    })

router
    .route('/createPost')
    .get(async (req, res) => {
        try {
            const user = req.session.user;
            if (user === undefined || user === null) {
                res.redirect('/users/login');
            }
            res.render('createPost');
        } catch (e) {
            res.status(500);
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



    //routes for user account

    router.get('/register', async (req, res) => {
        if (req.session.user) {
            res.redirect('/');
        }
        res.render('userRegister');
    });
    
    router.post('/register', async (req, res) => {
        try {
            let result = await createUser(req.body.usernameInput, req.body.passwordInput);
            if (result.insertedUser === true) {
              res.redirect('/');
            } else {
              res.status(500).json({error: 'Internal Server Error'});
            }
          } catch (e) {
            res.status(400).render('userRegister', {error: e});
          }
    });
    
    
    router.post('/login', async(req,res) => {
        try {
            let result = await checkUser(req.body.usernameInput, req.body.passwordInput);
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
        res.render('profile', {});
    });
    
    router.get('/logout', async(req,res) => {
        req.session.destroy();
        res.render('logout');
    });