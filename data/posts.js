//const { search } = require('../../../Lab6/routes/movies');
const mongoCollections = require('../config/mongoCollections');
const posts = mongoCollections.posts;
const usersCollection = require('./users');
const commentsCollection = require('./comments');
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
    topic = validation.checkString(topic, 'topic');
    body = validation.checkString(body, 'body');
    if (!Array.isArray(tags)) throw 'Error: Tags must be an array';
    for (let i=0; i<tags.length; i++) {
        tags[i] = checkString(tags[i], 'tags');
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
    topic = validation.checkString(topic, 'topic');
    body = validation.checkString(body, 'body');
    if (!Array.isArray(tags)) throw 'Error: Tags must be an array';
    for (let i=0; i<tags.length; i++) {
        tags[i] = validation.checkString(tags[i], 'tags');
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
    //delete comments from post
    const post = await getPostById(id);
    let commentArr = post.comments;
    for (let i=0; i<commentArr.length; i++) {
        await commentsCollection.removeComment(commentArr[i]);
    }
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
    input = validation.checkString(input, 'input');
    const postCollection = await posts();
    let reg = new RegExp('.*' + input + '.*', 'i');
    let posts = await postCollection.find({topic: reg}).toArray();
    return posts;
};

const searchPostByTags = async (input) => {
    // input is a comma separated string
    input = validation.checkString(input, 'input');
    let inputArr = input.split(',');
    for (let i=0; i<inputArr.length; i++) {
        inputArr[i] = inputArr[i].trim().toLowerCase();
    }
    const postCollection = await posts();
    let postsArr = await postCollection.find({ tags: { $all: inputArr} });
    return postsArr;
};

const getAllPosts = async () => {
    const postCollection = await posts();
    const postsArr = await postCollection.find({}).toArray();
    return postsArr;
};

const getAllPostsByNewest = async () => {
    const allPosts = await getAllPosts();
    allPosts.sort(function(a,b) {
        return b.date - a.date;
    });
};

const getTrendingPosts = async () => {
    // get posts from the last week
    let currDate = new Date();
    let lastWeek = new Date(currDate.setDate(currDate.getDate()-7));
    let allPosts = await getAllPosts();
    let currPosts = [];
    for (let i=0; i<allPosts.length; i++) {
        if (allPosts[i].lastUpdated >= lastWeek) {
            currPosts.push(allPosts[i]);
        }
    }
    console.log('getTrendingPosts');
    console.log(currPosts);
    let posts_sorted = currPosts.sort(function(a, b)  {
        return b.likes.length - a.likes.length;
    });
    let trending = posts_sorted.slice(0,10);
    return trending;
}

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
    searchPostByTags,
    getAllPostsByNewest,
    getTrendingPosts
};