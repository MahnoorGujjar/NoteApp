//  // Import the functions you need from the SDKs you need
//  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
//  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from
// "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

//  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";

//  // TODO: Add SDKs for Firebase products that you want to use
//  // https://firebase.google.com/docs/web/setup#available-libraries

//  // Your web app's Firebase configuration
//  // For Firebase JS SDK v7.20.0 and later, measurementId is optional

//  const firebaseConfig = {
//    apiKey: "AIzaSyA-lFuR1JkxV-gT8TZZmx-SMLXQELIKnR8",
//    authDomain: "sign-up-log-in-form-2771e.firebaseapp.com",
//    projectId: "sign-up-log-in-form-2771e",
//    storageBucket: "sign-up-log-in-form-2771e.firebasestorage.app",
//    messagingSenderId: "462822975889",
//    appId: "1:462822975889:web:afaea0422cae4f4ca35230",
//    measurementId: "G-E6VDFE0YY6"
//  };

//  // Initialize Firebase
//  const app = initializeApp(firebaseConfig);
//  const analytics = getAnalytics(app);
//  const auth = getAuth(app);


//  document.getElementById('signupBtn')?.addEventListener('click' , (e) => {
//    e.preventDefault();

//    let email = document.getElementById('email').value;
//    let password = document.getElementById('password').value;

//    createUserWithEmailAndPassword(auth , email , password)
//    .then(()=>{

//        alert('Signup Successfully!');
//        window.location.href='notes.html';
//    })

//    .catch(error => document.getElementById('message').innerText=error.message);
//  })

//  document.getElementById("loginBtn")?.addEventListener("click", (e) => {
//     e.preventDefault();

//    const email = document.getElementById("email").value;
//    const password = document.getElementById("password").value;

//    signInWithEmailAndPassword(auth, email, password)
//    .then(() => {

//    alert("Login Successful");
//    window.location.href = "notes.html";
//    })

//    .catch(error => document.getElementById("message").innerText = error.message);
//    });

//    export function logout() {
//        signOut(auth)
//        .then(() => {
//        alert("Logged out");
//        window.location.href = "index.html";
//        })
//        .catch(error => console.error("Logout Error:", error));
//        }
//        document.getElementById("logoutBtn")?.addEventListener("click", logout);
// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {
  getFirestore, collection, addDoc, doc, updateDoc, deleteDoc,
  onSnapshot, orderBy, query, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyA-lFuR1JkxV-gT8TZZmx-SMLXQELIKnR8",
  authDomain: "sign-up-log-in-form-2771e.firebaseapp.com",
  projectId: "sign-up-log-in-form-2771e",
  storageBucket: "sign-up-log-in-form-2771e.appspot.com",
  messagingSenderId: "462822975889",
  appId: "1:462822975889:web:afaea0422cae4f4ca35230",
  measurementId: "G-E6VDFE0YY6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const newNoteBtn = document.getElementById("newNoteBtn");
const notesList = document.getElementById("notesList");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const searchInput = document.getElementById("searchInput");
const importantBtn = document.getElementById("importantBtn");
const deleteBtn = document.getElementById("deleteBtn");
const darkModeBtn = document.getElementById("darkModeBtn");

let currentNoteId = null;
let isImportant = false;

// Dark Mode
darkModeBtn?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}

// New Note
newNoteBtn?.addEventListener("click", () => {
  currentNoteId = null;
  noteTitle.value = "";
  noteContent.innerHTML = "";
  isImportant = false;
  importantBtn.innerHTML = '<i class="far fa-star"></i>';
});

// Save Note
const saveNote = async () => {
  const title = noteTitle.value.trim();
  const content = noteContent.innerHTML.trim();
  if (!title && !content) return;

  const noteData = {
    title,
    content,
    important: isImportant,
    updatedAt: serverTimestamp()
  };

  if (currentNoteId) {
    const noteRef = doc(db, "notes", currentNoteId);
    await updateDoc(noteRef, noteData);
  } else {
    noteData.createdAt = serverTimestamp();
    await addDoc(collection(db, "notes"), noteData);
  }
};

// Load Notes
const loadNotes = () => {
  const notesQuery = query(
    collection(db, "notes"),
    orderBy("important", "desc"),
    orderBy("updatedAt", "desc")
  );

  onSnapshot(notesQuery, (snapshot) => {
    notesList.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const note = docSnap.data();
      const noteElement = document.createElement("div");
      noteElement.className = `note-item ${note.important ? "important" : ""}`;
      noteElement.innerHTML = `
        <h3>${note.title || "Untitled Note"}</h3>
        <p>${note.content.substring(0, 60)}${note.content.length > 60 ? "..." : ""}</p>
      `;
      noteElement.addEventListener("click", () => {
        currentNoteId = docSnap.id;
        noteTitle.value = note.title || "";
        noteContent.innerHTML = note.content || "";
        isImportant = note.important || false;
        importantBtn.innerHTML = isImportant ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
      });
      notesList.appendChild(noteElement);
    });
  });
};

// Search Notes
searchInput?.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const notes = document.querySelectorAll(".note-item");
  notes.forEach((note) => {
    const title = note.querySelector("h3").textContent.toLowerCase();
    const content = note.querySelector("p").textContent.toLowerCase();
    note.style.display = (title.includes(searchTerm) || content.includes(searchTerm)) ? "block" : "none";
  });
});

// Toggle Important
importantBtn?.addEventListener("click", async () => {
  isImportant = !isImportant;
  importantBtn.innerHTML = isImportant ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';

  if (currentNoteId) {
    const noteRef = doc(db, "notes", currentNoteId);
    await updateDoc(noteRef, {
      important: isImportant,
      updatedAt: serverTimestamp()
    });
  }
});

// Delete Note
deleteBtn?.addEventListener("click", async () => {
  if (currentNoteId && confirm("Are you sure you want to delete this note?")) {
    const noteRef = doc(db, "notes", currentNoteId);
    await deleteDoc(noteRef);
    currentNoteId = null;
    noteTitle.value = "";
    noteContent.innerHTML = "";
    isImportant = false;
    importantBtn.innerHTML = '<i class="far fa-star"></i>';
  }
});

// Auto-save
let saveTimeout;
noteTitle?.addEventListener("input", () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveNote, 1000);
});
noteContent?.addEventListener("input", () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveNote, 1000);
});

// Auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadNotes();
  } else {
    window.location.href = "index.html";
  }
});

// Logout function (exported)
export function logout() {
  signOut(auth).then(() => {
    alert("Logged out");
    window.location.href = "index.html";
  }).catch((error) => {
    console.error("Logout error:", error);
  });
}

document.getElementById("logoutBtn")?.addEventListener("click", logout);

   
