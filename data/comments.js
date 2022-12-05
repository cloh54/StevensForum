const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const usersCollection = require('./users');
const postsCollection = require('./posts');

/*
Properties of comment collection
1. _id: ObjectId
2. userId: ObjectId
3. postId: ObjectId
4. body: string
5. dateCreated: Date
6. lastUpdated: Date
*/

const createComment = async (userId, postId, body) => {

};

const editComment = async (id) => {

};

const removeComment = async (id) => {

};

const getCommentById = async (id) => {

};

module.exports = {
    createComment,
    editComment,
    removeComment,
    getCommentById
};