const API_URL = 'http://127.0.0.1:8080';
// const API_URL = 'https://europe-west1-xavi-332016.cloudfunctions.net/gpt-chatbot-api'

$(document).ready(function() {
    $('body').hide().fadeIn(2000);
    
    var conversation = [];

    $('#sendButton').on('click', function() {
        var message = $('#userMessage').val();
        $('#userMessage').val('');

        var userMessage = {
            role: 'user',
            content: message
        };
        
        conversation.push(userMessage);
        $('#chatContainer').append('<div class="chat-message user-message">' + userMessage.content + '</div>');
        console.log('Make request with: ' + JSON.stringify({conversation: conversation}));
        
        $.ajax({
            url: 'http://192.168.1.44:8080/chat',
            type: 'POST',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                conversation: conversation
            }),
            success: function (data) {
                var botResponse = {
                    role: 'bot',
                    content: data.botResponse
                };
                
                conversation.push(botResponse);
                $('#chatContainer').append('<div class="chat-message bot-message">' + botResponse.content + '</div>');
                $('#chatContainer').scrollTop($('#chatContainer')[0].scrollHeight);
            },
            error: function (error) {
                console.error('Error:', error);
            }
        });
    });
});
