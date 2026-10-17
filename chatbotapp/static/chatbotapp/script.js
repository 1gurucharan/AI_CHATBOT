
const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const chatBox = document.getElementById("chat-box");
const loading = document.getElementById("loading");
const sendButton = document.getElementById("send-button");

// Get Django's CSRF token from the form
const csrfToken = document.querySelector(
    '[name="csrfmiddlewaretoken"]'
).value;

// Display a message in the chat window
function addMessage(text, sender) {
    const message = document.createElement("div");

    message.classList.add("message");
    message.classList.add(
        sender === "user" ? "user-message" : "bot-message"
    );

    message.textContent = text;

    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Handle form submission
chatForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const userMessage = messageInput.value.trim();

    if (!userMessage) {
        return;
    }

    // Display the user's message
    addMessage(userMessage, "user");

    messageInput.value = "";
    messageInput.focus();

    // Show loading indicator
    loading.classList.remove("hidden");
    sendButton.disabled = true;

    try {
        const response = await fetch("/chat/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },
            body: JSON.stringify({
                message: userMessage
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Unable to get a response."
            );
        }

        // Display Gemini's reply
        addMessage(data.reply, "bot");

    } catch (error) {
        addMessage(
            "Error: " + error.message,
            "bot"
        );

    } finally {
        loading.classList.add("hidden");
        sendButton.disabled = false;
        messageInput.focus();
    }
});
