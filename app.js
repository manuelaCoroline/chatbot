const messagesContainer = document.querySelector(".content");

userInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    sendMessage();
  }
});

const btnSend = document.querySelector(".btn-send");
btnSend.addEventListener("click", () => {
  sendMessage();
});

async function sendMessage() {
  const userInput = document.getElementById("userInput").value;
  document.getElementById("userInput").value = "";

  const messageContainer = document.getElementById("messages");
  messageContainer.innerHTML += `<div">
    <div class="message user ">${userInput}</div>
  </div>`;

  try {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userInput }),
    });

    const data = await response.json();
    messageContainer.innerHTML += `<div>
    <p>Hiden</p>
      <div class="message bot">${data.response}</div>
    </div>`;
  } catch (error) {
    console.error("Erreur:", error);
    messageContainer.innerHTML += `<div class="message bot">Erreur de serveur</div>`;
  }

  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
