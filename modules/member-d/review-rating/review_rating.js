
const url = "https://script.google.com/macros/s/AKfycbwAXa4qGaowlDlGRrzyQZZsAkAyLOUhKPK7p33UyZqmDs_n7iMj2fJw_hsEoKobtenIaA/exec";

const sampleUserId = "U001";
const farmerId = "U8653503c";
localStorage.setItem("currentUser", sampleUserId);

const userId = localStorage.getItem("currentUser"); //my user id
console.log("User ID:", userId);
fetchReviews();



//star rating
const stars = document.querySelectorAll("#starRating .star");
const ratingInput = document.getElementById("reviewRating");

stars.forEach(star => {
  star.addEventListener("click", () => {
    const value = star.dataset.value;
    ratingInput.value = value;
    updateStars(value);
  });
});

function updateStars(value) {
  stars.forEach(star => {
    const v = star.dataset.value;

    if (v <= value) {
      star.classList.remove("bi-star");
      star.classList.add("bi-star-fill", "text-warning");
    } else {
      star.classList.remove("bi-star-fill", "text-warning");
      star.classList.add("bi-star");
    }
  });
}
//end star rating

//store review
function storeReview() {

  const rating = document.getElementById("reviewRating").value;
  const comment = document.getElementById("reviewComment").value.trim();

  document.getElementById("loading-spinner-list").style.display = "flex";

  console.log("Storing review:", { rating, comment });

  if (!comment) return;

  fetch(
    url +
    "?action=storeReview" +
    "&farmerId=" + encodeURIComponent(farmerId) +
    "&userId=" + encodeURIComponent(userId) +
    "&rating=" + encodeURIComponent(rating) +
    "&comment=" + encodeURIComponent(comment)
  )
  .then(res => res.json())
  .then(response => {

    console.log("Sent:", response);
    if (response.status === "success") {

            // Close review modal
            const reviewModal = bootstrap.Modal.getInstance(document.getElementById("reviewModal"));
            reviewModal.hide();

            // Show success modal
            const successModal = new bootstrap.Modal(document.getElementById("thankyouModal"));
            document.getElementById("loading-spinner-list").style.display = "none";
            successModal.show();
        }


    // After sending the message, we can also trigger a notification for the recipient
    // fetch(
    //   notyUrl +
    //   "?action=storeNotification" +
    //   "&receiverId=" + encodeURIComponent(receiverId) +
    //   "&senderId=" + encodeURIComponent(userId) +
    //   "&type=chat" +
    //   "&message=You have one unread message from " +
    //   "&is_read=false"
    // )
    // .then(res => res.json())
    // .then(response => {

    //   console.log("Notification stored:", response);

    //   input.value = "";

    //   loadMessages(userchatId);

    // })
    // .catch(err => console.error("Notification error:", err));
    // end


    // input.value = "";

    // loadMessages(userchatId);

  })
  .catch(err => console.error("Send error:", err));
}

//calculate total reviews
function calculateTotalReview(totalReviews){
  document.getElementById("totalReviews").textContent = `Based on ${totalReviews} customer reviews`;
}

//calculate average stars
function calculateTotalAverageStars(averageRating){
  const roundedRating = Math.round(averageRating);
  const averageStars =
      "★".repeat(roundedRating) +
      "☆".repeat(5 - roundedRating);

      console.log("Average Stars:", averageStars);

  document.getElementById("stars").innerHTML = averageStars;
}

//fetch review
function fetchReviews() {

    const reviewList = document.getElementById("review-list");
    const moreReviewsBtn = document.getElementById("moreReviewsBtn");

    let html = "";
    let hiddenHtml = "";

  fetch(url + "?action=getReview&userId=" + userId + "&t=" + Date.now())
  .then(res => res.json())
  .then(response => {
      console.log("Review List:", response);

      document.getElementById("farmName").textContent = response.data[0].farmerName;
      const totalReviews = response.data.length;
      calculateTotalReview(totalReviews);

      //calculate average rating
      const averageRating = response.data.reduce((sum, review) => sum + review.rating, 0) / totalReviews; 
      document.getElementById("review-average").textContent = `${averageRating}`;
      calculateTotalAverageStars(averageRating);

      // loop reviews
      response.data.forEach((review, index) => {

         const stars =
        "★".repeat(review.rating) +
        "☆".repeat(5 - review.rating);

        const reviewHtml = `
            <div class="review-item">
                <div class="review-name">
                    ${review.userId}
                </div>

                <div class="review-stars">
                    ${stars}
                </div>

                <p>${review.comment}</p>

                <small>${review.timeAgo}</small>
            </div>
        `;

        if (index < 5) {
            html += reviewHtml;
        } else {
            hiddenHtml += reviewHtml;
        }
        

        

       

      });

       reviewList.innerHTML = html;

      if (hiddenHtml) {

          reviewList.innerHTML += `
              <div id="hiddenReviews" style="display:none;">
                  ${hiddenHtml}
              </div>
          `;

          moreReviewsBtn.addEventListener("click", () => {

              const hiddenReviews = document.getElementById("hiddenReviews");

              if (hiddenReviews.style.display === "none") {
                  hiddenReviews.style.display = "block";
                  moreReviewsBtn.textContent = "Show Less";
              } else {
                  hiddenReviews.style.display = "none";
                  moreReviewsBtn.textContent = "More Reviews";
              }
          });

      } else {
          moreReviewsBtn.style.display = "none";
      }
   

    })
    .catch(err => console.error(err));


}