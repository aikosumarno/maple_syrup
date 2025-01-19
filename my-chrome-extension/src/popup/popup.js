document.getElementById('submitButton').addEventListener('click', function() {
    var input = document.getElementById('inputField').value;
    if (input.trim() === '') return;  // prevent sending empty messages
    appendMessage(input, 'user');
    fetchChatbotResponse(input);
    document.getElementById('inputField').value = ''; // clear input after send
});

function appendMessage(message, sender) {
    const messageArea = document.getElementById('message-area');
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender === 'user' ? 'user-message' : 'system-message');
    msgDiv.textContent = message;
    messageArea.appendChild(msgDiv);
    messageArea.scrollTop = messageArea.scrollHeight; // auto-scroll to the latest message (chain messages text-style)
}

function displayResult(response) {
    appendMessage(response, 'system');
}

async function fetchChatbotResponse(input) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer INSERT_TOKEN_HERE'  // directly include the API key for demo purposes
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "Be skeptical and disagree with purchases. Respond briefly, under 50 words. Only agree if the argument is convincing."},
                    { role: "user", content: input }
                ],
                max_tokens: 50 // how many characters for each response
            })
        });
        const data = await response.json();
        console.log(data); // log the entire response so you can inspect its structure for troubleshooting

        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            displayResult(data.choices[0].message.content);
        } else {
            displayResult('No response from the API.');
        }
    } catch (error) { //error handling
        console.error('Error fetching response:', error);
        displayResult('Failed to fetch response: ' + error.message);
    }
}