
console.log("JS FILE LOADED");
let allChats = [];


const url = "https://script.google.com/macros/s/AKfycbzqUldMhHQ2K8zupVkosC6_KMf7YgPgPVtBAy6oS7Ie_fdA_LVQcT80LRlN91aBbaub5w/exec";

const chatId = "C001"; // change based on selected chat
const userId = "U001";


function loadMessages() {

  fetch(url + "?action=getMessages&chatId=" + chatId + "&t=" + Date.now())
  .then(res => res.json())
  .then(response => {

      console.log("RAW DATA:", response);

      const box = document.getElementById("chat-box");
      box.innerHTML = "";

      response.data.forEach(msg => {
        const div = document.createElement("div");

        // WhatsApp-style alignment
        div.classList.add("message");

        if (msg.senderId === userId) {
          div.classList.add("sent");
        } else {
          div.classList.add("received");
        }

        div.innerHTML = `
          ${msg.message}
          <span class="time">${formatTime(msg.timestamp)}</span>
        `;

        box.appendChild(div);
      });

      box.scrollTop = box.scrollHeight;
      
      
  })
  .catch(err => console.error(err));

}


function openChat() {
  document.getElementById("chat-popup").style.display = "block";
  loadMessages()


  
}

function closeChat() {
  document.getElementById("chat-popup").style.display = "none";
}




// =====================
// SEND MESSAGE
// =====================
function sendMessage() {
  const input = document.getElementById("message-input");
  const text = input.value.trim();

  Console.log("Sending message:", text);

  if (!text) return;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "sendMessage",
      chatId: chatId,
      senderId: userId,
      status: "sent",
      message: text
    })
  })
  .then(res => res.json())
  .then(response => {
    console.log("Sent:", response);

    input.value = "";
    loadMessages();
  })
  .catch(err => console.error("Send error:", err));
}


// =====================
// FORMAT TIME
// =====================
function formatTime(dateString) {
  const date = new Date(dateString);
  return date.getHours().toString().padStart(2, "0") + ":" +
         date.getMinutes().toString().padStart(2, "0");
}

// auto refresh (real-time feel)

// loadMessages();