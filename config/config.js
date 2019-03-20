import firebase from "firebase";

const config = {
  apiKey: "AIzaSyCke6BZLN1txrdkn_6qO1ybtoNh2z1_d3w",
  authDomain: "instagram-project-5d234.firebaseapp.com",
  databaseURL: "https://instagram-project-5d234.firebaseio.com",
  projectId: "instagram-project-5d234",
  storageBucket: "instagram-project-5d234.appspot.com",
  messagingSenderId: "985545927467"
};

firebase.initializeApp(config);

export const f = firebase;
export const auth = firebase.auth();
export const database = firebase.database();
export const storage = firebase.storage();
