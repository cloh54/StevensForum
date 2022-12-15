const { search } = require('../../../Lab6/routes/movies');
const mongoCollections = require('../config/mongoCollections');
const posts = mongoCollections.posts;
const usersCollection = require('./users');
const validation = require('./validation');
const { ObjectId } = require('mongodb');
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
    // if there are no tags, it will be an empty array
    userId = validation.checkId(userId);
    if (!topic || typeof topic !== 'string') throw 'You must provide a topic!';
    if (!body || typeof body !== 'string') throw 'You must provide a body!';
    if (!Array.isArray(tags)) throw 'Error: Tags must be an array';
    for (let i=0; i<tags.length; i++) {
        if (typeof tags[i] !== 'string') throw 'Error: Every element of tags needs to be a string';
    }

    const currDate = new Date();
    const postCollection = await posts();
    let newPost = {
        userId: ObjectId(userId),
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
    let newId = insertInfo.insertedId.toString();
    
    await usersCollection.addPostToUser(userId, newId);

    return await getPostById(newId);;
};

const editPost = async (id, topic, body, tags) => {
    id = validation.checkId(id);
    if (!topic || typeof topic !== 'string') throw 'You must provide a topic!';
    if (!body || typeof body !== 'string') throw 'You must provide a body!';
    if (!Array.isArray(tags)) throw 'Error: Tags must be an array';
    for (let i=0; i<tags.length; i++) {
        if (typeof tags[i] !== 'string') throw 'Error: Every element of tags needs to be a string';
    }

    const postCollection = await posts();
    const currDate = new Date();
    const editedPost = {
        topic: topic,
        body: body,
        tags: tags,
        lastUpdated: currDate
    };

    const editedInfo = await postCollection.updateOne(
        {_id: ObjectId(id)},
        {$set: editedPost}
    );
    //if (editedInfo.modifiedCount === 0) throw 'Could not edit post successfully!';
    return await getPostById(id);
};

const removePost = async (id) => {
    id = validation.checkId(id);
    const postCollection = await posts();
    const deletionInfo = await postCollection.deleteOne({_id: ObjectId(id)});

    if (deletionInfo.deletedCount === 0) throw `Could not delete post with id of ${id}`;
    return {postId: id, deleted: true};
};

const getPostById = async (id) => {
    id = validation.checkId(id);
    const postCollection = await posts();
    const post = await postCollection.findOne({_id: ObjectId(id)});
    if (post === null) throw `Could not find post with id of ${id}`;
    return post;
};

const addCommentToPost = async (postId, commentId) => {
    postId = validation.checkId(postId);
    commentId = validation.checkId(commentId);
    const postCollection = await posts();
    const updatedInfo = await postCollection.updateOne(
        { _id: ObjectId(postId) },
        { $addToSet: {comments: ObjectId(commentId)} }
    );
    if (!updatedInfo.modifiedCount === 0) throw 'Could not add comment to post!';
    return await getPostById(postId);
};

const removeCommentFromPost = async (postId, commentId) => {
    postId = validation.checkId(postId);
    commentId = validation.checkId(commentId);
    const postCollection = await posts();
    const updatedInfo = await postCollection.updateOne(
        {_id: ObjectId(postId)},
        {$pull: {comments: ObjectId(commentId)}}
    );
    if (!updatedInfo.modifiedCount === 0) throw 'Could not remove comment from post!';
    return await getPostById(postId);
};

const getLikeCount = async (id) => {
    id = validation.checkId(id);
    const post = await getPostById(id);
    let likes = post.likes;
    return likes.length;
};

const getDislikeCount = async (id) => {
    id = validation.checkId(id);
    const post = await getPostById(id);
    let dislikes = post.dislikes;
    return dislikes.length;
};

const addLike = async (postId, userId) => {
    postId = validation.checkId(postId);
    userId = validation.checkId(userId);
    const postCollection = await posts();
    const updatedInfo = await postCollection.updateOne(
        { _id: ObjectId(postId) },
        { $addToSet: {likes: ObjectId(userId)} }
    );
    if (!updatedInfo.modifiedCount === 0) throw 'Could not add like to post';
    return await getPostById(postId);
};

const removeLike = async (postId, userId) => {
    postId = validation.checkId(postId);
    userId = validation.checkId(userId);
    const postCollection = await posts();
    const updatedInfo = await postCollection.updateOne(
        { _id: ObjectId(postId) },
        { $pull: {likes: ObjectId(userId)} }
    );
    if (!updatedInfo.modifiedCount === 0) throw 'Could not remove like from post';
    return await getPostById(postId);
};

const addDislike = async (postId, userId) => {
    postId = validation.checkId(postId);
    userId = validation.checkId(userId);
    const postCollection = await posts();
    const updatedInfo = await postCollection.updateOne(
        { _id: ObjectId(postId) },
        { $addToSet: {dislikes: ObjectId(userId)} }
    );
    if (!updatedInfo.modifiedCount === 0) throw 'Could not add dislike to post';
    return await getPostById(postId);
};

const removeDislike = async (postId, userId) => {
    postId = validation.checkId(postId);
    userId = validation.checkId(userId);
    const postCollection = await posts();
    const updatedInfo = await postCollection.updateOne(
        { _id: ObjectId(postId) },
        { $pull: {dislikes: ObjectId(userId)} }
    );
    if (!updatedInfo.modifiedCount === 0) throw 'Could not remove dislike from post';
    return await getPostById(postId);
};

const searchPostByTopic = async (input) => {
    if (!input || typeof input !== 'string') throw 'You must provide an input!';
    input = input.trim();
    const postCollection = await posts();
    let reg = new RegExp('.*' + input + '.*', 'i');
    let posts = await postCollection.find({topic: reg}).toArray();
    return posts;
};

const searchPostByTags = async (input) => {
    if (!input || typeof input !== 'string') throw 'You must provide an input!';
    input = input.trim();
    const postCollection = await posts();
    let posts = await postCollection.find({ tags: {$elemMatch: { $eq: input } } });
    return posts;
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
    removeDislike,
    searchPostByTopic,
    searchPostByTags
};