const userData = require('./users');
const postData = require('./posts');
const commentData = require('./comments');
const tagData = require('./tags');
const reportData = require('./reports');

module.exports = {
    users: userData,
    posts: postData,
    comments: commentData,
    tags: tagData,
    reports: reportData
}