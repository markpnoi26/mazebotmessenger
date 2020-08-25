var AWS = require('aws-sdk');
let awsConfig = {
    'region': 'us-west-2',
    'endpoint': 'http://dynamodb.us-west-2.amazonaws.com',
    'accessKeyId': process.env.access_key_id, 
    'secretAccessKey': process.env.secret_key_id
}

AWS.config.update(awsConfig)

let dynamoDB = new AWS.DynamoDB.DocumentClient();

let getUserById = (id) => {
    var params = {
        TableName: 'user-state',
        Key: {
            user_id: id
        }
    }

    let userInfo;
    dynamoDB.get(params, (err, data) => {
        if (err) {
            console.log('from-get', {err})
        } else {
            console.log('from-get',{data})
            userInfo = JSON.parse(data)
        }
    })

    return userInfo || null
}

let createNewUserWithId = (id, maze, start, end) => {
    var params = {
        TableName: 'user-state',
        Item: {
            user_id: id,
            maze: maze,
            start: start,
            end: end,
            solved: false
        }
    }

    dynamoDB.put(params, (err, data) => {
        if (err) {
            console.log('from-put', {err})
        } else {
            console.log('from-put',{data})
        }
    })
}

module.exports = {
    getUserById,
    createNewUserWithId
}