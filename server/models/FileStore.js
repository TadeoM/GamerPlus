// Grab mongoose and setup our empty model
const mongoose = require('mongoose');
let FileModel = {};

// Create a file schema. This matches the format of express-fileupload's
// image upload, so we can just drop the file directly into the model
const FileSchema = new mongoose.Schema({
  name: { // The file name
    type: String,
  },
  data: { // The actual image data
    type: Buffer,
  },
  size: { // The size of the image in bytes
    type: Number,
  },
  encoding: { // The type of encoding used in the image
    type: String,
  },
  tempFilePath: { // The temporary file path
    type: String,
  },
  truncated: { // If the image was cutoff at all
    type: Boolean,
  },
  mimetype: { // The type of image it is
    type: String,
  },
  md5: { // The hash for the image
    type: String,
  },
});

// Create our file model based on the schema above
FileModel = mongoose.model('FileModel', FileSchema);


module.exports.FileModel = FileModel;
module.exports.FileSchema = FileSchema;
