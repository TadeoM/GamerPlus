const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let FriendModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const FriendSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    
    friend: {
        type: String,
        require: true,
    }
});

FriendSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    friend: doc.friend,
});

FriendSchema.statics.findByUser = (username, callback) => {
    const search = {
        user: username,
    };
    
    return FriendModel.find(search).select('user friend').exec(callback);
};

FriendModel = mongoose.model('Friend', FriendSchema);

module.exports.FriendModel = FriendModel;
module.exports.FriendSchema = FriendSchema;