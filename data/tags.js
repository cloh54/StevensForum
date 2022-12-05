const mongoCollections = require('../config/mongoCollections');
const tags = mongoCollections.tags;

/*
Properties of tags collection
1. _id: ObjectId
2. tag: string
3. posts: array of ObjectIds
*/

const createTag = async (tag) => {
    // tag is string

}; 

const addTagToPost = async (tagId, postId) => {

};

const removeTagFromPost = async (tagId, postId) => {

};

module.exports = {
    createTag,
    addTagToPost,
    removeTagFromPost
};
