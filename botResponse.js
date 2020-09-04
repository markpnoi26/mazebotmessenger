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

const responseQuickReply = {
    "quick_replies": [
        {
            "content_type": "text",
            "title": "Maze",
            "payload": "maze",
        }, {
            "content_type": "text",
            "title": "Quit",
            "payload": "quit",
        }, {
            "content_type": "text",
            "title": "Tutorial",
            "payload": "tutorial",
        }
    ]
}

const sendInitialGreetings = (sender_psid) => {
    const responseMsg = {
        'text': `Welcome to MazeBot - a small maze coding challenge bot. MazeBot generates a random maze based on the dimensions you select and it is your job to solve this maze, by coding a solution into the messenger. See "tutorial" for more information to get started. For windows that can not accomodate wide views, only select 5x11 maze. You may send 'maze' for the maze selection window, or 'quit' to end your current session.`
    }

    callSendAPI(sender_psid, responseMsg)
        .then(() => {
            return callSendAPI(sender_psid, responseQuickReply)
        }).catch((error) => {
            console.log({error})
        })
}

const sendTutorial = (sender_psid) => {
    const turnLeftRightMsg = {
        'text': `Moving Left and Right Maze Example:\n   ⬛⬛⬛⬛⬛\n   ⬜⬜🐿️⬜⬜\n   ⬛⬛⬛⬛⬛\nMoving left you type in the messenger "l", moving right you type "r"\nSo 'l,l' would look like:\n   ⬛⬛⬛⬛⬛\n   ❌🟩🐿️⬜⬜\n   ⬛⬛⬛⬛⬛\nAlternatively, "r,r" would look like:\n   ⬛⬛⬛⬛⬛\n   ⬜⬜🐿️🟩❌\n   ⬛⬛⬛⬛⬛\n`
    }
    const moveUpDownMsg = {
        'text': `Moving Up and Down Maze Example:\n   ⬛⬛⬜⬛⬛\n   ⬛⬛⬜⬛⬛\n   ⬛⬛🐿️⬛⬛\n   ⬛⬛⬜⬛⬛\n   ⬛⬛⬜⬛⬛\nMoving up you type in the messenger "u", moving down you type "d"\nSo 'u,u' would look like:\n   ⬛⬛❌⬛⬛\n   ⬛⬛🟩⬛⬛\n   ⬛⬛🐿️⬛⬛\n   ⬛⬛⬜⬛⬛\n   ⬛⬛⬜⬛⬛\nAlternatively, "d,d" would look like:\n   ⬛⬛⬜⬛⬛\n   ⬛⬛⬜⬛⬛\n   ⬛⬛🐿️⬛⬛\n   ⬛⬛🟩⬛⬛\n   ⬛⬛❌⬛⬛\n`

    }
    const loopingMsg = {
        'text': `Looping Maze Example:\n   ⬛⬛⬜⬛⬛\n   ⬛⬛⬜⬛⬛\n   ⬛⬛⬜⬛⬛\n   ⬛⬛⬜⬛⬛\n   ⬛⬛🐿️⬛⬛\nMoving with a loop you type in the messenger "loop(<number>-<direction>)"\nSo 'loop(3-u)' would look like:\n   ⬛⬛⬜⬛⬛\n   ⬛⬛❌⬛⬛\n   ⬛⬛🟩⬛⬛\n   ⬛⬛🟩⬛⬛\n   ⬛⬛🐿️⬛⬛\nAlternatively, "loop(4-u)" would look like:\n   ⬛⬛❌⬛⬛\n   ⬛⬛🟩⬛⬛\n   ⬛⬛🟩⬛⬛\n   ⬛⬛🟩⬛⬛\n   ⬛⬛🐿️⬛⬛`

    }

    callSendAPI(sender_psid, turnLeftRightMsg)
        .then(() => {
            return callSendAPI(sender_psid, moveUpDownMsg)
        })
        .then(() => {
            return callSendAPI(sender_psid, loopingMsg)
        })
        .then(()=> {
            return callSendAPI(sender_psid, { 'text': "The goal is for the squirrel🐿️ to reach the peanut🥜. If the code has syntax errors, the bot will notify you. If your code hits a wall, or does not end on the target node, a visual representation will be sent to you. It is possible to pass through the target node and end up hitting a wall or landing on an empty node. It is also possible to pass the target node, and backtrack to reach it again. This will be a valid solution.\n\nRules:\n- A single operation is separated by a comma.\n- A single direction (u,l,r,d), and single loop(<repeat>-<dir>) counts as a single operation.\n- The code must not hit any walls in order to succeed.\n- The code must not go out of bounds."})
        })
        .then(() => {
            return callSendAPI(sender_psid, responseQuickReply)
        })
        .catch((error) => {
            console.log({ error })
        })
}

// Handles messages events
const handleNotAValidSolution = (sender_psid, received_message, userInfo) => {
    
    callSendAPI(sender_psid, {'text': `Your response is not a valid code. Make sure you have comma seperated operations, and check for invalid operations in your syntax or general typos, and try again.`})
        .then(() => {
            return callSendAPI(sender_psid, { "text": received_message.text })
        })
        .then(() => {
            return callSendAPI(sender_psid, responseQuickReply)
        })
        .catch((error) => {
            console.log(error)
        })
}

const handleNoValidMaze = (sender_psid) => {
    callSendAPI(sender_psid, { 'text': `You do not have a maze to solve yet. To generate a maze, send "maze" or scroll up and select a maze from the options given.` })
        .then(() => {
            return callSendAPI(sender_psid, responseQuickReply)
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

    responseMsg = {
        "text": mazeString
    }

    // Sends the response message
    callSendAPI(sender_psid, { 'text': `This is your current maze. You may send "quit" at any time to end your current maze session. Alternatively, you may select a new maze by sending "maze" or scroll up to select a new maze.` })
        .then(() =>{
            return callSendAPI(sender_psid, responseMsg)
        })
        .then(() => {
            return callSendAPI(sender_psid, responseQuickReply)
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
        explanationMsg = "Your solution had an error!"
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
            if (solutionResponse.success !== undefined) return callSendAPI(sender_psid, {'text': `Try another another maze? You can also optimize your solution by using loops.`})
            if (solutionResponse.failure !== undefined || solutionResponse.incomplete) return callSendAPI(sender_psid, {"text": received_message.text})
        })
        .then(() => {
            return callSendAPI(sender_psid, responseQuickReply)
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
    handleNotAValidSolution,
    handleNoValidMaze,
    handleSolutionResponse,
    handlePostback,
    sendInitialGreetings,
    sendTutorial,
    handleQuit
}