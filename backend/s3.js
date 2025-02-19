const AWS = require('aws-sdk');
const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

// Configure the S3 client (you can add region and credentials if needed)
const s3 = new S3({});

// Upload a file to S3 with a unique key
function uploadFile(bucketName, file, folderPath = "") {
    // Generate a unique file name using uuid
    const uniqueFileName = `${uuidv4()}_${file.filename}`;
    const fileKey = folderPath ? `${folderPath}/${uniqueFileName}` : uniqueFileName;

    try {
        const fileStream = fs.createReadStream(file.path);
        const uploadParams = {
            Bucket: bucketName,
            Body: fileStream,
            Key: fileKey
        };
        return s3.upload(uploadParams).promise();
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}

module.exports = {
    uploadFile
};
