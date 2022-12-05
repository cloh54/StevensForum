const mongoCollections = require('../config/mongoCollections');
const reports = mongoCollections.reports;

/*
Properties of reports collection
1. _id
2. postId
3. body
*/

const createReport = async (postId) => {

};

const editReport = async (id) => {

};

const removeReport = async (id) => {

};

const getReportById = async (id) => {

};

const getAllReports = async () => {

};

module.exports = {
    createReport,
    editReport,
    removeReport,
    getReportById,
    getAllReports
};