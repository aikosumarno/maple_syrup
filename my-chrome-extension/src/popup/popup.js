// initialize the conversation with a system message
let conversationHistory = [
    { role: "system", content: "Be skeptical of purchases. Respond briefly, under 50 words. Agree if the argument is convincing." },
    { role: "system", content: "What is the cost and product you would like to buy?" }
];

document.addEventListener('DOMContentLoaded', function() {
    // display the initial system question when the page loads up
    appendMessage(conversationHistory[1].content, 'system');
});

document.getElementById('submitButton').addEventListener('click', function() {
    var input = document.getElementById('inputField').value;
    if (input.trim() === '') return;  // prevent sending empty messages
    appendMessage(input, 'user');
    fetchChatbotResponse(input);
    document.getElementById('inputField').value = ''; // clear input field after sending
});


function appendMessage(message, sender) {
    const messageArea = document.getElementById('message-area');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender === 'user' ? 'user-message' : 'system-message');
    msgDiv.textContent = message;
    messageArea.appendChild(msgDiv);
    messageArea.scrollTop = messageArea.scrollHeight; // auto-scroll to the latest message (chain messages text-style)
}

function addMessageToHistory(message, role) {
    conversationHistory.push({ role: role, content: message });
    console.log("Updated Conversation History:", conversationHistory); // logs msg history
    console.log("Conversation History Length:", conversationHistory.length);
}

function displayResult(response) {
    addMessageToHistory(response, 'system');
    appendMessage(response, 'system');
}

function updateConversationHistory(role, content) {
    // add the new message at the end of the array
    conversationHistory.push({ role: role, content: content });

    // keep only the last four messages
    if (conversationHistory.length > 4) {
        conversationHistory.shift(); // removes the oldest message from the array (save token space)
    }
}


async function fetchChatbotResponse(input) {
    // append system content to user input
    let fullUserInput = input + " [Be skeptical of purchases. Respond briefly, under 50 words. Agree if the argument is convincing.]";
    addMessageToHistory(fullUserInput, 'user');

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer [INSERT API KEY]'
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: conversationHistory,
                max_tokens: 50  // adjust based on testing. Indicates max # char sent by chatbot
            })
        });
        const data = await response.json();
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            displayResult(data.choices[0].message.content);
        } else {
            displayResult('No response from the API.'); //troubleshooting
        }
    } catch (error) { // more troubleshooting.
        console.error('Error fetching response:', error);
        displayResult('Failed to fetch response: ' + error.message);
    }
}
