// استيراد مكتبة node-fetch
const fetch = require("node-fetch");

// ===== إعدادات البوت =====
const CHAT_IDS = [6726320759]; // ضع هنا كل ID تريد إرسال الإشارات له
const BOT_TOKEN = "8337553232:AAHfg0kEUwdAbgqOm7Nr3d-QAftrSMKOUJM"; // ضع توكن البوت هنا

// إعدادات العملة والفترة
const PAIR = "BTCUSDT";       // زوج العملات في Binance
const INTERVAL_MINUTES = 5;   // كل 5 دقائق
const LEAD_MINUTES = 1;       // إرسال الإشارة قبل دقيقة
const SMA_PERIOD = 3;         // عدد الشموع لحساب SMA (مثال 3 شموع)

// إرسال رسالة لتلغرام لكل شخص في القائمة
function sendTelegram(msg) {
  CHAT_IDS.forEach(id => {
    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: id, text: msg })
    })
    .then(res => res.json())
    .then(data => console.log("Message sent to", id))
    .catch(err => console.error("Telegram error:", err));
  });
}

// حساب SMA
function calculateSMA(prices) {
  const sum = prices.reduce((a, b) => a + b, 0);
  return sum / prices.length;
}

// جلب بيانات الشموع من Binance
async function getPriceData() {
  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${PAIR}&interval=1m&limit=${SMA_PERIOD}`
    );
    const data = await response.json();
    // نأخذ أسعار الإغلاق
    const closePrices = data.map(candle => parseFloat(candle[4]));
    return closePrices;
  } catch (err) {
    console.error("Error fetching price data:", err);
    return null;
  }
}

// توليد الإشارة الذكية بناءً على SMA
async function generateSignal() {
  const prices = await getPriceData();
  if (!prices) return "⚠️ خطأ في قراءة الأسعار";

  const lastPrice = prices[prices.length - 1];
  const sma = calculateSMA(prices);

  return lastPrice > sma ? "⬆️ صعود" : "⬇️ نزول";
}

// جدولة الإشارة التالية تلقائيًا
function scheduleNextSignal() {
  const now = new Date();
  const target = new Date(now.getTime() + INTERVAL_MINUTES * 60000);
  target.setMinutes(target.getMinutes() - LEAD_MINUTES);
  const delay = target - now;

  console.log(`🔔 الإشارة التالية بعد ${Math.round(delay / 1000)} ثانية`);

  setTimeout(async () => {
    const signal = await generateSignal();
    const currentTime = new Date().toLocaleTimeString();

    console.log(`⏰ ${currentTime} | ${PAIR} | ${signal}`);

    sendTelegram(
      `📊 Crypto Signal\nزوج العملات: ${PAIR}\nالإشارة: ${signal}\n⏰ ${currentTime}`
    );

    // إعادة جدولة الإشارة التالية
    scheduleNextSignal();
  }, delay > 0 ? delay : 0);
}

// بدء البوت
console.log("🤖 Crypto Smart Signal Bot Started!");
scheduleNextSignal();
