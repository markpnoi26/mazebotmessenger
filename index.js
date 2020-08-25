'use strict'; 
const PAGE_ACCESS_TOKEN = process.env.page_access_token;

const 
    { getUserById, createNewUserWithId} = require('./stateDB.js'),
    { handleMessage, handlePostback, callSendAPI } = require('./botResponse.js'),
    { generateMaze } = require('./mazeAlgorithms.js'),
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express().use(bodyParser.json())

app.listen(process.env.PORT || 3000, () => console.log(`webhook is listening on port:${process.env.PORT || "3000"}`))

app.post('/webhook', (req, res) => {
    let body = req.body
    if (body.object === 'page') {
        let userID, userMessage, userPostback;
        body.entry.forEach((entry) => {
            let webhook_event = entry.messaging[0]
            console.log(webhook_event)
            userID = webhook_event.sender.id
            userMessage = webhook_event.message
            userPostback = webhook_event.postback

        })
        console.log(userID)
        const userInfo = getUserById(userID)
        console.log(userInfo)
        // if user exists, check the user
        if (userInfo) {
            console.log("user info:", userInfo)
            // 3 possible responses => if userInfo.solved? ask to quit or solve another
            
            // response 1 (maze is not solved)
            //     check if userMessage.text !== "quit", "new maze"
            //     check the potential solution
            //         if solution is right ask "quit" or "new maze"
            //         if solution is invalid send an error report (ie, format of code is wrong) (you may send a message "quit" or "new maze"), 
            //         if solution is valid but incomplete send unsolved maze with current solution (you may send a message "quit" or "new maze")
            //     check else if userMessage.text === "quit"
            //         clear userData on DB, and set solved to true
            //         send see you again soon!
            //     check else if userMessage.text === "new Maze"
            //         present selection "easy", "medium", or "hard"
            
            // response 2 (maze is solved && userMessage.text !== "tutorial")
            //     present selection "easy", "medium", or "hard"

            // response 3 (maze is solved && userMessage.text === "tutorial")
            //     present tutorial
            //     present selection "easy", "medium", or "hard" 

        } else {
            // create new user, and store a new maze based on postback
            // {userId: id, maze: [], solved: true}
            // send the maze to user via emoji, set solved to false
            const [maze, startAndEnd] = generateMaze(5,5)
            createNewUserWithId(userID, maze, startAndEnd[0], startAndEnd[1])
        }

        res.status(200).send('EVENT_RECEIVED')
    } else {
        res.sendStatus(404)
    }
})

app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.verification_token

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});
