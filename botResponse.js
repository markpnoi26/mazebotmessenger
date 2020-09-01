const request = require('request');

const responsePostback = {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "button",
            "text": "Maze Selection:",
            "buttons": [
                {
                    "type": "postback",
                    "title": "5x11 maze",
                    "payload": "easy",
                },
                {
                    "type": "postback",
                    "title": "7x11 maze",
                    "payload": "medium",
                },
                {
                    "type": "postback",
                    "title": "9x11 maze",
                    "payload": "hard",
                }
            ]
        }
    }
}

const sendInitialGreetings = (sender_psid) => {
    const responseMsg = {
        'text': `Welcome to MazeBot - a small coding challenge maze solver. Mazebot generates a random maze based on the size you select and it is your job to solve this maze, by coding a solution into the messenger.\n\nHow Does it work?\n\nA sample maze:\n🐿️⬛⬛⬛🥜\n⬜⬜⬜⬜⬜\n⬜⬛⬛⬛⬜\n\nwalls = ⬛, path = ⬜, start = 🐿️, end =🥜\n\n The solution: "d, r, r, r, r, u" or "d, loop(4-r), u"\n\ncode structure: u <up>, d <down>, l <left>, r <right>, loop(<repeat number>-<u,d,l,r>)\n\nIf the code has errors, the bot will notify you.\n\nIf your code hits a wall, or does not reach the target, a visual representation will be sent to you.\n\nRules:\n- A single operation is separated by a comma.\n- A direction (u,l,r,d), and loop(<repeat>-<dir>) is a single operation.\n- The code must not hit any walls in order to succeed, or go out of bounds.\n- The maze will have only one solution.`
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
    
    callSendAPI(sender_psid, {'text': `Either your response is not a valid code, or you have not selected a maze to solve yet. To select a maze, send "maze" or scroll up and select a maze from the options given. If you have a maze already, make sure you have comma seperated operations, and check for invalid operations in your syntax.`})
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
    callSendAPI(sender_psid, { 'text': `This is your current maze. You may send "quit" at any time to end your current maze session. Alternatively, you may select a new maze by sending "maze" or scroll up to select a new maze.` })
        .then(() =>{
            return callSendAPI(sender_psid, responseMsg)
        })
        .catch((error) => {
            console.log({error})
        })
    
}

handleSolutionResponse = (sender_psid, received_message, userInfo, solutionResponse) => {

    let responseMsg, explanationMsg, pathTaken;
    const wallNode = "⬛"
    const openNode = "⬜"
    const path = "🟩"
    const pathEnd = "❌"
    const start = "🐿️"
    const end = "🥜"
    const maze = userInfo.maze

    if (solutionResponse.success !== undefined) {
        explanationMsg = "Your solution was correct!"
        pathTaken = solutionResponse.success
    } else if (solutionResponse.failure !== undefined) {
        explanationMsg = "Your solution hit a wall or went out of bounds."
        pathTaken = solutionResponse.failure
    } else if (solutionResponse.incomplete !== undefined) {
        explanationMsg = "Your solution did not reach the end node."
        pathTaken = solutionResponse.incomplete
    } else {
        explanationMsg = "Your solution hit a wall or went out of bounds."
        pathTaken = solutionResponse.failure
    }

    let mazeString = ""
    let lastValidPosition = pathTaken[pathTaken.length-1]
    const paths = new Set(pathTaken.map(element => JSON.stringify(element)))

    for (let i=1; i<maze.length-1; i++) {
        for (let j=1;j<maze[i].length-1; j++) {
            if (maze[i][j] === 1) {
                mazeString+=wallNode
            } else if (maze[i][j] === 0) {
                if (i === userInfo.start[0] && j === userInfo.start[1]) {
                    mazeString+=start
                } else if (i === userInfo.end[0] && j === userInfo.end[1]) {
                    mazeString+=end
                } else if (paths.has(JSON.stringify([i,j])) && i === lastValidPosition[0] && j === lastValidPosition[1]) {
                    mazeString+=pathEnd
                } else if (paths.has(JSON.stringify([i,j]))) {
                    mazeString+=path
                } else {
                    mazeString+=openNode
                }
            }
        }
        mazeString+="\n"
    }

    responseMsg = {
        "text": `${mazeString}`
        
    }

    callSendAPI(sender_psid, responseMsg)
        .then(() => {
            return callSendAPI(sender_psid, {"text":explanationMsg})
        })
        .then(() => {
            if (solutionResponse.success !== undefined) return callSendAPI(sender_psid, {'text': `Try another another maze? Otherwise, you can optimize your solution by using loops. You may also "quit" at any time.`})
            if (solutionResponse.failure !== undefined || solutionResponse.incomplete) return callSendAPI(sender_psid, {"text": received_message.text})
        })
        .then(() => {
            responseQuickReply  = {
                "text": "Pick a color:",
                "quick_replies": [
                    {
                        "content_type":"text",
                        "title":"maze",
                        "payload":"maze",
                    },{
                        "content_type":"text",
                        "title":"quit",
                        "payload":"quit",
                    }
                ]
            }
            if (solutionResponse.success !== undefined) return callSendAPI(sender_psid, responseQuickReply)
        })
        .catch((error) => console.log({error}))

}

handleMazeSelection = (sender_psid, received_postback, userInfo) => {
    callSendAPI(sender_psid, responsePostback).catch(error => console.log(error))
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
    handleMazeSelection,
    handleGenericMessage,
    handleSolutionResponse,
    handlePostback,
    sendInitialGreetings,
    handleQuit
}