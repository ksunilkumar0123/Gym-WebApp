// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEBjPCRxQCtbirY6zpvTFlYoyPM-v2ZV4",
  authDomain: "gym-app-c0e20.firebaseapp.com",
  projectId: "gym-app-c0e20",
  storageBucket: "gym-app-c0e20.appspot.com",
  messagingSenderId: "681476068528",
  appId: "1:681476068528:web:49c98e5cfd8cf8c5a2d775",
  measurementId: "G-YQXEZSPTXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM elements
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const googleSignInBtn = document.getElementById('googleSignInBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userContainer = document.getElementById('userContainer');
const authContainer = document.getElementById('authContainer');
const userEmail = document.getElementById('userEmail');
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const showSignupBtn = document.getElementById('showSignupBtn');
const showLoginBtn = document.getElementById('showLoginBtn');

// Event listeners
loginBtn.addEventListener('click', () => {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // Redirect to 'main.html'
      window.location.href = '../src/main/webapp/index.html'; // Adjust path if needed
    })
    .catch((error) => {
      const errorMessage = error.message;
      document.getElementById('loginError').textContent = errorMessage;
    });
});

signupBtn.addEventListener('click', () => {
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      // Update profile with name
      return user.updateProfile({ displayName: name });
    })
    .then(() => {
      // Redirect to 'main.html'
      window.location.href = '../src/main/webapp/index.html'; // Adjust path if needed
    })
    .catch((error) => {
      const errorMessage = error.message;
      document.getElementById('signupError').textContent = errorMessage;
    });
});

googleSignInBtn.addEventListener('click', () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      // Signed in
      const user = result.user;
      // Redirect to 'main.html'
      window.location.href = '../src/main/webapp/index.html'; // Adjust path if needed
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.error(errorMessage);
    });
});

logoutBtn.addEventListener('click', () => {
  signOut(auth).then(() => {
    // Sign-out successful
    userContainer.classList.add('hidden');
    authContainer.classList.remove('hidden');
  }).catch((error) => {
    console.error('Logout error:', error);
  });
});

// Check user state on page load
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    authContainer.classList.add('hidden');
    userContainer.classList.remove('hidden');
    userEmail.textContent = user.email;
  } else {
    // User is signed out
    authContainer.classList.remove('hidden');
    userContainer.classList.add('hidden');
  }
});

// Event listeners for view switching
showSignupBtn.addEventListener('click', () => {
  loginForm.classList.add('hidden');
  signupForm.classList.remove('hidden');
});

showLoginBtn.addEventListener('click', () => {
  signupForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
});
