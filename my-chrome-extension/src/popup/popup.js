document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('myButton');
    const inputField = document.getElementById('myInput');

    button.addEventListener('click', function() {
        const inputValue = inputField.value;
        alert('You entered: ' + inputValue);
    });
});