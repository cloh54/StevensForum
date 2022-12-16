const mongoCollections = require('../config/mongoCollections');
const reports = mongoCollections.reports;
const validation = require('./validation');
const { ObjectId } = require('mongodb');

/*
Properties of reports collection
1. _id
2. postId
3. body
*/

const createReport = async (postId) => {
    postId = validation.checkId(postId);
    const reportCollection = await reports();
    let newReport = {
        postId: ObjectId(postId),
        body: body
    };
    const insertInfo = await reportCollection.insertOne(newReport);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add report';
    let newId = insertInfo.insertedId.toString();
    return await getReportById(newId);
};

const removeReport = async (id) => {
    id = validation.checkId(id);
    const reportCollection = await reports();
    const deletionInfo = await reportCollection.deleteOne({_id: ObjectId(id)});
    if (deletionInfo.deletedCount === 0) throw `Could not delete report with id of ${id}`;
    return {reportId: id, deleted: true};
};

const getReportById = async (id) => {
    id = validation.checkId(id);
    const reportCollection = await reports();
    const report = await reportCollection.findOne({_id: ObjectId(id)});
    if (report === null) throw `Could not find report with id of ${id}`;
    return report;
};

const getAllReports = async () => {
    const reportCollection = await reports();
    const allReports = await reportCollection.find({}).toArray();
    if (allReports) throw 'Could not get all reports';
    return allReports;
};

module.exports = {
    createReport,
    removeReport,
    getAllReports
};