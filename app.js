const firebaseConfig = {
  apiKey: "AIzaSyCzwd-Ce5gzsIQRWKncVsWtSbm6EQKWS3c",
  authDomain: "campus-issue-system-97d82.firebaseapp.com",
  databaseURL: "https://campus-issue-system-97d82-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "campus-issue-system-97d82"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Submit complaint
function submitComplaint() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;

  const newRef = db.ref("complaints").push();

  newRef.set({
    title: title,
    description: description,
    category: category,
    status: "Pending"
  })
  .then(() => {
  console.log("Data saved successfully");
  alert("Complaint submitted!");
  })
  .catch((error) => {
  console.error("Error:", error);
  alert("Error submitting complaint. Please try again.");
  });
  
}

// Load complaints
function loadComplaints() {
  const list = document.getElementById("list");

  db.ref("complaints").on("value", (snapshot) => {
    list.innerHTML = "";

    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();

      list.innerHTML += `
        <div>
          <h4>${data.title}</h4>
          <p>${data.description}</p>
          <p>${data.category} | ${data.status}</p>
        </div>
        <hr>
      `;
    });
  });
}

loadComplaints();