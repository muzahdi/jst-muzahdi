var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1866657736:AAHfcSGDdFcBQ1FMug6D75eG1Q6ZqEfmiuE'
const bot = new TelegramBot(token, {polling: true});


// bots
bot.onText(/\/start/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome...\n
        click /predict`
    );   
});

state = 0
bot.onText(/\/predict/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `masukkan nilai i|v contohnya 9|9`
    );   
    state  = 1
});

bot.on('message',(msg) => {
    if(state == 1){
        console.log(msg.text);
        s = msg.text.split("|");
        i = s[0]
        v = s[1]
        model.predict(
        [
            parseFloat(req.params.i), // string to float
            parseFloat(req.params.r)
        ]
    ).then((jres)=>{
      bot.sendMessage(
          msg.chat.id,
         `nilai v yang diprediksi adalah s{jres[0]} volt`
      );
      bot.sendMessage(
          msg.chat.id,
         `nilai p yang diprediksi adalah s{jres[0]} watt`
      );   
    })
    }else{
        state = 0
    }
})
// routers
r.get('/prediction/:i/:r', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.i), // string to float
            parseFloat(req.params.r)
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});

module.exports = r;