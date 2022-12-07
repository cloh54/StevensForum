const mongoCollections = require('../config/mongoCollections');
const tags = mongoCollections.tags;

/*
Properties of tags collection
1. _id: ObjectId
2. tag: string
3. posts: array of ObjectIds
*/

const getTag = async (tag) => {
    // check if tag exists in tagCollection
    // if exists, return id
    // else create tag and return its id
    const tagCollection = await tags();
    const sameTags = await tagCollection.find({ tag: tag }).toArray();
    if (sameTags.length === 0) { // tag doesn't exist
        return await createTag(tag);
    } 
    return {tagExisted: true};
}

const createTag = async (tag) => {
    // tag is string, should be unique
    const tagCollection = await tags();
    let newTag = {
        tag: tag,
        posts: []
    };
    const insertInfo = await tagCollection.insertOne(newTag);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add tag!';
    return {insertedTag: true};
}; 

const addPostToTag = async (tag, postId) => {
    const tagCollection = await tags();
    const updateInfo = await tagCollection.updateOne(
        { tag: tag },
        { $addToSet: {posts: postId }}
    );
    if (!updateInfo.modifiedCount === 0) throw 'Could not add tag to post!';
    return {addedPostToTag: true};
};

const removePostFromTag = async (tag, postId) => {
    const tagCollection = await tags();
    const updateInfo = await tagCollection.updateOne(
        { tag: tag },
        { $pull: { posts: postId }}
    );
    if (!updateInfo.modifiedCount === 0) throw 'Could not remove tag from post!';
    return {removedPostFromTag: true};
};

module.exports = {
    getTag,
    addPostToTag,
    removePostFromTag
};
