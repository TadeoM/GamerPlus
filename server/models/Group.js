const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let GroupModel = {};

const setName = (name) => _.escape(name).trim();

const GroupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
        set: setName,
    },
    owner: {
        type: Boolean,
        required: true,
        set: setName,
    },
    user: {
        type: String,
        require: true,
        set: setName,
    }
});

GroupSchema.statics.toAPI = (doc) => ({
    groupName: doc.groupName,
    owner: doc.owner,
    user: doc.user,
});

GroupSchema.statics.findByUser = (username, callback) => {
    const search = {
        user: username,
    };
    
    return GroupModel.find(search).select('user friend').exec(callback);
};

GroupSchema.statics.findByGroup = (groupName, callback) => {
    const search = {
        group: groupName,
    };
    
    return GroupModel.find(search).select('user').exec(callback);
};

GroupModel = mongoose.model('Friend', GroupSchema);

module.exports.GroupModel = GroupModel;
module.exports.GroupSchema = GroupSchema;