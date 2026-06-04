
console.log("JS FILE LOADED");
const sampleUserId = "U001";

localStorage.setItem("currentUser", sampleUserId);

console.log("Current User:", localStorage.getItem("currentUser"));

let allChats = [];
var userchatId = ""; // global variable to store current chatId for sending messages
var receiverId = ""; // global variable to store receiverId for sending messages


const url = "https://script.google.com/macros/s/AKfycbythF64y6uKVZxgPq7YvkmQph9Z2ty2_2doXm3DoJzHMNH49bd6ieO2XmzHHvu6A8s-1A/exec";
const notyUrl = "https://script.google.com/macros/s/AKfycbwbwa6dOTGj1jQyvPhnJj0ChOEG33at4c97DQ2g6XY0qiJgcahmZzpkw3jwim4sTIqk/exec";


const userId = localStorage.getItem("currentUser"); //my user id
console.log("User ID:", userId);

function loadChatList() {
  console.log(url + "?action=getChatList&userId=" + userId + "&t=" + Date.now());

  fetch(url + "?action=getChatList&userId=" + userId + "&t=" + Date.now())
  .then(res => res.json())
  .then(response => {
      console.log("Chat List:", response);

      if(!response.data || response.data.length === 0) {
        document.getElementById("chat-list").innerHTML = "<p class='text-center text-secondary mt-4'>No chats yet. Start a conversation!</p>";
        document.getElementById("loading-spinner-list").style.display = "none";
        return;
      }

      const container = document.getElementById("chat-list");
      container.innerHTML = ""; // clear old list

      response.data.forEach(chat => {

        const div = document.createElement("div");
        console.log("Chat ID:", chat.chatId);

        div.className = "profile ms-3";
        div.onclick = function () {
          receiverId = chat.userId; // set receiverId when opening chat
          openChatHistory(chat.chatId, chat.userName);
        };

        div.innerHTML = `
          <div class="d-flex align-items-center border-bottom py-3">

              <div class="avatar me-3">
                  ${chat.userName.charAt(0)}
              </div>

              <div>
                  <div class="name">
                      ${chat.userName}
                  </div>

                  <div class="message-preview text-secondary">
                      ${chat.lastMessage}
                  </div>
              </div>

          </div>
        `;

        container.appendChild(div);
      });

      document.getElementById("loading-spinner-list").style.display = "none";

    })
    .catch(err => console.error(err));


}


function loadMessages(chatId) {
  userchatId = chatId;


  return fetch(url + "?action=getMessages&chatId=" + chatId + "&t=" + Date.now())

  .then(res => res.json())
  .then(response => {

      console.log("RAW DATA:", response);

      const box = document.getElementById("chat-box");
      
      box.innerHTML = "";

      response.data.forEach(msg => {

        const div = document.createElement("div");

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
      

      return response.status;

  })

  .catch(err => {
      console.error(err);
  });

}


async function openChat() {
  document.getElementById("chat-popup").style.display = "block";
  document.getElementById("loading-spinner-list").style.display = "flex";
  await loadChatList();
  
}

async function openChatHistory(chatId,userName) {

 
  // hide list view
  document.getElementById("chat-list-view").style.display = "none";

  // show chat view
  document.getElementById("chat-view").style.display = "flex";

  // set name
  document.getElementById("chat-header").innerHTML = `
    <div class="d-flex align-items-center py-3">
      <button class="btn btn-light me-2" onclick="backToChatList()">
          <i class="bi bi-arrow-left"></i>
      </button>

        <!-- Avatar -->
        <div class="avatar me-3">
            ${userName.charAt(0)}
        </div>

        <!-- User Info -->
        <div>
            <div class="name">
                ${userName}
            </div>
            <div class="message-preview text-bold">
                online
            </div>
        </div>

    </div>
  `;


    // document.getElementById("chat-container").style.display = "block";

    document.getElementById("loading-spinner-chat").style.display = "flex";

    // document.getElementById("chat-box").style.display = "none";

    await loadMessages(chatId);
   

    document.getElementById("loading-spinner-chat").style.display = "none";

    // document.getElementById("chat-box").style.display = "flex";
}

function closeChat() {
  document.getElementById("chat-popup").style.display = "none";
}

function backToChatList(){

  document.getElementById("chat-view").style.display = "none";

  document.getElementById("chat-list-view").style.display = "flex";

}



// =====================
// SEND MESSAGE
// =====================
function sendMessage() {
  const input = document.getElementById("message-input");
  const text = input.value.trim();

  console.log("Sending message:", text);

  if (!text) return;

  fetch(
    url +
    "?action=sendMessage" +
    "&chatId=" + encodeURIComponent(userchatId) +
    "&senderId=" + encodeURIComponent(userId) +
    "&status=sent" +
    "&message=" + encodeURIComponent(text)
  )
  .then(res => res.json())
  .then(response => {

    console.log("Sent:", response);

    // After sending the message, we can also trigger a notification for the recipient
    fetch(
      notyUrl +
      "?action=storeNotification" +
      "&receiverId=" + encodeURIComponent(receiverId) +
      "&senderId=" + encodeURIComponent(userId) +
      "&type=chat" +
      "&message=You have one unread message from " +
      "&is_read=false"
    )
    .then(res => res.json())
    .then(response => {

      console.log("Notification stored:", response);

      input.value = "";

      loadMessages(userchatId);

    })
    .catch(err => console.error("Notification error:", err));
    // end


    // input.value = "";

    // loadMessages(userchatId);

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