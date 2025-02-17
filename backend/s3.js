const AWS = require('aws-sdk');
const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const { url } = require('inspector');

//configuring the s3 object
//to get the access of the respective bucket
const s3= new S3({})

//upload a file to S3
function uploadFile(bucketName,file,folderPath=""){
    const fileKey = folderPath?`${folderPath}/${file.filename}`:file.filename;
    try{
        const fileStream = fs.createReadStream(file.path);
        const uploadParams = {
            Bucket:bucketName,
            Body:fileStream,
            Key:fileKey
        }
        // console.log(uploadParams)
        return s3.upload(uploadParams).promise();
    }
    catch(error){
        console.log(error)
        throw error;
    }
}

module.exports = {
    uploadFile
};