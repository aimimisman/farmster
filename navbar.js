document.addEventListener("DOMContentLoaded", () => {

  fetch("https://aimimisman.github.io/farmster/nav.html")
    .then(res => res.text())
    .then(html => {

      document.getElementById("navbar-container").innerHTML = html;

      // NOW navbar exists → safe to use elements
      initNavbar();

      loadUnreadCount(); // safe AFTER render
    });

});

function initNavbar() {

  const icon = document.getElementById("notificationIcon");

  if (!icon) return;

  icon.addEventListener("click", openNotificationModal);

}

function logoutUser() {
    localStorage.removeItem("currentUser");

    window.location.href =
   "/modules/member-b/farmer-profile/login.html";
}
