var socket = io();
var map = "☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "
map = map.split("");

socket.on('receivedMessage', function (message) {
    message = encryptDecrypt(message);
    renderMessage('received', message);
});

socket.on('previousMessages', function (messages) {
    for (message of messages) {
        message = encryptDecrypt(message);
        if (message.author == $('input[name=username]').val()) {
            renderMessage('sended', message);
        } else {
            renderMessage('received', message);
        }
    }
});

socket.on('newUser', function (message) {
    renderMessage('newUser', message);
});

$('#chat').submit(function (event) {
    event.preventDefault();
    var author = $('input[name=username]').val();
    var message = $('input[name=message]').val();

    if (author.length && message.length) {
        $('input[name=username]').prop('disabled', true);
        var messageObject = {
            author: author,
            message: message,
        };
        renderMessage('sended', messageObject);
        messageObject = encryptDecrypt(messageObject);
        socket.emit('sendMessage', messageObject);
    }
});

function renderMessage(type, message) {
    if (type == 'received') {
        $(".messages").append('<div class="receivedMessage"><strong>' + message.author + '</strong>: ' + message.message + '</div><br><br>');
    } else if (type == 'sended') {
        $(".messages").append('<div class="sendedMessage"><strong>' + message.author + '</strong>: ' + message.message + '</div><br><br>');
    } else if (type == 'newUser') {
        $(".messages").append('<div class="newUserMessage"><center>' + message + '</center></div><br><br>');
    }
}

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
