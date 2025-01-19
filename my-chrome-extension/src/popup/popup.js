document.getElementById('submitButton').addEventListener('click', function() {
    var input = document.getElementById('inputField').value;
    fetchChatbotResponse(input);
});

function displayResult(response) {
    var resultContainer = document.getElementById('result');
    resultContainer.innerHTML = response;
    resultContainer.style.display = 'block'; // result container
}

async function fetchChatbotResponse(input) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer [INSERT KEY HERE]'  // Directly include the API key for demo purposes
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
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
