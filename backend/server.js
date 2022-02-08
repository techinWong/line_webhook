const line = require('@line/bot-sdk')
const express = require('express')
const axios = require('axios').default
const dotenv = require('dotenv')

const env = dotenv.config().parsed
const app = express()

app.use(express.json())

app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept')
    next();
})

const lineConfig={
    channelAccessToken: env.ACCESS_TOKEN,
    channelSecret: env.SECRET_TOKEN
}

//create client
const client = new line.Client(lineConfig);



app.post('/push',(req,res) => {
    var data = JSON.stringify({
        "to": "U7394139b7d764577b18cc284da71673a",
        "messages": [
          {
            "type": "text",
            "text": req.body.text
          }
        ]
      });
      
      var config = {
        method: 'post',
        url: 'https://api.line.me/v2/bot/message/push',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer W9rqdXjXcCf8qcqG2wssyGeftXrXcBP9O1kE83qF/c5JBJvdRM0z7l3oi03uqXapHq/gyCmGhu0EJhhWuuGr+7MT1trzF9zj5onNmIpQ9fU2tZgsNn1DjQMMStoFVVuk8iw8l/6WArPpN4CRRFYJ2gdB04t89/1O/w1cDnyilFU='
        },
        data : data
      };
      
      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
   
})

app.post('/webhook', line.middleware(lineConfig),async (req,res) => {
    try{
        const events = req.body.events
        console.log('event = ',events)
        return events.length > 0 ? await events.map(item => handleEvent(item)) : res.status(200).send("OK")
    }catch(error){
        res.status(500).end()
    }
});

const handleEvent = async (event) => {
    console.log(event)
    return client.replyMessage(event.replyToken,{type:'text',text:'Test'})
}

app.listen(3300, () => {
    console.log('listening on 3300')
})