const mongoCollections = require('../config/mongoCollections');
const users = mognoCollections.users;
const bcrypt = require('bcrypt');
const saltRounds = 16;

/*
Properties to the user collection
1. _id: ObjectId
2. username: string
3. password: hash
4. admin: boolean
5. posts: array of ObjectIds
6. comments: array of ObjectIds
*/

const createUser = async (username, password, admin) => {
    // username and password are strings
    // admin is boolean
    const userCollection = await users();
    const sameUsernames = await userCollection.find({ username: username }).toArray();
    if (sameUsernames.length !== 0) throw 'There is already a user with that username!';

    const hash = await bcrypt.hash(password, saltRounds);

    let newUser = {
        username: username,
        password: hash,
        admin: admin,
        posts: [],
        comments: []
    };
    
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add user';
    let newId = insertInfo.insertedId;
    return await getUserById(newId);
};

const checkUser = async (username, password) => {
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (user === null) throw 'Either the username or password is invalid';
    let comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) throw 'Either the username or password is invalid';
    return {authenticatedUser: true};
};

const getUserById = async (id) => {
    const userCollection = await users();
    const user = await userCollection.findOne({_id: id});
    if (user === null) throw 'There is no user with that id!';
    return user;
};

const addPostToUser = async (userId, postId) => {
    const userCollection = await users();
    const updatedInfo = await userCollection.updateOne(
        {_id: userId},
        {$addToSet: { posts: postId }}
    );
    if (!updatedInfo.modifiedCount === 0) throw 'Could not add post to user!';
    return await getUserById(userId);
};

const removePostFromUser = async (userId, postId) => {
    const userCollection = await users();
    const updatedInfo = await userCollection.updateOne(
        { _id: userId },
        { $pull: {posts: postId}}
    );
    if (!updatedInfo.modifiedCount === 0) throw 'Could not remove post from user!';
    return await getUserById(userId);
};

const addCommentToUser = async (userId, commentId) => {
    const userCollection = await users();
    const updatedInfo = await userCollection.updateOne(
        {_id: userId},
        {$addToSet: { comments: commentId }}
    );
    if (!updatedInfo.modifiedCount === 0) throw 'Could not add comment to user!';
    return await getUserById(userId);
};

const removeCommentFromUser = async (userId, commentId) => {
    const userCollection = await users();
    const updatedInfo = await userCollection.updateOne(
        { _id: userId },
        { $pull: {comments: commentId}}
    );
    if (!updatedInfo.modifiedCount === 0) throw 'Could not remove comment from user!';
    return await getUserById(userId);
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