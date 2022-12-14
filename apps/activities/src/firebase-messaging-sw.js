importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBrIZEqzfFDbjPThP_LfQGGjJ680nMef9M",
  authDomain: "mealprepscheduler.firebaseapp.com",
  projectId: "mealprepscheduler",
  storageBucket: "mealprepscheduler.appspot.com",
  messagingSenderId: "911796857770",
  appId: "1:911796857770:web:865f5c4f0571d5605119d3",
});


const isSupported = firebase.messaging.isSupported();
if (isSupported) {
    const messaging = firebase.messaging();
    messaging.onBackgroundMessage(payload => {
        console.log(payload)
        const body = payload.body;
        const image = payload.image;
        self.registration.showNotification(payload.title, { body, icon: image || '/assets/icons/icon-72x72.png' });
    });

    self.addEventListener('notificationclick', function(event) {
      event.notification.close();
      event.waitUntil(self.clients.openWindow(event.notification.data.url));
  });
}
