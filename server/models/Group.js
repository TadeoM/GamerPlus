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
    groupOwner: {
        type: Boolean,
        required: true,
        set: setName,
    },
    groupMember: {
        type: String,
        require: true,
        set: setName,
    }
});

GroupSchema.statics.toAPI = (doc) => ({
    groupName: doc.groupName,
    groupOwner: doc.groupOwner,
    groupMember: doc.groupMember,
});

GroupSchema.statics.findByUser = (username, callback) => {
    const search = {
        groupMember: username,
    };
    
    return GroupModel.find(search).select('groupName groupOwner groupMember').exec(callback);
};

GroupSchema.statics.findByGroup = (groupName, callback) => {
    const search = {
        group: groupName,
    };
    
    return GroupModel.find(search).select('user').exec(callback);
};

GroupModel = mongoose.model('Group', GroupSchema);

module.exports.GroupModel = GroupModel;
module.exports.GroupSchema = GroupSchema;