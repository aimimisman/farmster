console.log("JS FILE LOADED");
const sampleUserId = "Ua54beef6";

localStorage.setItem("currentUser", sampleUserId);

console.log("Current User:", localStorage.getItem("currentUser"));

let allChats = [];
var userchatId = ""; // global variable to store current chatId for sending messages


const url = "https://script.google.com/macros/s/AKfycbwbwa6dOTGj1jQyvPhnJj0ChOEG33at4c97DQ2g6XY0qiJgcahmZzpkw3jwim4sTIqk/exec";
const userId = localStorage.getItem("currentUser"); //my user id


function loadUnreadCount() {

  fetch(
    url +
    "?action=getUnreadCount" +
    "&userId=" + encodeURIComponent(userId)
  )
  .then(res => res.json())
  .then(response => {
    console.log("Unread Count:", response);

    const badge = document.getElementById("notification-count");

    if(response.data.count > 0) {
      badge.style.display = "flex";
      badge.textContent = response.data.count;
    } else {
      badge.style.display = "none";
    }

  })
  .catch(err => console.error(err));
}


function loadNotifications() {

  fetch(url + "?action=getNotify&userId=" + userId + "&t=" + Date.now())
  .then(res => res.json())
  .then(response => {
      console.log("Notification List:", response);

      const notificationList = document.getElementById("notificationList");

      // clear existing
      notificationList.innerHTML = "";
      var html = '';

      // loop notifications
      response.data.forEach(notify => {

        const unreadClass =
          notify.is_read === "false"
          ? "unread"
          : "";

        const unreadDot =
          notify.is_read === "false"
          ? '<span class="unread-dot"></span>'
          : "";

        if(notify.type == "registration") {

           html = `
            <div class="notification-item ${unreadClass}">
              <div class="notification-content">
                <h6>
                  Hello, <strong>${notify.senderName}!</strong>
                  ${notify.message}
                </h6>
                <p>${notify.timeAgo}</p>
              </div>
              ${unreadDot}
            </div>
          `;
        } else if(notify.type == "chat") {

           html = `
            <div class="notification-item ${unreadClass}">
              <div class="notification-content">
                <h6>
                  ${notify.message}
                  <strong>${notify.senderName}!</strong>
                 
                </h6>
                <p>${notify.timeAgo}</p>
              </div>
              ${unreadDot}
            </div>
          `;

        }

        

        notificationList.innerHTML += html;

      });
   

    })
    .catch(err => console.error(err));


}

