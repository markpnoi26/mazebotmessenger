const request = require('request');

// Handles messages events
const handleMessage = (sender_psid, received_message, userInfo) => {
    let response;
    const wallNode = "⬛"
    const openNode = "⬜"
    const start = "🐿️"
    const end = "🥜"
    const maze = userInfo.maze

    let mazeString = ""

    for (let i=0; i<maze.length; i++) {
        for (let j=0;j<maze[i].length; j++) {
            if (maze[i][j] === 1) {
                mazeString+=wallNode
            } else if (maze[i][j] === 0) {
                if (i === userInfo.start[0] && j === userInfo.start[1]) {
                    mazeString+=start
                } else if (i === userInfo.end[0] && j === userInfo.end[1]) {
                    mazeString+=end
                } else {
                    mazeString+=openNode
                }
            }
        }
        mazeString+="\n"
    }

    // Check if the message contains text
    if (userInfo.solved === false) {    
        // Create the payload for a basic text message
        response = {
            "text": `${mazeString}`
            
        }
    }  else if (userInfo.solved === true) {
        response = {
            "text": "would you like to try another maze?"
        }
    } 
    
    // Sends the response message
    callSendAPI(sender_psid, response)
    callSendAPI(sender_psid, {'text': "This is your current maze:"})
    callSendAPI(sender_psid, {'text': `You may respond with the coded solution, "quit", or "new maze"`})
}

// Handles messaging_postbacks events
const handlePostback = (sender_psid, received_postback) => {

}

// Sends response messages via the Send API
const callSendAPI = (sender_psid, response) => {
    let request_body = {
        "recipient": {
          "id": sender_psid
        },
        "message": response
      }

    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": process.env.page_access_token },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    }); 
}


module.exports = {
    handleMessage,
    handlePostback,
    callSendAPI
}