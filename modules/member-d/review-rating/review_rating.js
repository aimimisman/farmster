
const urlApps = "https://script.google.com/macros/s/AKfycbxQGdtvTVude_65_W2zb_HNSVyieVngi3dt5n4bYbjmoLUrHGGUlRIMzhTPGEVM7YyRvg/exec";

var farmerId = localStorage.getItem("selectedFarmerId");
var farmName = localStorage.getItem("selectedFarmName");
var storageUserIds = JSON.parse(localStorage.getItem("currentUser"));

fetchReviews();



//star rating
function initStarRating() {
  const stars = document.querySelectorAll("#starRating .star");
  const ratingInput = document.getElementById("reviewRatingInput");

  stars.forEach(star => {
    star.addEventListener("click", () => {
      const value = star.dataset.value;
      ratingInput.value = value;
      console.log(value);
      updateStars(value, stars);
    });
  });
}

function updateStars(value, stars) {
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
// const stars = document.querySelectorAll("#starRating .star");
// const ratingInput = document.getElementById("reviewRating");

// stars.forEach(star => {
//   star.addEventListener("click", () => {
//     const value = star.dataset.value;
//     ratingInput.value = value;
//     updateStars(value);
//   });
// });

// function updateStars(value) {
//   stars.forEach(star => {
//     const v = star.dataset.value;

//     if (v <= value) {
//       star.classList.remove("bi-star");
//       star.classList.add("bi-star-fill", "text-warning");
//     } else {
//       star.classList.remove("bi-star-fill", "text-warning");
//       star.classList.add("bi-star");
//     }
//   });
// }
//end star rating

//store review
function storeReview() {

  const rating = document.getElementById("reviewRatingInput").value;
  const comment = document.getElementById("reviewComment").value.trim();

  document.getElementById("loading-spinner-list").style.display = "flex";

  console.log("Storing review:", { rating, comment });

  if (!comment) return;

  fetch(
    urlApps +
    "?action=storeReview" +
    "&farmerId=" + encodeURIComponent(farmerId) +
    "&userId=" + encodeURIComponent(storageUserIds.userId) +
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


  document.getElementById("stars").innerHTML = averageStars;
}

//fetch review
function fetchReviews() {

    const reviewList = document.getElementById("review-list");
    const moreReviewsBtn = document.getElementById("moreReviewsBtn");

     if (!reviewList || !moreReviewsBtn) {
        return;
    }

    let html = "";
    let hiddenHtml = "";

  fetch(urlApps + "?action=getReview&selectedFarmer=" + farmerId + "&t=" + Date.now())
  .then(res => res.json())
  .then(response => {
      console.log("Review List:", response.status);

      document.getElementById("farmName").textContent = farmName;
      const totalReviews = response.data.length;
      calculateTotalReview(totalReviews);

      //calculate average rating
      const averageRating =
            totalReviews > 0
              ? response.data.reduce((sum, review) => sum + Number(review.rating), 0) / totalReviews
              : 0;

      document.getElementById("review-average").textContent = averageRating.toFixed(1);
      document.getElementById("review-average2").textContent = averageRating.toFixed(1);
      document.getElementById("ratingValue").textContent = averageRating.toFixed(1);
      calculateTotalAverageStars(averageRating);

      // loop reviews
      response.data.forEach((review, index) => {

         const stars =
        "★".repeat(review.rating) +
        "☆".repeat(5 - review.rating);

        const reviewHtml = `
            <div class="review-card bg-white rounded-xl p-6  border border-gray-200 hover:shadow-md transition-all">
              <div class="flex justify-between items-start mb-3">
                <div>
                    <p class="font-semibold text-slate-900">${review.userId}</p>
                    <p class="text-sm text-gray-600">${review.timeAgo}</p>
                    <p class="text-gray-700 mb-4">${review.comment}</p>
                </div>
                <div class="flex gap-0.5">
                    <div class="review-stars">
                        ${stars}
                    </div>
                </div>
               
              </div>

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

 