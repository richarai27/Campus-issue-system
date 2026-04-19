const firebaseConfig = {
  apiKey: "AIzaSyCzwd-Ce5gzsIQRWKncVsWtSbm6EQKWS3c",
  authDomain: "campus-issue-system-97d82.firebaseapp.com",
  databaseURL: "https://campus-issue-system-97d82-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "campus-issue-system-97d82"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const auth = firebase.auth();

// Auto login handling
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("roleSection").style.display = "block";
  }
});

// SIGNUP (with whitelist check)
function signup() {
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  db.ref("allowedusers").once("value", (snapshot) => {
    let allowed = false;
    let role = "student";

    snapshot.forEach((child) => {
      const data = child.val();

      if (data.email.trim().toLowerCase() === email) {
        allowed = true;
        role = data.role.toLowerCase();
      }
    });

    if (!allowed) {
      alert("You are not authorized.");
      return;
    }

    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        db.ref("users/" + user.uid).set({
          email: email,
          role: role
        });

        alert("Registered successfully!");
      })
      .catch(err => alert(err.message));
  });
}

// LOGIN
function login() {
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Login successful!");
      document.getElementById("loginSection").style.display = "none";
      document.getElementById("roleSection").style.display = "block";
    })
    .catch(err => alert(err.message));
}

// ROLE NAVIGATION
function goStudent() {
  const user = auth.currentUser;

  if (!user) {
    alert("Please login first");
    return;
  }

  window.location.href = "student.html";
}

function goAdmin() {
  const user = auth.currentUser;

  if (!user) {
    alert("Please login first");
    return;
  }

  db.ref("users/" + user.uid).once("value", (snapshot) => {
    const data = snapshot.val();

    if (data && data.role === "admin") {
      window.location.href = "admin.html";
    } else {
      alert("Access denied: Not an admin");
    }
  });
}