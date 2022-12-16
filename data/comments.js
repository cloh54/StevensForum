const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const postsCollection = require('./posts');
const validation = require('./validation');
const { ObjectId } = require('mongodb');
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
    userId = validation.checkId(userId);
    postId = validation.checkId(postId);
    body = validation.checkString(body, 'body');

    const currDate = new Date();
    const commentCollection = await comments();
    let newComment = {
        userId: ObjectId(userId),
        postId: ObjectId(postId),
        body: body,
        dateCreated: currDate,
        lastUpdated: currDate
    };
    let insertInfo = await commentCollection.insertOne(newComment);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add comment!';
    let newId = insertInfo.insertedId.toString();
    await postsCollection.addCommentToPost(postId, newId);
    return await getCommentById(newId);
};

const editComment = async (id, body) => {
    id = validation.checkId(id);
    body = validation.checkString(body, 'body');

    const currDate = new Date();
    const commentCollection = await comments();
    let editedComment = {
        body: body,
        lastUpdated: currDate
    };
    const editedInfo = commentCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: editedComment }
    );
    //if (editedInfo.modifiedCount === 0) throw 'Could not edit comment!';
    return await getCommentById(id);
};

const removeComment = async (id) => {
    id = validation.checkId(id);
    const commentCollection = await comments();
    const deletionInfo = await commentCollection.deleteOne({_id: ObjectId(id)});
    if (deletionInfo.deletedCount === 0) throw `Could not delete coment with id of ${id}`;
    return {commentId: id, deleted: true};
};

const getCommentById = async (id) => {
    id = validation.checkId(id);
    const commentCollection = await comments();
    const comment = await commentCollection.findOne({_id: ObjectId(id)});
    if (comment === null) throw `Could not find comment with id of ${id}`;
    return comment;
};

module.exports = {
    createComment,
    editComment,
    removeComment
};