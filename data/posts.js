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
8. tags: array of strings
9. dateCreated: Date
10. lastUpdated: Date
*/

const createPost = async (userId, topic, body, tags) => {
    // tags parameter is an array of strings

    const currDate = new Date();

    const postCollection = await posts();
    let newPost = {
        userId: userId,
        topic: topic,
        body: body,
        comments: [],
        likes: [],
        dislikes: [],
        tags: tags,
        dateCreated: currDate,
        lastUpdated: currDate
    };

    const insertInfo = await postCollection.insertOne(newPost);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add post';
    let newId = insertInfo.insertedId;
    for (let i=0; i<tags.length; i++) {
        await tagsCollection.getTag(tags[i]);
        await tagsCollection.addPostToTag(tags[i], newId);
    }

    await usersCollection.addPostToUser(userId, newId);

    return {insertedPost: true};
};

const editPost = async (id, topic, body, tags) => {
    const postCollection = await posts();

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