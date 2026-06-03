console.log("JS FILE LOADED");
const sampleUserId = "Ua54beef6";

localStorage.setItem("currentUser", sampleUserId);

console.log("Current User:", localStorage.getItem("currentUser"));

let allChats = [];
var userchatId = ""; // global variable to store current chatId for sending messages


const url = "https://script.google.com/macros/s/AKfycbythF64y6uKVZxgPq7YvkmQph9Z2ty2_2doXm3DoJzHMNH49bd6ieO2XmzHHvu6A8s-1A/exec";
const userId = localStorage.getItem("currentUser"); //my user id


function loadNotifications() {

  fetch(url + "?action=getNotify&userId=" + userId + "&t=" + Date.now())
  .then(res => res.json())
  .then(response => {
      console.log("Notification List:", response);

      const notificationList = document.getElementById("notificationList");

      // clear existing
      notificationList.innerHTML = "";

      // loop notifications
      response.data.forEach(notify => {

        const unreadClass =
          notify.is_read === "FALSE"
          ? "unread"
          : "";

        const unreadDot =
          notify.is_read === "FALSE"
          ? '<span class="unread-dot"></span>'
          : "";

        const html = `

          <div class="notification-item ${unreadClass}">

          

            <div class="notification-content">

              <h6>
                <strong>${notify.senderName}</strong>
                ${notify.message}
              </h6>

              <p>${notify.timeAgo}</p>

            </div>

            ${unreadDot}

          </div>

        `;

        notificationList.innerHTML += html;

      });
   

    })
    .catch(err => console.error(err));


}