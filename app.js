 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
 import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from
"https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

 import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";

 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional

 const firebaseConfig = {
   apiKey: "AIzaSyA-lFuR1JkxV-gT8TZZmx-SMLXQELIKnR8",
   authDomain: "sign-up-log-in-form-2771e.firebaseapp.com",
   projectId: "sign-up-log-in-form-2771e",
   storageBucket: "sign-up-log-in-form-2771e.firebasestorage.app",
   messagingSenderId: "462822975889",
   appId: "1:462822975889:web:afaea0422cae4f4ca35230",
   measurementId: "G-E6VDFE0YY6"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const analytics = getAnalytics(app);
 const auth = getAuth(app);


 document.getElementById('signupBtn')?.addEventListener('click' , (e) => {
   e.preventDefault();

   let email = document.getElementById('email').value;
   let password = document.getElementById('password').value;

   createUserWithEmailAndPassword(auth , email , password)
   .then(()=>{

       alert('Signup Successfully!');
       window.location.href='notes.html';
   })

   .catch(error => document.getElementById('message').innerText=error.message);
 })

 document.getElementById("loginBtn")?.addEventListener("click", (e) => {
    e.preventDefault();

   const email = document.getElementById("email").value;
   const password = document.getElementById("password").value;

   signInWithEmailAndPassword(auth, email, password)
   .then(() => {

   alert("Login Successful");
   window.location.href = "notes.html";
   })

   .catch(error => document.getElementById("message").innerText = error.message);
   });

   export function logout() {
       signOut(auth)
       .then(() => {
       alert("Logged out");
       window.location.href = "index.html";
       })
       .catch(error => console.error("Logout Error:", error));
       }
       document.getElementById("logoutBtn")?.addEventListener("click", logout);
   