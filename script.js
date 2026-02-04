const productForm = document.getElementById('productForm');
const productsGrid = document.getElementById('productsGrid');

// مصفوفة لتخزين المنتجات (مؤقتاً)
let products = [
    { name: "ساعة ذكية", price: 7500, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
    { name: "سماعات لاسلكية", price: 4200, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" }
];

// وظيفة لعرض المنتجات
function displayProducts() {
    productsGrid.innerHTML = '';
    products.forEach((product, index) => {
        productsGrid.innerHTML += `
            <div class="card">
                <img src="${product.img}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p style="color: #2563eb; font-weight: bold;">${product.price} دج</p>
                <button onclick="buyProduct('${product.name}')" class="btn-primary btn-buy">شراء الآن</button>
            </div>
        `;
    });
}

// إضافة منتج جديد
productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newProduct = {
        name: document.getElementById('pName').value,
        price: document.getElementById('pPrice').value,
        img: document.getElementById('pImg').value
    };

    products.push(newProduct);
    displayProducts();
    productForm.reset();
    alert("تم نشر منتجك بنجاح في DZ MARCHI!");
});

// وظيفة الشراء
function buyProduct(name) {
    alert(`شكراً لثقتك! تم إرسال طلب شراء لمنتج: ${name}. سنتواصل معك قريباً.`);
}

// تشغيل العرض عند التحميل
displayProducts();
