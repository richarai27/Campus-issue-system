const firebaseConfig = {
  apiKey: "AIzaSyCzwd-Ce5gzsIQRWKncVsWtSbm6EQKWS3c",
  authDomain: "campus-issue-system-97d82.firebaseapp.com",
  databaseURL: "https://campus-issue-system-97d82-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "campus-issue-system-97d82"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Global DB reference
const db = firebase.database();