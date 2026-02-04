// إعدادات Firebase (استبدلها ببياناتك من Firebase Console)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "dz-marchi.firebaseapp.com",
    projectId: "dz-marchi",
    storageBucket: "dz-marchi.appspot.com",
    messagingSenderId: "12345678",
    appId: "1:12345678:web:abcdef"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 1. تسجيل الدخول وحفظ البيانات
async function handleAuth() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;

    try {
        const res = await auth.createUserWithEmailAndPassword(email, pass);
        await db.collection("users").doc(res.user.uid).set({ email, phone });
        alert("تم التسجيل بنجاح!");
        location.reload();
    } catch (e) {
        // إذا كان الحساب موجوداً سيقوم بتسجيل الدخول فقط
        await auth.signInWithEmailAndPassword(email, pass);
        location.reload();
    }
}

// 2. رفع منتج جديد لقاعدة البيانات
async function uploadProduct() {
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    const img = document.getElementById('pImg').value;

    if (!auth.currentUser) return alert("سجل دخولك أولاً!");

    await db.collection("products").add({
        name, price, img,
        sellerId: auth.currentUser.uid,
        sellerEmail: auth.currentUser.email
    });
    alert("تم نشر المنتج!");
}

// 3. عرض المنتجات (تحديث تلقائي)
db.collection("products").onSnapshot(snap => {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = "";
    snap.forEach(doc => {
        const p = doc.data();
        grid.innerHTML += `
            <div class="product-card card-glass">
                <img src="${p.img}">
                <h4>${p.name}</h4>
                <p>${p.price} دج</p>
                <button onclick="openChat()" class="btn-main">دردشة مع البائع</button>
            </div>
        `;
    });
});

// 4. نظام الدردشة
async function sendMessage() {
    const text = document.getElementById('msgInput').value;
    if (text && auth.currentUser) {
        await db.collection("chats").add({
            text,
            sender: auth.currentUser.email,
            time: new Date()
        });
        document.getElementById('msgInput').value = "";
    }
}

db.collection("chats").orderBy("time").onSnapshot(snap => {
    const box = document.getElementById('chatMessages');
    box.innerHTML = "";
    snap.forEach(doc => {
        const m = doc.data();
        const cls = m.sender === auth.currentUser?.email ? 'my-msg' : 'other-msg';
        box.innerHTML += `<div class="${cls}"><b>${m.sender.split('@')[0]}:</b> ${m.text}</div>`;
    });
    box.scrollTop = box.scrollHeight;
});

// وظائف مساعدة
function toggleModal(id) { document.getElementById(id).classList.toggle('hidden'); }
function openChat() { document.getElementById('chatWindow').classList.remove('hidden'); }

auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('loginNavBtn').classList.add('hidden');
        document.getElementById('userMenu').classList.remove('hidden');
        document.getElementById('welcomeName').innerText = user.email;
    }
});

function logout() { auth.signOut(); location.reload(); }
