const { ObjectId } = require('mongodb');

module.exports = {
    checkId(id) {
        if (!id) throw 'You must provide an id!';
        if (typeof id !== 'string') throw 'id must be string';
        id = id.trim()
        if (id.length === 0) throw 'id cannot be an empty string or just spaces!';
        if (!ObjectId.isValid(id)) throw 'Error: invalid object Id';
        return id;
    }
};