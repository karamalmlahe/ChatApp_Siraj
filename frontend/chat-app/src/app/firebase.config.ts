import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
    apiKey: "AIzaSyA4GcqGi5V0nTvM5y1EkF7DSZBmIj1ujpM",
    authDomain: "chat-app-8bfb8.firebaseapp.com",
    projectId: "chat-app-8bfb8",
    storageBucket: "chat-app-8bfb8.firebasestorage.app",
    messagingSenderId: "358397484265",
    appId: "1:358397484265:web:6604b9088a558d23e8e478",
    measurementId: "G-BT8R480VNR"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;
