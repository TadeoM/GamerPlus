const  mongoose  = require("mongoose");
mongoose.Promise = global.Promise;
let ChatModel = {};

const  ChatSchema  =  new mongoose.Schema(
    {
    message: {
    type: String
    },
    sender: {
    type: String
        }
    },
        {
    timestamps: true
});

ChatModel  =  mongoose.model("Chat", ChatSchema);
module.exports  =  ChatModel;
