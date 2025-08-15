const hiteshMessages = [];
const piyushMessages = [];
let activePersona = "hitesh";

const personaRadios = document.querySelectorAll('input[name="persona"]');
const chatContainer = document.getElementById("chat-container");
const inputField = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

personaRadios.forEach(radio => {
  radio.addEventListener("change", (e) => {
    activePersona = e.target.value;
    renderChat(); // Switch karte hi sirf us persona ka chat show hoga
  });
});

function renderChat() {
  chatContainer.innerHTML = ""; // Purani chat clear
  const msgs = activePersona === "hitesh" ? hiteshMessages : piyushMessages;
  
  msgs.forEach(msg => {
    const div = document.createElement("div");
    div.className = msg.role === "user" ? "user-msg" : "bot-msg";
    div.textContent = msg.content;
    chatContainer.appendChild(div);
  });

  // Scroll bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
  const message = inputField.value.trim();
  if (!message) return;

  const msgs = activePersona === "hitesh" ? hiteshMessages : piyushMessages;

  // Add user message
  msgs.push({ role: "user", content: message });
  renderChat();
  inputField.value = "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ persona: activePersona, message })
    });
    const data = await res.json();

    msgs.push({ role: "assistant", content: data.reply });
    renderChat();
  } catch (err) {
    msgs.push({ role: "assistant", content: "⚠️ Error: " + err.message });
    renderChat();
  }
}

sendBtn.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
