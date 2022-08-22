// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-analytics.js"
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-auth.js";
import { getFirestore, addDoc, setDoc, doc, collection } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzuu0DD6u867h084t-7tKgNsVurQ-K1qI",
  authDomain: "gt-survey-c5b90.firebaseapp.com",
  projectId: "gt-survey-c5b90",
  storageBucket: "gt-survey-c5b90.appspot.com",
  messagingSenderId: "16239887895",
  appId: "1:16239887895:web:8cba2f6089b6b574a3fe52",
  measurementId: "G-XHVQFB473D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);



//Authentication
onAuthStateChanged(auth, user =>{
    if (user) {
        console.log('logged in!');
    } else {
        console.log('no user');
    }
});

const res = document.getElementsByName("qlist");

const btn = document.getElementById("submit");

btn.addEventListener("click", async (e) => {

    const res = document.getElementsByName("qlist");
    const qnum = document.getElementsByClassName('question').length;
    const name = document.getElementById("name").value;
    const division = document.getElementById("division").value;
    const email = document.getElementById("email").value;
    const sdt = document.getElementById("sdt").value;
    let entry = {};
    var check = true;

    if(name == "" || email == "" || division == "" || sdt == "") {
        document.getElementById("info_box").style.border = "solid red 1px";
        check = false;
    } else {
        check = true;
    }
    for (var i = 1; i <= qnum ; i++) {
        const elementID = 'q' + i;
        const question = document.getElementsByName(elementID);
        var answered = false;
        var num = 0;
        // console.log(elementID, question);
        for (var response of question) {
            if (response.checked) {
                // console.log("response: " + response.value)
                if (response.value == "other")
                    entry[i] = "Other: " + document.getElementById(elementID + "_text").value;
                else
                    entry[i] = response.value;
                answered = true;
            }
        }

        if (!answered) {
            document.getElementById(elementID).style.border = "solid red 1px";
        } else {
            document.getElementById(elementID).style.border = "";

        }
        check &= answered;
    }

    

    const data = { name: name, division: division, email: email, sdt: sdt, answer_key: entry };

    e.preventDefault();
    console.log(data);

    if (check) {
        const docRef = await addDoc(collection(db, "collection"),data);
        // console.log("Document written with ID: ", docRef.id);
        window.location.href = "/thankyou.html?key=" + entry['1'];
    }
});



