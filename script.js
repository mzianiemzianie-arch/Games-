// ----------- بيانات الألعاب (مثال أولي، لاحقًا يمكن جلبها من السيرفر) -----------
const gamesData = [
    {name:"لعبة أكشن", desc:"وصف لعبة أكشن ممتعة", icon:"uploads/icon1.png", file:"uploads/game1.apk", category:"Action"},
    {name:"لعبة سباق", desc:"وصف لعبة سباق سريعة", icon:"uploads/icon2.png", file:"uploads/game2.apk", category:"Racing"},
    {name:"لعبة استراتيجية", desc:"وصف لعبة استراتيجية ممتعة", icon:"uploads/icon3.png", file:"uploads/game3.apk", category:"Strategy"},
    {name:"لعبة أخرى", desc:"وصف لعبة متنوعة", icon:"uploads/icon4.png", file:"uploads/game4.apk", category:"Action"},
];

const gamesList = document.getElementById('games-list');

// عرض الألعاب على الصفحة
function displayGames(games = gamesData){
    gamesList.innerHTML = '';
    games.forEach(game => {
        const card = document.createElement('div');
        card.classList.add('game-card');
        card.innerHTML = `
            <img src="${game.icon}" alt="${game.name}">
            <div class="game-card-content">
                <h3>${game.name}</h3>
                <p>${game.desc}</p>
                <a href="${game.file}" class="download-btn" download>تحميل اللعبة</a>
            </div>
        `;
        card.dataset.category = game.category;
        gamesList.appendChild(card);
    });
}

// البحث
function searchGames(){
    const input = document.getElementById('search').value.toLowerCase();
    const filtered = gamesData.filter(game => game.name.toLowerCase().includes(input));
    displayGames(filtered);
}

// الفلترة حسب التصنيف
function filterCategory(category){
    if(category === 'all'){
        displayGames();
    } else {
        const filtered = gamesData.filter(game => game.category === category);
        displayGames(filtered);
    }
}

// عند تحميل الصفحة
window.onload = () => { displayGames(); }
