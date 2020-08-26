'use strict'; 
const PAGE_ACCESS_TOKEN = process.env.page_access_token;

const 
    { getUserById, createNewUserWithId} = require('./stateDB.js'),
    { handleMessage, handlePostback } = require('./botResponse.js'),
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

        getUserById(userID)
            .then(response => {
                let userInfo = response.Item
                // if user exists check the postback or message
                if (userInfo) {
                    if (userMessage) return handleMessage(userID, userMessage, userInfo)
                    if (userPostback) return handlePostback(userID, userPostback, userInfo)
                } else {
                    const [maze, startAndEnd] = generateMaze(11,9)
                    createNewUserWithId(userID, maze, startAndEnd[0], startAndEnd[1])
                    userInfo = {
                        maze,
                        user_id: userID, 
                        start: startAndEnd[0], 
                        end: startAndEnd[1],  
                        solved: false
                    }
                    if (userMessage) return handleMessage(userID, userMessage, userInfo)
                    if (userPostback) return handlePostback(userID, userPostback, userInfo)
                }
            })
            .catch(error => {
                console.log(error)
            })

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
