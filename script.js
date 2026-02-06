const BOT_TOKEN = "8337553232:AAHfg0kEUwdAbgqOm7Nr3d-QAftrSMKOUJM";
const CHAT_ID = "6726320759";

const plane = document.getElementById("plane");
const signal = document.getElementById("signal");

function sendToTelegram(text) {
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text
    })
  });
}

function startRound() {
  signal.textContent = "🔍 تحليل...";
  plane.style.transform = "translateY(-120px)";

  const result = (Math.random() * 10 + 1).toFixed(2);

  setTimeout(() => {
    signal.textContent = result + "x";
    sendToTelegram(
      `✈️ Aviator Signal\n📊 النتيجة: ${result}x`
    );
  }, 300);

  setTimeout(() => {
    plane.style.transform = "translateY(0)";
  }, 2000);
} 
