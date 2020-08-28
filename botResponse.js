const request = require('request');

const responsePostback = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "button",
            "text": "Maze Selection w/ random Start and End",
            "buttons": [
                {
                    "type": "postback",
                    "title": "5x5 maze",
                    "payload": "easy",
                },
                {
                    "type": "postback",
                    "title": "7x7 maze",
                    "payload": "medium",
                },
                {
                    "type": "postback",
                    "title": "9x9 maze",
                    "payload": "hard",
                }
            ]
        }
    }
}

const sendInitialGreetings = (sender_psid) => {
    const responseMsg = {
        'text': `Welcome to MazeBot - a small coding challenge maze solver. Mazebot generates a random maze based on difficulty and it is your job to solve this maze, by coding a solution into the messenger.\n\nHow Does it work?\n\nA sample maze:\n🐿️⬛⬛⬛🥜\n⬜⬜⬜⬜⬜\n⬜⬛⬛⬛⬜\n\nwalls = ⬛, path = ⬜, start = 🐿️, end =🥜\n\n The solution: "d, r, r, r, r, d" or "d, loop(r, 4), d"\n\ncode structure: u <up>, d <down>, l <left>, r <right>, loop(<u,d,l,r>, <repeat number>)\n\nIf the code has errors, the bot will notify you.\n\nIf your code hits a wall, or does not reach the target, a visual representation will be sent to you.\n\nRules:\n- A single operation is separated by a comma.\n- A direction (u,l,r,d), and loop(<dir>, <repeat>) is a single operation.\n- The code must not hit any walls in order to succeed, or go out of bounds.\n- The maze will have only one solution.`
    }


    callSendAPI(sender_psid, responseMsg)
        .then(() => {
            return callSendAPI(sender_psid, responsePostback)
        }).catch((error) => {
            console.log({error})
        })
}

// Handles messages events
const handleGenericMessage = (sender_psid, received_message, userInfo) => {
    
    callSendAPI(sender_psid, {'text': "Your response is not a valid code, or you have not selected a maze to solve yet"})
        .then(()=> {
            return callSendAPI(sender_psid, responsePostback)
        })
        .catch((error) => {
            console.log(error)
        })
}

// when the user quits
const handleQuit = (sender_psid, received_message, userInfo) => {
    callSendAPI(sender_psid, {"text": "Thank you for trying out MazeBot, come back again soon!"})
}


// Handles messaging_postbacks events
const handlePostback = (sender_psid, received_postback, userInfo) => {
    let responseMsg;
    const wallNode = "⬛"
    const openNode = "⬜"
    const start = "🐿️"
    const end = "🥜"
    const maze = userInfo.maze

    let mazeString = ""

    for (let i=1; i<maze.length-1; i++) {
        for (let j=1;j<maze[i].length-1; j++) {
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
        responseMsg = {
            "text": `${mazeString}`
            
        }
    }  else if (userInfo.solved === true) {
        responseMsg = {
            "text": "would you like to try another maze?"
        }
    } 
    
    // Sends the response message
    callSendAPI(sender_psid, { 'text': `This is your current maze. You may send "quit" at any time to end your current maze session. Alternatively, you may select a new maze.` })
        .then(() =>{
            return callSendAPI(sender_psid, responseMsg)
        })
        .then(() => {
            return callSendAPI(sender_psid, responsePostback)
        })
        .catch((error) => {
            console.log({error})
        })
    
}

// Sends response messages via the Send API
const callSendAPI = (sender_psid, response) => {
    let request_body = {
        "recipient": {
          "id": sender_psid
        },
        "message": response
      }

    return new Promise((resolve, reject) => {
        request({
            "uri": "https://graph.facebook.com/v2.6/me/messages",
            "qs": { "access_token": process.env.page_access_token },
            "method": "POST",
            "json": request_body
        }, (err, res, body) => {
            if (!err) {
                console.log('message sent!')
                resolve("success")
            } else {
                console.error("Unable to send message:" + err);
                reject(err)
            }
        }); 
    })
}


module.exports = {
    handleGenericMessage,
    handlePostback,
    sendInitialGreetings,
    handleQuit
}