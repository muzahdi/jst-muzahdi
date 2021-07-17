var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js'); // predict
const cls_model = require('./sdk/cls_model.js'); //cls

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1939950108:AAFMZDkla-GBDA6fOS02ZjN4TdRpvd_UoJw'
const bot = new TelegramBot(token, {polling: true});

state = 0;
// Main Menu Bot
bot.onText(/\/start/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome...\n
        click /predict`
    );  
    state = 0;
});

//input requires i and r
bot.onText(/\/predict/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `masukkan nilai x1|x2|x3`
    );   
    state  = 1;
});

bot.on('message',(msg) => {
    if(state == 1){
        s = msg.text.split("|"|");
    
        model.predict(
            [
                 parseFloat(s[0]), // string to float
                 parseFloat(s[1]),
                 parseFloat(s[2])
            ]
       ).then((jres1)=>{
           console.log(jres1);
            
            cls_model.classify([parseFloat(s[0]), parseFloat(s[1]), parseFloat(s[2]), parseFloat(jres1[0]), parseFloat(jres1[1]), parseFloat(jres1[2])]).then((jres3)=>{
               bot.sendMessage(
                   msg.chat.id,
                   `nilai y1 yang diprediksi adalah ${jres1[0]}`
               );
               bot.sendMessage(
                   msg.chat.id,
                   `nilai y2 yang diprediksi adalah ${jres1[1]}`
               );
               bot.sendMessage(
                   msg.chat.id,
                   `nilai y3 yang diprediksi adalah ${jres1[2]}`
               );
               bot.sendMessage(
                   msg.chat.id,
                   `Klasifikasi ${jres3}`
               );
            })
        })
    }else{
        bot.sendMessage(
        msg.chat.id,
            `Please Click /start`
        );
        state = 0;
    }
})

//routers
r.get('/predict/:x1/:x2/:x3', function(req, res, next) {
     model.predict(
        [
            parseFloat(req.params.x1), // string to float
            parseFloat(req.params.x2),
            parseFloat(req.params.x3)
        ]
     ).then((jres)=>{
         res.json(jres);
     })
});

// routers
r.get('/classify/:x1/:x2/:x3', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.x1), // string to float
            parseFloat(req.params.x2),
            parseFloat(req.params.x3)
        ]
    ).then((jres)=>{
        cls_model.classify(
            [
                parseFloat(req.params.x1), // string to float
                parseFloat(req.params.x2),
                parseFloat(req.params.x3),
                parseFloat(jres[0]),
                parseFloat(jres[1]),
                parseFloat(jres[2])
            ]
     ).then((jres_)=>{
            res.json({jres, jres_})
        })
    })
});

module.exports = r;
