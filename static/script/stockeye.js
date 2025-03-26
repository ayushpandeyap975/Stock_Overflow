document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.querySelector('.chat-messages');
    
    // Function to send a message
    function sendMessage() {
      const message = messageInput.value.trim();
      if (message) {
        // In a real app, you would send this message to a server
        // For now, we'll just clear the input
        messageInput.value = '';
        
        // You could add the user's message to the chat here
        // const userMessage = document.createElement('div');
        // userMessage.className = 'message user-message';
        // userMessage.innerHTML = `...`;
        // chatMessages.appendChild(userMessage);
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