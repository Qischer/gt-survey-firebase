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

//verify phone number 
const verifyPhoneNumber = (input) => {
    // var ver_phone = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

    var ver_phone = /^\(?(?:\+?(\d{1,3}))?[- ]?(\d{3})[- ]?(\d{3})[- ]?(\d{3,4})$/;
    return ver_phone.test(input)  
}

//verify email
const verifyEmail = (input) => {
    let num = 0;
    for (var i = 0; i < input.length; i++) {

        if (input.charAt(i) === "@") {
            num++;
        }
    }
    var end = input.substring(input.lastIndexOf("@") + 1);
    if (num == 1) {
        if (end !== "gmail.com" && end !=="yahoo.com" & end !== "yahoo.com.vn" & end !== "hotmail.com") {
            return true;
        }
    }
    return false;
}
const emailAndPhoneNumberStyle = (input, noti)=> {
    input.style.display = "block";
    input.style.color = "red";
    input.innerHTML = "Please type in the correct " + noti;
}

btn.addEventListener("click", async (e) => {

    const res = document.getElementsByName("qlist");
    const qnum = document.getElementsByClassName('question').length;
    const name = document.getElementById("name").value;
    const division = document.getElementById("division").value;
    const email = document.getElementById("email").value;
    const sdt = document.getElementById("sdt").value;
    let entry = {};
    var check = true;

    if (name == "" || email == "" || division == "" || sdt == "" ) {
        document.getElementById("info_box").style.border = "solid red 1px";
        check = false;
    }  else {
        var phone_number_noti = document.getElementById("number-validation");
        var email_noti = document.getElementById("email-validation");

        if (!verifyPhoneNumber(sdt) || !verifyEmail(email)){

            if (!verifyPhoneNumber(sdt)) {
                emailAndPhoneNumberStyle(phone_number_noti, "phone number");
            } else {
                phone_number_noti.style.display = "none";
            }
            if (!verifyEmail(email)) {
                emailAndPhoneNumberStyle(email_noti, "type of email")
            } else {
                email_noti.style.display = "none";
            }
            check = false;
           
        } else {
            phone_number_noti.style.display = "none";
            email_noti.style.display = "none";
            check = true;
            document.getElementById("info_box").style.border = "none";
            
        
        }
    }
    var error = document.getElementsByClassName("error");
    for (var i = 1; i <= qnum ; i++) {
        const elementID = 'q' + i;
        const question = document.getElementsByName(elementID);
        var answered = false;
        let num = 0;
        // console.log(elementID, question);
        if (i == 3) {
            var array = [];
        }
        for (var response of question) {
           
            if (response.checked) {
                
                if  (response.value == "other") {
                    entry[i] = "Other: " + document.getElementById(elementID + "_text").value;
            } else {
                    if (i == 3) {
                        array.push(response.value);
                        entry[i] = array;
                        console.log("entry: " + entry[i]);
                    } else {
                        entry[i] = response.value;
                    }
                    
            }
            answered = true;
        }
    }
    console.log("num: " + num);

        if (!answered) {
            var element = document.getElementById(elementID);
            element.style.border = "solid red 1px";
            error[i - 1].style.color = "red";
            error[i - 1].innerHTML = "Missing required fields";
            error[i - 1].style.display = "inline";
            error[i - 1].style.padding = "0px 20px";
        } else {
            document.getElementById(elementID).style.border = "";
            error[i - 1].style.display = "none"

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



