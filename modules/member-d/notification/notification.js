console.log("Notification JS FILE LOADED");

let allChats = [];
var userchatId = ""; // global variable to store current chatId for sending messages


const notiesurl = "https://script.google.com/macros/s/AKfycbxQGdtvTVude_65_W2zb_HNSVyieVngi3dt5n4bYbjmoLUrHGGUlRIMzhTPGEVM7YyRvg/exec";

const storageUserId =  JSON.parse(localStorage.getItem("currentUser")); //my user id
console.log(storageUserId.userId);

function openNotificationModal() {

  fetch("/modules/member-d/notification/notification.html")
    .then(res => res.text())
    .then(html => {

      document.getElementById("modalContainer").innerHTML = html;

      loadNotifications(); // now safe

      const modal = new bootstrap.Modal(
        document.getElementById("notificationModal")
      );

      modal.show();

    });

}


function loadUnreadCount() {

  fetch(
    notiesurl +
    "?action=getUnreadCount" +
    "&userId=" + encodeURIComponent(storageUserId.userId)
  )
  .then(res => res.json())
  .then(response => {
    console.log("Unread Count:", response);

    const badge = document.getElementById("notification-count");
    if (!badge) {
      console.log("notification-count not found yet");
      return;
    }

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

  fetch(notiesurl + "?action=getNotify&userId=" + storageUserId.userId + "&t=" + Date.now())
  .then(res => res.json())
  .then(response => {
      console.log("Notification List:", response);

      const notificationList = document.getElementById("notificationList");

      // clear existing
      if (!notificationList) {
        console.error("notificationList not found");
        return;
      }

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

