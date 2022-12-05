const mongoCollections = require('../config/mongoCollections');
const users = mognoCollections.users;
const bcrypt = require('bcrypt');
const saltRounds = 16;

/*
Properties to the user collection
1. _id: ObjectId
2. username: string
3. password: string
4. admin: boolean
5. posts: array of ObjectIds
6. comments: array of ObjectIds
*/

const createUser = async (username, password, admin) => {
    // username and password are strings
    // admin is boolean
};

const checkUser = async (username, password) => {

};

const getUserById = async (id) => {

};

const addPostToUser = async (userId, postId) => {

};

const removePostFromUser = async (userId, postId) => {

};

const addCommentToUser = async (userId, commentId) => {

};

const removeCommentFromUser = async (userId, commentId) => {

};

module.exports = {
    createUser,
    checkUser,
    getUserById,
    addPostToUser,
    removePostFromUser,
    addCommentToUser,
    removeCommentFromUser
};