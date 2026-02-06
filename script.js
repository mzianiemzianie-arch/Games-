const CHAT_ID = 6726320759;
const BOT_TOKEN = "8337553232:AAHfg0kEUwdAbgqOm7Nr3d-QAftrSMKOUJM";

// زوج العملات الذي تريد التنبؤ له تلقائيًا
const PAIR = "BTC/USDT";

// الفترة الزمنية بين كل إشارة (5 دقائق)
const INTERVAL_MINUTES = 5;

// وقت مسبق قبل الإشارة (1 دقيقة)
const LEAD_MINUTES = 1;

// إرسال رسالة لتلغرام
function sendTelegram(msg) {
  if (!BOT_TOKEN) return;
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: msg
    })
  })
  .then(response => response.json())
  .then(data => console.log("Message sent:", data))
  .catch(err => console.error("Telegram error:", err));
}

// توليد الإشارة عشوائي
function generateSignal() {
  return Math.random() < 0.5 ? "⬆️ صعود" : "⬇️ نزول";
}

// دالة جدولة الإشارة تلقائيًا
function scheduleNextSignal() {
  const now = new Date();

  // حدد الوقت القادم بعد 5 دقائق
  const target = new Date(now.getTime() + INTERVAL_MINUTES * 60000);

  // خصم دقيقة واحدة للإشارة قبل الموعد
  target.setMinutes(target.getMinutes() - LEAD_MINUTES);

  const delay = target - now;

  console.log(`🔔 الإشارة التالية ستصدر بعد ${Math.round(delay/1000)} ثانية`);

  setTimeout(() => {
    const signal = generateSignal();

    console.log(`⏰ ${new Date().toLocaleTimeString()} | ${PAIR} | ${signal}`);

    // إرسال لتلغرام
    sendTelegram(
      `📊 Crypto Signal\nزوج العملات: ${PAIR}\nالإشارة: ${signal}\n⏰ ${new Date().toLocaleTimeString()}`
    );

    // تكرار العملية كل 5 دقائق
    scheduleNextSignal();
  }, delay > 0 ? delay : 0);
}

// بدء العملية تلقائيًا
scheduleNextSignal(); 
