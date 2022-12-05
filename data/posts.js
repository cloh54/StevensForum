const mongoCollections = require('../config/mongoCollections');
const posts = mongoCollections.posts;
const usersCollection = require('./users');
const tagsCollection = require('./tags');
/*
Properties of post collection
1. _id: ObjectId
2. userId: ObjectId
3. topic: string
4. body: string
5. comments: array of ObjectIds
6. likes: array of ObjectIds
7. dislikes: array of ObjectIds
8. tags: array of ObjectIds
9. dateCreated: Date
10. lastUpdated: Date
*/

const createPost = async (userId, topic, body, tags) => {
    // tags parameter is an array of strings
};

const editPost = async (id) => {

};

const removePost = async (id) => {

};

const getPostById = async (id) => {

};

const addCommentToPost = async (postId, commentId) => {

};

const removeCommentFromPost = async (postId, commentId) => {

};

const getLikeCount = async (id) => {

};

const getDislikeCount = async (id) => {

};

const addLike = async (postId, userId) => {

};

const addDislike = async (postId, userId) => {

};

const removeLike = async (postId, userId) => {

};

const removeDislike = async (postId, userId) => {

};

module.exports = {
    createPost,
    editPost,
    removePost,
    getPostById,
    addCommentToPost,
    removeCommentFromPost,
    getLikeCount,
    getDislikeCount,
    addLike,
    addDislike,
    removeLike,
    removeDislike
};