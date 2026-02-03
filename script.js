// ----------- البحث عن الألعاب ----------- //
function searchGames() {
    const input = document.getElementById('search').value.toLowerCase();
    const games = document.querySelectorAll('.game-card');
    games.forEach(game => {
        const title = game.querySelector('h3').innerText.toLowerCase();
        if(title.includes(input)) {
            game.style.display = 'block';
        } else {
            game.style.display = 'none';
        }
    });
}

// ----------- يمكن إضافة وظائف تفاعلية لاحقة ----------- //
// مثال: فتح صفحة تفاصيل اللعبة عند الضغط على البطاقة
// أو استخدام AJAX لجلب البيانات من السيرفر بدون إعادة تحميل الصفحة
