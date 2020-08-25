var AWS = require('aws-sdk');
let awsConfig = {
    'region': 'us-west-2',
    'endpoint': 'http://dynamodb.us-west-2.amazonaws.com',
    'accessKeyId': process.env.access_key_id, 
    'secretAccessKey': process.env.secret_key_id
}

AWS.config.update(awsConfig)

let dynamoDB = new AWS.DynamoDB.DocumentClient();

let fetchOneByKey = () => {
    var params = {
        TableName: 'user-state',
        Key: {
            'user_id': "1"
        }
    }

    dynamoDB.get(params, (err, data) => {
        if (err) {
            console.log({err})
        } else {
            console.log({data})
        }
    })
}

module.exports = {
    "fetchOneByKey": fetchOneByKey
}