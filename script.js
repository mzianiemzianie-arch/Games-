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
const storage = firebase.storage(); // For image uploads

// 1. وظائف الـ UI والتنقل
document.addEventListener('DOMContentLoaded', () => {
    // Initial setup if needed
    // You might want to automatically show the auth modal if no user is logged in
    auth.onAuthStateChanged(user => {
        if (!user) {
            toggleAuthModal();
        } else {
            console.log("Logged in as:", user.email);
            // Update UI for logged-in user if needed
            listenForMessages('realtime-chat-section'); // Start listening for chat in embedded chat
            listenForMessages('fullChatMessages'); // Start listening for chat in full chat window
        }
    });
    // Set initial active tab
    showCategory('new');
});

function toggleAuthModal() {
    document.getElementById('authModal').classList.toggle('hidden');
}

function toggleChatWindow() {
    document.getElementById('chatWindow').classList.toggle('hidden');
}

function showCategory(category) {
    // This is a placeholder. In a real app, you'd filter products by category.
    // For now, it just changes active button style.
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.tab-button[onclick="showCategory('${category}')"]`).classList.add('active');

    // You would then fetch/filter products based on 'category' and update 'productsGrid'
    console.log(`Showing category: ${category}`);
}


// 2. نظام تسجيل الدخول والحفظ
async function handleAuth() {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;

    if (!email || !pass) {
        alert("البريد الإلكتروني وكلمة المرور ضروريان.");
        return;
    }

    try {
        let userCredential;
        try {
            // Try to sign in first (if user exists)
            userCredential = await auth.signInWithEmailAndPassword(email, pass);
        } catch (signInError) {
            // If sign-in fails, try to create user
            if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/wrong-password') {
                userCredential = await auth.createUserWithEmailAndPassword(email, pass);
                // Save phone number for new user
                if (phone) {
                    await db.collection("users").doc(userCredential.user.uid).set({ email, phone });
                }
                alert("تم إنشاء حساب جديد وتسجيل الدخول بنجاح!");
            } else {
                throw signInError; // Re-throw other sign-in errors
            }
        }
        
        console.log("User logged in:", userCredential.user.email);
        toggleAuthModal(); // Close modal on successful auth
        // UI updates will be handled by onAuthStateChanged listener
    } catch (e) {
        alert("خطأ في المصادقة: " + e.message);
    }
}

function logout() {
    auth.signOut().then(() => {
        console.log("User logged out");
        location.reload(); // Refresh to show login state
    }).catch(error => {
        console.error("Logout error:", error);
    });
}


// 3. رفع المنتجات مع دعم الصور
async function uploadProduct() {
    const name = document.getElementById('pName').value;
    const price = document.getElementById('pPrice').value;
    const imgUrl = document.getElementById('pImg').value; // URL field
    const fileInput = document.getElementById('pFileUpload');
    const imageFile = fileInput.files[0]; // File upload field

    if (!auth.currentUser) {
        alert("يرجى تسجيل الدخول لنشر منتج.");
        return;
    }
    if (!name || !price || (!imgUrl && !imageFile)) {
        alert("يرجى ملء جميع الحقول أو رفع صورة.");
        return;
    }

    let finalImageUrl = imgUrl;

    if (imageFile) {
        try {
            const storageRef = storage.ref(`product_images/${auth.currentUser.uid}/${imageFile.name}`);
            const uploadTask = storageRef.put(imageFile);
            await uploadTask;
            finalImageUrl = await storageRef.getDownloadURL();
            alert("تم رفع الصورة بنجاح!");
        } catch (error) {
            alert("فشل رفع الصورة: " + error.message);
            console.error("Image upload error:", error);
            return;
        }
    }

    try {
        await db.collection("products").add({
            name,
            price: parseFloat(price), // Ensure price is a number
            img: finalImageUrl,
            sellerId: auth.currentUser.uid,
            sellerEmail: auth.currentUser.email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("تم نشر المنتج بنجاح!");
        // Clear form
        document.getElementById('pName').value = '';
        document.getElementById('pPrice').value = '';
        document.getElementById('pImg').value = '';
        fileInput.value = ''; // Clear file input
    } catch (error) {
        alert("فشل نشر المنتج: " + error.message);
        console.error("Product upload error:", error);
    }
}


// 4. عرض المنتجات (تحديث تلقائي)
db.collection("products").orderBy("timestamp", "desc").onSnapshot(snapshot => {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = ''; // Clear existing products

    snapshot.forEach(doc => {
        const product = doc.data();
        const productId = doc.id; // Get product ID for potential future use (e.g., specific chat)
        productsGrid.innerHTML += `
            <div class="product-card glass-effect">
                <img src="${product.img}" alt="${product.name}">
                <h4>${product.name}</h4>
                <p>${product.price} دج</p>
                <button class="btn-buy" onclick="initiateChatWithSeller('${product.sellerId}', '${product.sellerEmail}')">شراء</button>
            </div>
        `;
    });
});

function initiateChatWithSeller(sellerId, sellerEmail) {
    // In a real app, you'd create a specific chat room for buyer-seller
    // For this example, we'll just open the main chat window and pre-fill a message
    toggleChatWindow();
    document.getElementById('fullMsgInput').value = `مرحباً، أنا مهتم بالمنتج الذي تبيعه: ... (من ${sellerEmail})`;
    alert(`تم فتح الدردشة مع ${sellerEmail.split('@')[0]}.`);
}


// 5. نظام الدردشة الفورية (مدمج ونافذة كاملة)
async function sendMessage() {
