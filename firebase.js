
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth,getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCUDkiCG2gpv3LgJkf8a_wqzxMhkN9U96w",
  authDomain: "hotel-booking-5b9b0.firebaseapp.com",
  projectId: "hotel-booking-5b9b0",
  storageBucket: "hotel-booking-5b9b0.appspot.com",
  messagingSenderId: "324040521946",
  appId: "1:324040521946:web:a122eb172fdc7ec7f6cde3",
  measurementId: "G-P8D8WRJEWE"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore();


export{db};


export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});