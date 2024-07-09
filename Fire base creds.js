<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
  const analytics = getAnalytics(app);
</script>