
console.log("Chat JS FILE LOADED");

let allChatss = [];
var userchatId = ""; // global variable to store current chatId for sending messages
var receiverId = ""; // global variable to store receiverId for sending messages


const url = "https://script.google.com/macros/s/AKfycbxQGdtvTVude_65_W2zb_HNSVyieVngi3dt5n4bYbjmoLUrHGGUlRIMzhTPGEVM7YyRvg/exec";
// AKfycbwAXa4qGaowlDlGRrzyQZZsAkAyLOUhKPK7p33UyZqmDs_n7iMj2fJw_hsEoKobtenIaA
//AKfycbythF64y6uKVZxgPq7YvkmQph9Z2ty2_2doXm3DoJzHMNH49bd6ieO2XmzHHvu6A8s-1A
const notyUrl = "https://script.google.com/macros/s/AKfycbxQGdtvTVude_65_W2zb_HNSVyieVngi3dt5n4bYbjmoLUrHGGUlRIMzhTPGEVM7YyRvg/exec";


const storageUserIds = JSON.parse(localStorage.getItem("currentUser"));  //my user id

const userId = storageUserIds.userId; //my user id
console.log("User ID:", userId);

//untuk create new conversation dengan farmer
const selectedFarm = localStorage.getItem("selectedFarm");
const selectedFarmerName = localStorage.getItem("selectedFarmName");
const selectedFarmerId = localStorage.getItem("selectedFarmerId");
console.log(selectedFarm);
console.log(selectedFarmerName);
console.log(selectedFarmerId);


 openChat()


function loadChatList() {
  console.log(
    url + "?action=getChatList&userId=" + userId + "&t=" + Date.now(),
  );

  let html = "";

  const chatcontainer = document.getElementById("chat-list");
  chatcontainer.innerHTML = ""; // clear old list

  fetch(url + "?action=getChatList&userId=" + userId + "&t=" + Date.now())
    .then((res) => res.json())
    .then((response) => {
      console.log("Chat List:", response);

      // DIUBAH: Kalau takde chat langsung DAN takde selectedFarmer, tunjuk mesej kosong
      // SEBELUM: Terus return tanpa check selectedFarmerName
      if (
        (!response.data || response.data.length === 0) &&
        !selectedFarmerName
      ) {
        document.getElementById("chat-list").innerHTML =
          "<p class='text-center text-secondary mt-4'>No chats yet. Start a conversation!</p>";
        return;
      }

      // DIUBAH: Check kalau farmer yang dipilih dari homepage dah ada dalam chat list
      // SEBELUM: Terus check tanpa guard — crash kalau selectedFarmerId null
      let existingChat = null;
      if (selectedFarmerId && response.data) {
        existingChat = response.data.find((chat) => {
          return String(chat.userId) === String(selectedFarmerId);
        });
      }
      console.log("existingChat =", existingChat);

      // DIUBAH: Kalau ada selectedFarmer dari homepage DAN belum pernah chat,
      // tunjuk card "New Conversation" kat atas sekali dalam list
      // SEBELUM: Tunjuk card tapi TAK tunjuk existing chats di bawah
      if (selectedFarmerName && !existingChat) {
        html += `
          <div
              id="new-conversation"
              class="sidebar-item px-4 py-4 hover:bg-green-50 cursor-pointer soft-shadow transition-all duration-300 hover-lift border-l-4 border-transparent"
              onclick="openChatHistory(this, '', '${selectedFarmerName}')"
          >
              <div class="flex items-start gap-3">
                  <div class="relative mt-1">
                      <div class="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                         ${selectedFarmerName.charAt(0)}
                      </div>
                      <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div class="flex-1 min-w-0">
                      <div class="flex justify-between items-start mb-1">
                          <p class="font-semibold text-gray-900">${selectedFarmerName}</p>
                          <span class="text-xs text-gray-500">Now</span>
                      </div>
                      <p class="text-sm text-gray-600 truncate">Currently messaging...</p>
                  </div>
              </div>
          </div>`;
      }

      // DIUBAH: SENTIASA render semua existing chats
      // SEBELUM: Hanya render dalam "else" block — jadi kalau farmer baru, existing chats hilang
      // SELEPAS: Render regardless, supaya user nampak semua chat history
      // DIUBAH: Sort by timestamp — chat paling baru duduk kat atas (top of all messages)
      if (response.data && response.data.length > 0) {
        response.data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
        );
        response.data.forEach((chat) => {
          html += `
                  <div
                      class="sidebar-item px-4 py-4 hover:bg-green-50 cursor-pointer soft-shadow transition-all duration-300 hover-lift border-l-4 border-transparent"
                      onclick="openChatHistory(this, '${chat.chatId}', '${chat.userName}')"
                  >
                      <div class="flex items-start gap-3">
                          <div class="relative mt-1">
                              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                              ${chat.userName.charAt(0)}
                              </div>
                              <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div class="flex-1 min-w-0">
                              <div class="flex justify-between items-start mb-1">
                                  <p class="font-semibold text-gray-900">${chat.userName}</p>
                                  <span class="text-xs text-gray-500">${formatTimeAgo(chat.timestamp) || ""}</span>
                              </div>
                              <p class="text-sm text-gray-600 truncate">${chat.lastMessage || "No messages yet"}</p>
                          </div>
                      </div>
                  </div>`;
        });
      }

      // Masukkan semua HTML ke dalam container
      chatcontainer.innerHTML = html;

      // DIUBAH: Kalau ada new farmer yang belum pernah chat, auto-buka chat tu
      // SEBELUM: Panggil openChatHistory tanpa check null — crash kalau element tak wujud
      // TUJUAN: User dari homepage terus masuk chat dengan farmer yang dipilih
      if (selectedFarmerName && !existingChat) {
        receiverId = selectedFarm;
        const newConvEl = document.getElementById("new-conversation");
        if (newConvEl) {
          openChatHistory(newConvEl, null, selectedFarmerName);
        }
      }
    })
    .catch((err) => console.error(err));
}


function loadMessages(chatId) {
  userchatId = chatId;

  const box = document.getElementById("chat-box");
      
  box.innerHTML = "";

  if(chatId == null) {
    
    const box = document.getElementById("chat-box");
      
     box.innerHTML = "";
    
  }
   
    


  return fetch(url + "?action=getMessages&chatId=" + chatId + "&t=" + Date.now())

  .then(res => res.json())
  .then(response => {

      console.log("RAW DATA:", response);

    //   const box = document.getElementById("chat-box");
      
    //   box.innerHTML = "";

      // response.data.forEach(msg => {

      //   const div = document.createElement("div");

      //   div.classList.add("message");

      //   if (msg.senderId === userId) {
      //     div.classList.add("sent");
      //   } else {
      //     div.classList.add("received");
      //   }

      //   div.innerHTML = `
      //     ${msg.message}
      //     <span class="time">${formatTime(msg.timestamp)}</span>
      //   `;

      //   box.appendChild(div);

      // });

      // box.scrollTop = box.scrollHeight;
      

      // return response.status;
      console.log(userId);
     

      response.data.forEach(msg => {

          const isSender = msg.senderId === userId;
           console.log("sender: " + msg.senderId);

          // const initials = (msg.senderName)
          //     .split(" ")
          //     .map(name => name[0])
          //     .join("")
          //     .substring(0, 2)
          //     .toUpperCase();

          let html = "";
          //bg-green-600 text-white rounded-2xl rounded-br-none px-4 py-3

          if (isSender) {

              html = `
                  <div class="message-bubble flex items-end justify-end gap-3 mb-3">

                      <div class="flex flex-col max-w-xs">
                          <div class="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl rounded-br-none px-4 py-3 soft-shadow">
                              <p class="text-sm">${msg.message}</p>
                          </div>

                          <span class="text-xs text-gray-500 mt-1 mr-3">
                              ${formatTime(msg.timestamp)}
                          </span>
                      </div>

                      <div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                          ${msg.senderId.charAt(0)}
                      </div>

                  </div>
              `;

          } else {

              html = `
                  <div class="message-bubble flex items-end gap-3 mb-3">

                      <div class="relative">
                          <div class="w-8 h-8 rounded-full avatar-green flex items-center justify-center text-white text-xs font-bold">
                               ${msg.senderId.charAt(0)}
                          </div>
                      </div>

                      <div class="flex flex-col max-w-xs">
                          <div class="glass rounded-2xl rounded-bl-none px-4 py-3 soft-shadow border border-emerald-100">
                              <p class="text-sm">${msg.message}</p>
                          </div>

                          <span class="text-xs text-gray-500 mt-1 ml-3">
                              ${formatTime(msg.timestamp)}
                          </span>
                      </div>

                  </div>
              `;
          }

          box.innerHTML += html;
      });


  })

  .catch(err => {
      console.error(err);
  });

}


async function openChat() {
  //document.getElementById("chat-popup").style.display = "block";
  //document.getElementById("loading-spinner-list").style.display = "flex";
  await loadChatList();
  
}

// async function openChatHistory(element, chatId,userName) {
   

 
//     document.getElementById("chatAreaLanding").classList.add("hidden");
//     document.getElementById("chatAreaActive").classList.remove("hidden");
//     document.getElementById("chatAreaActive").classList.add("flex");
//     console.log("Active:", document.getElementById("chatAreaActive"));
//   // hide list view
//  // document.getElementById("chat-list-view").style.display = "none";

//   // show chat view
//  // document.getElementById("chat-view").style.display = "flex";

//   // set name
//   // document.getElementById("chat-header").innerHTML = `
//   //   <div class="d-flex align-items-center py-3">
//   //     <button class="btn btn-light me-2" onclick="backToChatList()">
//   //         <i class="bi bi-arrow-left"></i>
//   //     </button>

//   //       <!-- Avatar -->
//   //       <div class="avatar me-3">
//   //           ${userName.charAt(0)}
//   //       </div>

//   //       <!-- User Info -->
//   //       <div>
//   //           <div class="name">
//   //               ${userName}
//   //           </div>
//   //           <div class="message-preview text-bold">
//   //               online
//   //           </div>
//   //       </div>

//   //   </div>
//   // `;

//     // Remove active style from all chats
//     document.querySelectorAll(".sidebar-item").forEach(item => {
//         item.classList.remove(
//             "bg-green-50",
//             "border-green-600"
//         );

//         item.classList.add("border-transparent");
//     });

//     // Add active style to selected chat
//     element.classList.add(
//         "bg-green-50",
//         "border-green-600"
//     );

//     element.classList.remove("border-transparent");

//     document.getElementById("chat-header").innerHTML = `
//             <div class="flex items-center gap-4">
//                 <div class="relative">
//                     <div class="w-14 h-14 rounded-full avatar-green flex items-center justify-center text-white font-bold">
//                         ${userName.charAt(0)}
//                     </div>
//                     <div class="status-dot"></div>
//                 </div>
//                 <div>
//                     <h2 class="text-lg font-bold text-gray-900">${userName}</h2>
//                     <p class="text-sm text-green-600">Active right now</p>
//                 </div>
//             </div>
      
//     `;

  

    

   


//     // document.getElementById("chat-container").style.display = "block";

//    // document.getElementById("loading-spinner-chat").style.display = "flex";

//     // document.getElementById("chat-box").style.display = "none";

//     await loadMessages(chatId);

//     //  document
//     // .getElementById("chatAreaLanding")
//     // .classList.add("hidden");
   

//    // document.getElementById("loading-spinner-chat").style.display = "none";

//     // document.getElementById("chat-box").style.display = "flex";
// }

// function closeChat() {
//   document.getElementById("chat-popup").style.display = "none";
// }

async function openChatHistory(element, chatId, userName) {

    // FIX: Use classList only (don't mix with style.display)
    document.getElementById("chatAreaLanding").classList.add("hidden");
    document.getElementById("chatAreaActive").classList.remove("hidden");
    document.getElementById("chatAreaActive").classList.add("flex");

    console.log("Active:", document.getElementById("chatAreaActive"));

    // Remove active style from all chats
    document.querySelectorAll(".sidebar-item").forEach(item => {
        item.classList.remove("bg-green-50", "border-green-600");
        item.classList.add("border-transparent");
    });

    // Add active style to selected chat
    element.classList.add("bg-green-50", "border-green-600");
    element.classList.remove("border-transparent");

    document.getElementById("chat-header").innerHTML = `
        <div class="flex items-center gap-4 ">
            <div class="relative">
                <div class="w-14 h-14 rounded-full avatar-green flex items-center justify-center text-white font-bold">
                    ${userName.charAt(0)}
                </div>
            </div>
            <div>
                <h2 class="text-lg font-bold text-gray-900">${userName}</h2>
                <p class="text-sm text-green-600">Available</p>
            </div>
        </div>`
    ;


    await loadMessages(chatId);

    // FIX: Removed the duplicate line that was here:
    // document.getElementById("chatAreaLanding").classList.add("hidden");
    // ^^^ This was redundant and ran AFTER loadMessages, causing a timing issue
}

function backToChatList(){

  document.getElementById("chat-view").style.display = "none";

  //document.getElementById("chat-list-view").style.display = "flex";

}



// =====================
// SEND MESSAGE
// =====================
function sendMessage() {
  const input = document.getElementById("message-input");
  const text = input.value.trim();

  console.log(userchatId);

  console.log("Sending message:", text);

  if (!text) return;

    input.value = "";
    input.innerHTML = "";

    const box = document.getElementById("chat-box");
    const now = new Date();

    let html = "";

    html = `
                <div class="message-bubble flex items-end justify-end gap-3 mb-3">

                    <div class="flex flex-col max-w-xs">
                        <div class="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl rounded-br-none px-4 py-3 soft-shadow">
                            <p class="text-sm">${text}</p>
                        </div>

                        <span class="text-xs text-gray-500 mt-1 mr-3">
                            ${formatTime(now)}
                        </span>
                    </div>

                    <div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                        You
                    </div>

                </div>
            `;

    box.insertAdjacentHTML("beforeend", html);

    box.scrollTop = box.scrollHeight;


  fetch(
    url +
    "?action=sendMessage" +
    "&farmerId=" + encodeURIComponent(selectedFarm) +
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
      "&receiverId=" + encodeURIComponent(selectedFarmerId) +
      "&senderId=" + encodeURIComponent(userId) +
      "&type=chat" +
      "&message=You have one unread message from " +
      "&is_read=false"
    )
    .then(res => res.json())
    .then(response => {

      console.log("Notification stored:", response);

     

     // loadMessages(userchatId);

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
function formatTimeAgo(dateString) {

    const now = new Date();
    const date = new Date(dateString);

    const diffMs = now - date;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (seconds < 60) {
        return "Just now";
    }

    if (minutes < 60) {
        return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    }

    if (hours < 24) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    if (days === 1) {
        return "Yesterday";
    }

    if (days < 7) {
        return `${days} days ago`;
    }

    if (weeks < 4) {
        return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    }

    return date.toLocaleDateString();
}

function formatTime(dateString) { 
    
    const date = new Date(dateString);

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12

    return `${hours}:${minutes} ${ampm}`;

}

// auto refresh (real-time feel)

// loadMessages();