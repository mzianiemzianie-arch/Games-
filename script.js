// Chat ID متاعك (محطوط فعليًا)
const CHAT_ID = 6726320759;

// جلب التوكن من الرابط تلقائيًا
const params = new URLSearchParams(window.location.search);
const BOT_TOKEN = params.get("token");

// عناصر
const plane = document.getElementById("plane");
const result = document.getElementById("result");

// إرسال لتلغرام
function sendTelegram(msg) {
  if (!BOT_TOKEN) return;

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: msg
    })
  });
}

// بدء الإشارة
function start() {
  result.textContent = "🔍 تحليل...";
  plane.style.transform = "translateY(-120px)";

  const x = (Math.random() * 10 + 1).toFixed(2);

  setTimeout(() => {
    result.textContent = x + "x";

    sendTelegram(
      `✈️ Aviator Signal\n📊 Result: ${x}x\n⏰ ${new Date().toLocaleTimeString()}`
    );
  }, 400);

  setTimeout(() => {
    plane.style.transform = "translateY(0)";
  }, 2200);
}
