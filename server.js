const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 3000;

var map = "☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "
map = map.split("");

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

function encryptDecrypt(message){
    var authors = message.author.split("");
    var messages = message.message.split("");
    var newAuthor = "";
    var newMessage = "";
    for(author of authors){
        for(var pos=0; pos<map.length; pos++){
            if(author == map[pos]){
                if(pos == 0){
                    newAuthor = newAuthor + map[(map.length-1)];
                }else{
                    newAuthor = newAuthor + map[(map.length-1)-pos]
                }
            }
        }
    }
    
    for(textMessage of messages){
        for(var pos=0; pos<map.length; pos++){
            if(textMessage == map[pos]){
                if(pos == 0){
                    newMessage = newMessage + map[(map.length-1)];
                }else{
                    newMessage = newMessage + map[(map.length-1)-pos]
                }
            }
        }
    }
    message.message = newMessage;
    message.author = newAuthor;
    console.log(message);
    return message;
}

let messages = [];
let newUserMessage = "Um novo usuário entrou na sala!";
let refreshPage = "ERRO: Por favor, atualize a página!";
io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    //Utilizando cifra de atbash

    socket.emit('previousMessages', messages);
    socket.broadcast.emit('newUser', newUserMessage);
    socket.on('sendMessage', data => {
        data = encryptDecrypt(data);
        if(data.author == 'Aleixxor' && data.message == '%eraser%'){
            messages = [];
            socket.broadcast.emit('newUser', refreshPage);
        }else{
            messages.push(data);
            console.log(data);
            socket.broadcast.emit('receivedMessage', encryptDecrypt(data));
        }
    });
    
    socket.on('disconnect', function () {
        io.emit('Um usuário saiu da sala!');
  });
});

console.log("CONEXÃO ABERTA EM: http://localhost:"+PORT+"/");

server.listen(PORT);
