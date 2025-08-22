document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    const langSelect = document.getElementById('langSelect') ;
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.querySelector('.chat-messages');
    
        // Function to send a message
    function sendMessage() {
      const message = messageInput.value.trim();
      const lang = langSelect.value;   // 👈 get selected language

      if (message) {
        messageInput.value = '';

        fetch('/chat_bot/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `message=${encodeURIComponent(message)}&lang=${encodeURIComponent(lang)}`
        })
        .then(response => response.json())
        .then(data => {
          // Show bot response
          const botMessage = document.createElement('div');
          botMessage.className = 'message bot-message';
          botMessage.textContent = data.response;
          chatMessages.appendChild(botMessage);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
    }

    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  });