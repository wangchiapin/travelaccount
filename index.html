/* ========= Firebase config ========= */
/* 建立你自己的 Firebase 專案（Firestore + Email/Password 登入）後，
   到「專案設定」複製 firebaseConfig 貼在這裡取代下面的值 */
const firebaseConfig = {
  apiKey: "AIzaSyAn7hS0kKHB9gz5mOa-Ywlifz-N630OjYc",
  authDomain: "travelaccount-1b4a7.firebaseapp.com",
  projectId: "travelaccount-1b4a7",
  storageBucket: "travelaccount-1b4a7.firebasestorage.app",
  messagingSenderId: "752586347313",
  appId: "1:752586347313:web:69a937a4721f220a591610",
  measurementId: "G-F3KER8RD42"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

/* ========= constants ========= */
const DEFAULT_CATEGORIES = ["交通", "住宿", "食物", "景點", "購物", "退稅", "其他"];
const DEFAULT_PAYMENT_METHODS = ["現金", "信用卡", "行動支付", "外幣帳戶"];
const DEFAULT_PARTICIPANTS = [
  { id: "husband", name: "老公" },
  { id: "wife", name: "老婆" }
];
const RAMPS = [
  { bg: "var(--brick-tint)", fg: "var(--brick-dark)" },
  { bg: "var(--jade-tint)", fg: "var(--jade-dark)" },
  { bg: "var(--gold-tint)", fg: "var(--gold)" }
];
const CATEGORY_PHRASES = {
  "交通": ["移動也是旅行的一部分！🚃", "下一站，冒險繼續！🧳", "安全抵達最重要 🛫"],
  "住宿": ["今晚好好睡一覺～🛏️", "累了就該善待自己 🧸", "睡得好，玩得更好 💤"],
  "食物": ["美食不能辜負！🍡", "吃飽才有力氣繼續玩 🍜", "旅行的意義就是吃！🧋"],
  "景點": ["回憶又多一頁 📸", "這風景，值得！🌸", "打卡成功～✨"],
  "購物": ["買起來吧！🛍️", "旅遊就是要買買買 🎀", "戰利品 +1 🧸"],
  "其他": ["小開銷，搞定！🌷", "生活雜項也要記一筆 📝"]
};
const SPLIT_FALSE_PHRASES = ["犒賞自己，值得！🎁", "偷偷寵愛自己一下 🍬", "這筆算我的，開心就好 🌈"];
const REFUND_PHRASES = ["退錢真開心！💰", "賺到了！🎉"];
function showCheer(category, splitEven, total) {
  let pool;
  if (total < 0) pool = REFUND_PHRASES;
  else if (splitEven === false) pool = SPLIT_FALSE_PHRASES;
  else pool = CATEGORY_PHRASES[category] || CATEGORY_PHRASES["其他"];
  const msg = pool[Math.floor(Math.random() * pool.length)];
  const root = $("#cheer-root");
  const el = document.createElement("div");
  el.className = "cheer-popup";
  el.textContent = msg;
  root.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 300);
  }, 2000);
}
const ICONS = {
  plus: "M12 5v14M5 12h14",
  back: "M15 18l-6-6 6-6"
};

/* ========= state ========= */
let currentUser = null;
let currentHouseholdId = null;
let currentHousehold = null;
let unsubUserProfile = null;
let unsubHouseholdDoc = null;
let unsubTrips = null;
let unsubExpenses = null;
let trips = [];
let currentTripId = null;
let currentTrip = null;
let currentExpenses = [];
let currentExchanges = [];
let currentSettlements = [];
let currentQuicknotes = [];
let unsubExchanges = null;
let unsubSettlements = null;
let unsubQuicknotes = null;
let currentTab = "ledger";
let ledgerFilters = { payerId: "", splitEven: "", currency: "", from: "", to: "", min: "", max: "", text: "" };
let filterPanelOpen = false;
let pendingLedgerScroll = false;
let qnCandidates = [];
let qnFails = [];
let qnDbChecked = {};

/* ========= helpers ========= */
function $(sel) { return document.querySelector(sel); }
function $all(sel) { return document.querySelectorAll(sel); }
function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }
function hashColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return RAMPS[Math.abs(h) % RAMPS.length];
}
function fmt(n) {
  n = Math.round(n || 0);
  return n.toLocaleString("zh-Hant");
}
function toast(msg) {
  const root = $("#toast-root");
  root.innerHTML = `<div class="toast">${escapeHtml(msg)}</div>`;
  setTimeout(() => { root.innerHTML = ""; }, 2200);
}
function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}
function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

/* currency conversion: TWD is always the base currency (rate 1) */
function toTwd(amount, currencyCode, trip) {
  amount = Number(amount) || 0;
  if (currencyCode === "TWD") return amount;
  const c = (trip.currencies || []).find(x => x.code === currencyCode);
  const rate = c ? Number(c.rate) || 0 : 0;
  return amount * rate;
}

/* ========= auth ========= */
$("#btn-login").addEventListener("click", () => {
  const email = $("#login-email").value.trim();
  const pass = $("#login-pass").value;
  $("#login-error").textContent = "";
  auth.signInWithEmailAndPassword(email, pass).catch(e => {
    $("#login-error").textContent = translateAuthError(e);
  });
});
$("#btn-register").addEventListener("click", () => {
  const email = $("#login-email").value.trim();
  const pass = $("#login-pass").value;
  $("#login-error").textContent = "";
  if (!email || pass.length < 6) {
    $("#login-error").textContent = "請輸入 email，密碼至少 6 碼";
    return;
  }
  auth.createUserWithEmailAndPassword(email, pass).catch(e => {
    $("#login-error").textContent = translateAuthError(e);
  });
});
function translateAuthError(e) {
  const map = {
    "auth/invalid-email": "email 格式不正確",
    "auth/user-not-found": "找不到這個帳號",
    "auth/wrong-password": "密碼錯誤",
    "auth/email-already-in-use": "這個 email 已經註冊過了",
    "auth/weak-password": "密碼太簡單，至少要 6 碼",
    "auth/invalid-credential": "帳號或密碼錯誤"
  };
  return map[e.code] || e.message;
}

auth.onAuthStateChanged(user => {
  currentUser = user;
  ["screen-login", "screen-household", "screen-trips", "screen-trip"].forEach(id => hide($("#" + id)));
  if (unsubUserProfile) unsubUserProfile();
  if (unsubHouseholdDoc) unsubHouseholdDoc();
  if (unsubTrips) unsubTrips();
  if (unsubExpenses) unsubExpenses();
  if (user) {
    listenUserProfile();
  } else {
    currentHouseholdId = null; currentHousehold = null;
    show($("#screen-login"));
  }
});

function listenUserProfile() {
  unsubUserProfile = db.collection("users").doc(currentUser.uid).onSnapshot(doc => {
    const data = doc.data();
    if (data && data.householdId) {
      currentHouseholdId = data.householdId;
      listenHousehold();
    } else {
      currentHouseholdId = null; currentHousehold = null;
      ["screen-trips", "screen-trip"].forEach(id => hide($("#" + id)));
      show($("#screen-household"));
    }
  }, () => toast("讀取帳號資料失敗"));
}

function listenHousehold() {
  if (unsubHouseholdDoc) unsubHouseholdDoc();
  unsubHouseholdDoc = db.collection("households").doc(currentHouseholdId).onSnapshot(doc => {
    if (!doc.exists) return;
    currentHousehold = { id: doc.id, ...doc.data() };
    $("#household-title").textContent = currentHousehold.name || "旅費帳本";
    hide($("#screen-household"));
    show($("#screen-trips"));
    listenTrips();
  }, () => toast("讀取家庭帳本失敗"));
}

/* ---- create / join household ---- */
$("#btn-create-household").addEventListener("click", async () => {
  const name = $("#hh-name").value.trim();
  $("#household-error").textContent = "";
  if (!name) { $("#household-error").textContent = "請輸入家庭帳本名稱"; return; }
  try {
    const doc = await db.collection("households").add({
      name, members: [currentUser.uid],
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    await db.collection("users").doc(currentUser.uid).set({ householdId: doc.id }, { merge: true });
  } catch (e) {
    $("#household-error").textContent = "建立失敗，請稍後再試";
  }
});
$("#btn-join-household").addEventListener("click", async () => {
  const code = $("#hh-code").value.trim();
  $("#household-error").textContent = "";
  if (!code) { $("#household-error").textContent = "請輸入邀請碼"; return; }
  try {
    const doc = await db.collection("households").doc(code).get();
    if (!doc.exists) { $("#household-error").textContent = "找不到這組邀請碼"; return; }
    await db.collection("households").doc(code).update({
      members: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
    });
    await db.collection("users").doc(currentUser.uid).set({ householdId: code }, { merge: true });
  } catch (e) {
    $("#household-error").textContent = "加入失敗，請確認邀請碼是否正確";
  }
});
$("#btn-household-logout").addEventListener("click", () => auth.signOut());

$("#btn-invite").addEventListener("click", () => {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-sheet">
      <div class="modal-head"><h2>邀請碼</h2><button class="icon-btn" id="m-close">✕</button></div>
      <p style="font-size:13px;color:var(--ink-soft);line-height:1.6;">把這組邀請碼給另一半，他登入後在「建立或加入家庭帳本」畫面貼上，就能看到同一套帳本。</p>
      <div class="field">
        <input id="invite-code" value="${escapeHtml(currentHouseholdId)}" readonly style="text-align:center;font-size:16px;letter-spacing:1px;">
      </div>
      <button class="btn btn-primary btn-block" id="btn-copy-code">複製邀請碼</button>
    </div>`;
  $("#modal-root").appendChild(modal);
  modal.querySelector("#m-close").addEventListener("click", () => modal.remove());
  modal.querySelector("#btn-copy-code").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(currentHouseholdId);
      toast("已複製");
    } catch (e) {
      modal.querySelector("#invite-code").select();
      toast("請手動複製");
    }
  });
});

/* ========= trips collection (shared per household) ========= */
function tripsRef() {
  return db.collection("households").doc(currentHouseholdId).collection("trips");
}
function expensesRef(tripId) {
  return tripsRef().doc(tripId).collection("expenses");
}
function exchangesRef(tripId) {
  return tripsRef().doc(tripId).collection("exchanges");
}
function settlementsRef(tripId) {
  return tripsRef().doc(tripId).collection("settlements");
}
function quicknotesRef(tripId) {
  return tripsRef().doc(tripId).collection("quicknotes");
}

function listenTrips() {
  if (unsubTrips) unsubTrips();
  unsubTrips = tripsRef().orderBy("startDate", "desc").onSnapshot(snap => {
    trips = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if ($("#screen-trips").classList.contains("hidden") === false) renderTripsList();
  }, err => toast("讀取旅行清單失敗"));
}

function renderTripsList() {
  const root = $("#trips-list");
  if (trips.length === 0) {
    root.innerHTML = `<div class="empty"><p>還沒有旅行紀錄。<br>建立第一趟旅行，開始記帳。</p></div>`;
    return;
  }
  root.innerHTML = trips.map(t => {
    const total = t._cachedTotal != null ? t._cachedTotal : null;
    return `
      <div class="trip-card" data-id="${t.id}">
        <h3>${escapeHtml(t.name)}</h3>
        <div class="dates">${escapeHtml(t.startDate || "")}${t.endDate ? " – " + escapeHtml(t.endDate) : ""}</div>
        <div class="total"><span class="unit">台幣</span>${total == null ? "—" : fmt(total)}</div>
      </div>`;
  }).join("");
  $all(".trip-card").forEach(card => {
    card.addEventListener("click", () => openTrip(card.dataset.id));
  });
}

/* create trip */
$("#btn-new-trip").addEventListener("click", () => {
  openTripEditModal(null);
});

function openTripEditModal(trip) {
  const isNew = !trip;
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-sheet">
      <div class="modal-head"><h2>${isNew ? "新增旅行" : "旅行資訊"}</h2>
        <button class="icon-btn" id="m-close">✕</button></div>
      <div class="field"><label>旅行名稱</label><input id="f-name" value="${isNew ? "" : escapeHtml(trip.name)}" placeholder="例如：東京 2026"></div>
      <div class="field"><label>開始日期</label><input id="f-start" type="date" value="${isNew ? "" : trip.startDate || ""}"></div>
      <div class="field"><label>結束日期</label><input id="f-end" type="date" value="${isNew ? "" : trip.endDate || ""}"></div>
      <button class="btn btn-primary btn-block" id="f-save">${isNew ? "建立旅行" : "儲存"}</button>
    </div>`;
  $("#modal-root").appendChild(modal);
  modal.querySelector("#m-close").addEventListener("click", () => modal.remove());
  modal.querySelector("#f-save").addEventListener("click", async () => {
    const name = modal.querySelector("#f-name").value.trim();
    const startDate = modal.querySelector("#f-start").value;
    const endDate = modal.querySelector("#f-end").value;
    if (!name) { toast("請輸入旅行名稱"); return; }
    if (isNew) {
      const doc = await tripsRef().add({
        name, startDate, endDate,
        currencies: [{ code: "TWD", name: "台幣", rate: 1 }],
        participants: DEFAULT_PARTICIPANTS,
        categories: DEFAULT_CATEGORIES,
        paymentMethods: DEFAULT_PAYMENT_METHODS,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      modal.remove();
      openTrip(doc.id);
    } else {
      await tripsRef().doc(trip.id).update({ name, startDate, endDate });
      modal.remove();
    }
  });
}

/* ========= open a trip ========= */
function openTrip(id) {
  currentTripId = id;
  currentTab = "ledger";
  ledgerFilters = { payerId: "", splitEven: "", currency: "", from: "", to: "", min: "", max: "", text: "" };
  filterPanelOpen = false;
  pendingLedgerScroll = true;
  $all(".tabbar button").forEach(b => b.classList.toggle("active", b.dataset.tab === "ledger"));
  hide($("#screen-trips"));
  show($("#screen-trip"));
  if (unsubExpenses) unsubExpenses();
  if (unsubExchanges) unsubExchanges();
  if (unsubSettlements) unsubSettlements();
  if (unsubQuicknotes) unsubQuicknotes();
  unsubExpenses = expensesRef(id).orderBy("date", "desc").onSnapshot(snap => {
    currentExpenses = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderCurrentTab();
  }, () => toast("讀取花費失敗"));
  unsubExchanges = exchangesRef(id).orderBy("date", "desc").onSnapshot(snap => {
    currentExchanges = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (currentTab === "exchange") renderCurrentTab();
  }, () => toast("讀取換匯紀錄失敗"));
  unsubSettlements = settlementsRef(id).orderBy("date", "desc").onSnapshot(snap => {
    currentSettlements = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (currentTab === "settle") renderCurrentTab();
  }, () => toast("讀取結清紀錄失敗"));
  unsubQuicknotes = quicknotesRef(id).orderBy("createdAt", "asc").onSnapshot(snap => {
    currentQuicknotes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    if (currentTab === "quicknote") renderCurrentTab();
  }, () => toast("讀取隨手記失敗"));
  unsubTripDoc();
}
let unsubTripDocFn = null;
function unsubTripDoc() {
  if (unsubTripDocFn) unsubTripDocFn();
  unsubTripDocFn = tripsRef().doc(currentTripId).onSnapshot(d => {
    if (!d.exists) return;
    currentTrip = { id: d.id, ...d.data() };
    $("#trip-title").textContent = currentTrip.name;
    renderCurrentTab();
  });
}

$("#btn-back-trips").addEventListener("click", () => {
  if (unsubExpenses) unsubExpenses();
  if (unsubExchanges) unsubExchanges();
  if (unsubSettlements) unsubSettlements();
  if (unsubQuicknotes) unsubQuicknotes();
  if (unsubTripDocFn) unsubTripDocFn();
  currentTripId = null; currentTrip = null; currentExpenses = []; currentExchanges = []; currentSettlements = []; currentQuicknotes = [];
  hide($("#screen-trip"));
  show($("#screen-trips"));
  renderTripsList();
});
$("#btn-logout").addEventListener("click", () => auth.signOut());

$all(".tabbar button").forEach(btn => {
  btn.addEventListener("click", () => {
    currentTab = btn.dataset.tab;
    if (currentTab === "ledger") pendingLedgerScroll = true;
    $all(".tabbar button").forEach(b => b.classList.toggle("active", b === btn));
    renderCurrentTab();
  });
});

function renderCurrentTab() {
  if (!currentTrip) return;
  ["ledger", "settle", "exchange", "quicknote", "settings"].forEach(t => {
    (t === currentTab ? show : hide)($("#tab-" + t));
  });
  if (currentTab === "ledger") renderLedger();
  if (currentTab === "settle") renderSettle();
  if (currentTab === "exchange") renderExchange();
  if (currentTab === "quicknote") renderQuicknote();
  if (currentTab === "settings") renderSettings();
}

/* ========= ledger tab ========= */
function applyLedgerFilters(list) {
  const f = ledgerFilters;
  return list.filter(e => {
    if (f.payerId && e.payerId !== f.payerId && !(e.splits || []).some(s => s.payerId === f.payerId)) return false;
    if (f.splitEven === "even" && e.splitEven === false) return false;
    if (f.splitEven === "personal" && e.splitEven !== false) return false;
    if (f.currency && e.currency !== f.currency) return false;
    if (f.from && e.date < f.from) return false;
    if (f.to && e.date > f.to) return false;
    const total = (e.twd || 0) + (e.fee || 0);
    if (f.min !== "" && total < Number(f.min)) return false;
    if (f.max !== "" && total > Number(f.max)) return false;
    if (f.text) {
      const hay = ((e.name || "") + " " + (e.note || "") + " " + (e.category || "")).toLowerCase();
      if (!hay.includes(f.text.toLowerCase())) return false;
    }
    return true;
  });
}

function filterPanelHtml() {
  const participants = currentTrip.participants || [];
  const currencies = currentTrip.currencies || [];
  const f = ledgerFilters;
  return `
    <div class="filter-panel">
      <div class="filter-row"><label>搜尋名稱／備註／類別</label><input id="ff-text" value="${escapeHtml(f.text)}" placeholder="輸入關鍵字"></div>
      <div class="filter-row"><label>支出人</label>
        <div class="chip-row">
          <button type="button" class="chip${f.payerId === "" ? " active" : ""}" data-payer="">全部</button>
          ${participants.map(p => `<button type="button" class="chip${f.payerId === p.id ? " active" : ""}" data-payer="${p.id}">${escapeHtml(p.name)}</button>`).join("")}
        </div>
      </div>
      <div class="filter-row"><label>是否分攤</label>
        <div class="chip-row">
          <button type="button" class="chip${f.splitEven === "" ? " active" : ""}" data-split="">全部</button>
          <button type="button" class="chip${f.splitEven === "even" ? " active" : ""}" data-split="even">列入均分</button>
          <button type="button" class="chip${f.splitEven === "personal" ? " active" : ""}" data-split="personal">個人不分攤</button>
        </div>
      </div>
      <div class="filter-row"><label>幣別</label>
        <div class="chip-row">
          <button type="button" class="chip${f.currency === "" ? " active" : ""}" data-cur="">全部</button>
          ${currencies.map(c => `<button type="button" class="chip${f.currency === c.code ? " active" : ""}" data-cur="${c.code}">${escapeHtml(c.code)}</button>`).join("")}
        </div>
      </div>
      <div class="filter-row"><label>日期範圍</label>
        <div class="filter-range"><input id="ff-from" type="date" value="${f.from}"><span>–</span><input id="ff-to" type="date" value="${f.to}"></div>
      </div>
      <div class="filter-row"><label>金額範圍（台幣）</label>
        <div class="filter-range"><input id="ff-min" type="number" placeholder="最少" value="${f.min}"><span>–</span><input id="ff-max" type="number" placeholder="最多" value="${f.max}"></div>
      </div>
      <button class="btn btn-sm btn-block" id="ff-clear" style="margin-top:4px;">清除篩選</button>
    </div>`;
}

function renderLedger() {
  const root = $("#tab-ledger");
  const filtered = applyLedgerFilters(currentExpenses);
  const hasFilters = JSON.stringify(ledgerFilters) !== JSON.stringify({ payerId: "", splitEven: "", currency: "", from: "", to: "", min: "", max: "", text: "" });

  let html = `<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px;">
    <button class="btn btn-sm" id="btn-toggle-filter">🔍 篩選${hasFilters ? "（篩選中）" : ""}</button>
  </div>`;
  if (filterPanelOpen) html += filterPanelHtml();

  const subtotalList = hasFilters ? filtered : currentExpenses;
  const subtotal = subtotalList.reduce((s, e) => s + (e.twd || 0) + (e.fee || 0), 0);
  html += `<div class="subtotal-bar always"><span>${hasFilters ? `符合條件 ${filtered.length} 筆` : "旅遊支出總計"}</span><span class="n">台幣 ${fmt(subtotal)}</span></div>`;

  if (filtered.length === 0) {
    html += `<div class="empty"><p>${currentExpenses.length === 0 ? "這趟旅行還沒有花費紀錄。<br>按下方「新增一筆」開始記帳。" : "沒有符合篩選條件的紀錄。"}</p></div>`;
    root.innerHTML = html;
    wireFilterEvents(root);
    return;
  }

  const byDay = {};
  filtered.forEach(e => {
    const d = e.date || "未填日期";
    (byDay[d] = byDay[d] || []).push(e);
  });
  const days = Object.keys(byDay).sort(); // ascending: oldest first, newest last
  const needsScroll = filtered.length > 10;
  html += `<div class="${needsScroll ? "ledger-scroll" : ""}" id="ledger-list" style="${needsScroll ? "max-height:62vh;" : ""}">`;
  html += days.map(day => {
    const items = byDay[day];
    const dayTotal = items.reduce((s, e) => s + (e.twd || 0) + (e.fee || 0), 0);
    return `
      <div class="day-group">
        <div class="day-head"><span class="d">${escapeHtml(day)}</span><span class="t">台幣 ${fmt(dayTotal)}</span></div>
        ${items.map(e => entryRow(e)).join("")}
      </div>`;
  }).join("");
  html += `</div>`;

  root.innerHTML = html;
  wireFilterEvents(root);
  $all(".entry", root).forEach(row => {
    row.addEventListener("click", () => {
      const exp = currentExpenses.find(e => e.id === row.dataset.id);
      if (exp) openExpenseModal(exp);
    });
  });

  if (pendingLedgerScroll) {
    pendingLedgerScroll = false;
    const listEl = root.querySelector("#ledger-list");
    requestAnimationFrame(() => {
      if (listEl && needsScroll) {
        listEl.scrollTop = listEl.scrollHeight;
      } else if (listEl) {
        listEl.scrollIntoView({ block: "end" });
        window.scrollTo(0, document.body.scrollHeight);
      }
    });
  }
}

function wireFilterEvents(root) {
  const toggle = $("#btn-toggle-filter", root) || root.querySelector("#btn-toggle-filter");
  if (toggle) toggle.addEventListener("click", () => { filterPanelOpen = !filterPanelOpen; renderLedger(); });
  const panel = root.querySelector(".filter-panel");
  if (!panel) return;
  panel.querySelectorAll("[data-payer]").forEach(b => b.addEventListener("click", () => { ledgerFilters.payerId = b.dataset.payer; renderLedger(); }));
  panel.querySelectorAll("[data-split]").forEach(b => b.addEventListener("click", () => { ledgerFilters.splitEven = b.dataset.split; renderLedger(); }));
  panel.querySelectorAll("[data-cur]").forEach(b => b.addEventListener("click", () => { ledgerFilters.currency = b.dataset.cur; renderLedger(); }));
  const textInput = panel.querySelector("#ff-text");
  textInput.addEventListener("input", () => { ledgerFilters.text = textInput.value; });
  textInput.addEventListener("change", () => renderLedger());
  panel.querySelector("#ff-from").addEventListener("change", e => { ledgerFilters.from = e.target.value; renderLedger(); });
  panel.querySelector("#ff-to").addEventListener("change", e => { ledgerFilters.to = e.target.value; renderLedger(); });
  panel.querySelector("#ff-min").addEventListener("change", e => { ledgerFilters.min = e.target.value; renderLedger(); });
  panel.querySelector("#ff-max").addEventListener("change", e => { ledgerFilters.max = e.target.value; renderLedger(); });
  panel.querySelector("#ff-clear").addEventListener("click", () => {
    ledgerFilters = { payerId: "", splitEven: "", currency: "", from: "", to: "", min: "", max: "", text: "" };
    renderLedger();
  });
}

function entryRow(e) {
  const cat = e.category || "其他";
  const c = hashColor(cat);
  const total = (e.twd || 0) + (e.fee || 0);
  const noteTag = e.splitEven === false ? " · 不分攤" : "";
  const methodTag = e.paymentMethod ? " · " + escapeHtml(e.paymentMethod) : "";
  const taxTag = e.taxRefundable ? " · 🧾可退稅" : "";
  const needsReview = e.quickAdd === true && (!e.paymentMethod || (!e.payerId && !(e.splits && e.splits.length)));
  let sideHtml;
  if (e.splits && e.splits.length) {
    sideHtml = e.splits.map(s => {
      const p = (currentTrip.participants || []).find(x => x.id === s.payerId);
      const col = hashColor(s.payerId);
      return `<span class="badge" style="background:${col.bg};color:${col.fg};">${escapeHtml(p ? p.name : "?")} ${fmt(s.amount)}</span>`;
    }).join(" ");
  } else {
    const payer = (currentTrip.participants || []).find(p => p.id === e.payerId);
    const payerColor = hashColor(payer ? payer.id : "?");
    sideHtml = payer ? `<span class="badge" style="background:${payerColor.bg};color:${payerColor.fg};">${escapeHtml(payer.name)}</span>` : "";
  }
  return `
    <div class="entry${needsReview ? " quick-pending" : ""}" data-id="${e.id}">
      <div class="cat-dot" style="background:${c.bg};color:${c.fg};">${escapeHtml(cat.slice(0, 2))}</div>
      <div class="entry-main">
        <div class="name">${escapeHtml(e.name || "")}${total < 0 ? " (退款)" : ""}${needsReview ? " 📝" : ""}</div>
        <div class="meta">${escapeHtml(cat)}${methodTag}${noteTag}${taxTag}</div>
      </div>
      <div class="entry-side">
        <div class="amt">台幣 ${fmt(total)}</div>
        ${e.currency && e.currency !== "TWD" ? `<div style="font-size:11px;color:var(--muted);">${fmt(e.amount)} ${escapeHtml(e.currency)}</div>` : ""}
        ${sideHtml}
      </div>
    </div>`;
}

$("#btn-add-expense").addEventListener("click", () => openExpenseModal(null));

/* ========= add / edit expense modal ========= */
function openExpenseModal(existing) {
  const isNew = !existing;
  const cats = currentTrip.categories || DEFAULT_CATEGORIES;
  const currencies = currentTrip.currencies || [{ code: "TWD", name: "台幣", rate: 1 }];
  const participants = currentTrip.participants || DEFAULT_PARTICIPANTS;
  const methods = currentTrip.paymentMethods || DEFAULT_PAYMENT_METHODS;

  let state = {
    date: existing ? existing.date : (currentExpenses[0] ? currentExpenses[0].date : todayStr()),
    category: existing ? existing.category : cats[0],
    name: existing ? existing.name : "",
    currency: existing ? existing.currency : currencies[0].code,
    amount: existing ? existing.amount : "",
    fee: existing ? existing.fee || "" : "",
    paymentMethod: existing ? (existing.paymentMethod || "") : "",
    payerId: existing ? existing.payerId : participants[0].id,
    splitEven: existing ? existing.splitEven !== false : true,
    note: existing ? existing.note || "" : "",
    taxRefundable: existing ? !!existing.taxRefundable : false,
    multiPayer: !!(existing && existing.splits && existing.splits.length),
    splits: existing && existing.splits ? existing.splits.map(s => ({ ...s })) : participants.map(p => ({ payerId: p.id, amount: "" }))
  };

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-sheet">
      <div class="modal-head"><h2>${isNew ? "新增支出" : "編輯支出"}</h2>
        <button class="icon-btn" id="m-close">✕</button></div>

      <div class="field"><label>日期</label><input id="f-date" type="date" value="${state.date}"></div>

      <div class="field"><label>類別</label>
        <div class="chip-row" id="f-cats">
          ${cats.map(c => `<button type="button" class="chip${c === state.category ? " active" : ""}" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`).join("")}
          <button type="button" class="chip" id="f-cat-add">＋ 自訂</button>
        </div>
      </div>

      <div class="field"><label>名稱</label><input id="f-name" value="${escapeHtml(state.name)}" placeholder="例如：御殿場滑雪襪"></div>

      <div class="field"><label>金額（退款可輸入負數）</label>
        <div class="amount-row">
          <select id="f-currency">
            ${currencies.map(c => `<option value="${c.code}"${c.code === state.currency ? " selected" : ""}>${escapeHtml(c.code)}</option>`).join("")}
          </select>
          <input id="f-amount" type="number" inputmode="decimal" placeholder="0" value="${state.amount}">
        </div>
        <div class="convert-hint" id="f-convert-hint"></div>
      </div>

      <div class="field"><label>手續費（台幣，選填）</label><input id="f-fee" type="number" inputmode="decimal" placeholder="0" value="${state.fee}"></div>

      <div class="field"><label>付款方式</label>
        <div class="chip-row" id="f-methods">
          <button type="button" class="chip${state.paymentMethod === "" ? " active" : ""}" data-method="">未填</button>
          ${methods.map(m => `<button type="button" class="chip${m === state.paymentMethod ? " active" : ""}" data-method="${escapeHtml(m)}">${escapeHtml(m)}</button>`).join("")}
          <button type="button" class="chip" id="f-method-add">＋ 自訂</button>
        </div>
      </div>

      <div class="field">
        <div class="switch-row">
          <span>多人分開付</span>
          <button type="button" class="switch${state.multiPayer ? " on" : ""}" id="f-multipayer"><span class="knob"></span></button>
        </div>
      </div>

      <div class="field" id="f-single-payer-wrap"${state.multiPayer ? " style=\"display:none;\"" : ""}>
        <label>支出人</label>
        <div class="payer-row" id="f-payers">
          ${participants.map(p => `<button type="button" data-payer="${p.id}" class="${p.id === state.payerId ? "active" : ""}">${escapeHtml(p.name)}</button>`).join("")}
        </div>
      </div>

      <div class="field" id="f-split-wrap"${state.multiPayer ? "" : " style=\"display:none;\""}>
        <label>各自付多少（台幣，需等於總金額）</label>
        <div id="f-split-rows">
          ${participants.map((p, i) => `
            <div class="split-row">
              <span>${escapeHtml(p.name)}</span>
              <input type="number" inputmode="decimal" data-split-payer="${p.id}" value="${state.splits[i] ? state.splits[i].amount : ""}" placeholder="0">
            </div>`).join("")}
        </div>
        <div class="convert-hint" id="f-split-hint"></div>
      </div>

      <div class="field">
        <div class="switch-row">
          <span>列入均分計算</span>
          <button type="button" class="switch${state.splitEven ? " on" : ""}" id="f-split"><span class="knob"></span></button>
        </div>
      </div>

      <div class="field">
        <div class="switch-row">
          <span>🧾 可退稅</span>
          <button type="button" class="switch${state.taxRefundable ? " on" : ""}" id="f-taxrefund"><span class="knob"></span></button>
        </div>
      </div>

      <div class="field"><label>備註</label><textarea id="f-note" rows="2" placeholder="選填">${escapeHtml(state.note)}</textarea></div>

      <button class="btn btn-primary btn-block" id="f-save" style="margin-bottom:10px;">${isNew ? "儲存" : "更新"}</button>
      ${isNew ? "" : `<button class="btn btn-danger btn-block" id="f-delete">刪除這筆</button>`}
    </div>`;
  $("#modal-root").appendChild(modal);

  function currentTwdTotal() {
    const amt = Number(modal.querySelector("#f-amount").value) || 0;
    const cur = modal.querySelector("#f-currency").value;
    const fee = Number(modal.querySelector("#f-fee").value) || 0;
    return toTwd(amt, cur, currentTrip) + fee;
  }
  function updateHint() {
    const amt = Number(modal.querySelector("#f-amount").value) || 0;
    const cur = modal.querySelector("#f-currency").value;
    if (cur === "TWD") { modal.querySelector("#f-convert-hint").textContent = ""; }
    else {
      const c = currencies.find(x => x.code === cur);
      const rate = c ? Number(c.rate) || 0 : 0;
      modal.querySelector("#f-convert-hint").textContent = `≈ 台幣 ${fmt(amt * rate)}（匯率 ${rate}）`;
    }
    updateSplitHint();
  }
  function updateSplitHint() {
    if (!state.multiPayer) return;
    const total = currentTwdTotal();
    const sum = [...modal.querySelectorAll("[data-split-payer]")].reduce((s, inp) => s + (Number(inp.value) || 0), 0);
    const diff = total - sum;
    const hintEl = modal.querySelector("#f-split-hint");
    if (Math.abs(diff) < 1) hintEl.textContent = `總金額 台幣 ${fmt(total)} · 已分配完`;
    else hintEl.textContent = `總金額 台幣 ${fmt(total)} · 還差 ${fmt(diff)} 未分配`;
  }
  updateHint();
  modal.querySelector("#f-amount").addEventListener("input", updateHint);
  modal.querySelector("#f-currency").addEventListener("change", updateHint);
  modal.querySelector("#f-fee").addEventListener("input", updateHint);
  modal.querySelectorAll("[data-split-payer]").forEach(inp => inp.addEventListener("input", updateSplitHint));

  modal.querySelector("#m-close").addEventListener("click", () => modal.remove());

  modal.querySelector("#f-cats").addEventListener("click", e => {
    if (e.target.id === "f-cat-add") {
      const name = prompt("新增自訂類別名稱：");
      if (name && name.trim()) {
        const trimmed = name.trim();
        const newCats = Array.from(new Set([...(currentTrip.categories || DEFAULT_CATEGORIES), trimmed]));
        tripsRef().doc(currentTripId).update({ categories: newCats });
        const chip = document.createElement("button");
        chip.type = "button"; chip.className = "chip active"; chip.dataset.cat = trimmed; chip.textContent = trimmed;
        modal.querySelectorAll("#f-cats .chip").forEach(c => c.classList.remove("active"));
        modal.querySelector("#f-cat-add").before(chip);
        state.category = trimmed;
      }
      return;
    }
    if (e.target.dataset.cat) {
      modal.querySelectorAll("#f-cats .chip").forEach(c => c.classList.remove("active"));
      e.target.classList.add("active");
      state.category = e.target.dataset.cat;
    }
  });

  modal.querySelector("#f-methods").addEventListener("click", e => {
    if (e.target.id === "f-method-add") {
      const name = prompt("新增自訂付款方式：");
      if (name && name.trim()) {
        const trimmed = name.trim();
        const newMethods = Array.from(new Set([...(currentTrip.paymentMethods || DEFAULT_PAYMENT_METHODS), trimmed]));
        tripsRef().doc(currentTripId).update({ paymentMethods: newMethods });
        const chip = document.createElement("button");
        chip.type = "button"; chip.className = "chip active"; chip.dataset.method = trimmed; chip.textContent = trimmed;
        modal.querySelectorAll("#f-methods .chip").forEach(c => c.classList.remove("active"));
        modal.querySelector("#f-method-add").before(chip);
        state.paymentMethod = trimmed;
      }
      return;
    }
    if (e.target.dataset.method !== undefined) {
      modal.querySelectorAll("#f-methods .chip").forEach(c => c.classList.remove("active"));
      e.target.classList.add("active");
      state.paymentMethod = e.target.dataset.method;
    }
  });

  modal.querySelector("#f-payers").addEventListener("click", e => {
    if (e.target.dataset.payer) {
      modal.querySelectorAll("#f-payers button").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      state.payerId = e.target.dataset.payer;
    }
  });

  modal.querySelector("#f-multipayer").addEventListener("click", () => {
    state.multiPayer = !state.multiPayer;
    modal.querySelector("#f-multipayer").classList.toggle("on", state.multiPayer);
    modal.querySelector("#f-single-payer-wrap").style.display = state.multiPayer ? "none" : "";
    modal.querySelector("#f-split-wrap").style.display = state.multiPayer ? "" : "none";
    updateSplitHint();
  });

  modal.querySelector("#f-split").addEventListener("click", () => {
    state.splitEven = !state.splitEven;
    modal.querySelector("#f-split").classList.toggle("on", state.splitEven);
  });

  modal.querySelector("#f-taxrefund").addEventListener("click", () => {
    state.taxRefundable = !state.taxRefundable;
    modal.querySelector("#f-taxrefund").classList.toggle("on", state.taxRefundable);
  });

  modal.querySelector("#f-save").addEventListener("click", async () => {
    const name = modal.querySelector("#f-name").value.trim();
    const amount = Number(modal.querySelector("#f-amount").value);
    const fee = Number(modal.querySelector("#f-fee").value) || 0;
    const date = modal.querySelector("#f-date").value || todayStr();
    const currency = modal.querySelector("#f-currency").value;
    if (!name) { toast("請輸入名稱"); return; }
    if (!amount) { toast("請輸入金額"); return; }
    const twd = toTwd(amount, currency, currentTrip);
    const payload = {
      date, category: state.category, name, currency, amount, fee, twd,
      paymentMethod: state.paymentMethod,
      splitEven: state.splitEven,
      taxRefundable: state.taxRefundable,
      note: modal.querySelector("#f-note").value.trim()
    };
    if (state.multiPayer) {
      const splits = [...modal.querySelectorAll("[data-split-payer]")]
        .map(inp => ({ payerId: inp.dataset.splitPayer, amount: Number(inp.value) || 0 }))
        .filter(s => s.amount !== 0);
      const sum = splits.reduce((s, x) => s + x.amount, 0);
      if (Math.abs(sum - (twd + fee)) >= 1) { toast("分配金額總和要等於總金額"); return; }
      payload.splits = splits;
      payload.payerId = null;
    } else {
      payload.payerId = state.payerId;
      if (!isNew) payload.splits = firebase.firestore.FieldValue.delete();
    }
    if (isNew) {
      payload.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await expensesRef(currentTripId).add(payload);
      toast("已新增");
      showCheer(state.category, state.splitEven, twd + fee);
    } else {
      if (payload.paymentMethod && (payload.payerId || (payload.splits && payload.splits.length))) {
        payload.quickAdd = false;
      }
      await expensesRef(currentTripId).doc(existing.id).update(payload);
      toast("已更新");
    }
    modal.remove();
  });

  if (!isNew) {
    modal.querySelector("#f-delete").addEventListener("click", async () => {
      if (!confirm("確定要刪除這筆支出嗎？")) return;
      await expensesRef(currentTripId).doc(existing.id).delete();
      modal.remove();
      toast("已刪除");
    });
  }
}

/* ========= settlement tab ========= */
function renderSettle() {
  const root = $("#tab-settle");
  const participants = currentTrip.participants || DEFAULT_PARTICIPANTS;
  const foreignCurrencies = (currentTrip.currencies || []).filter(c => c.code !== "TWD");
  const shared = currentExpenses.filter(e => e.splitEven !== false);
  const total = shared.reduce((s, e) => s + (e.twd || 0) + (e.fee || 0), 0);
  const fairShare = participants.length ? total / participants.length : 0;

  // --- row 1: overall spend breakdown ---
  const grandTotalTwd = currentExpenses.reduce((s, e) => s + (e.twd || 0) + (e.fee || 0), 0);
  const rawByCurrency = {};
  foreignCurrencies.forEach(c => rawByCurrency[c.code] = 0);
  currentExpenses.forEach(e => { if (rawByCurrency[e.currency] != null) rawByCurrency[e.currency] += Number(e.amount) || 0; });
  const creditCardTotal = currentExpenses.filter(e => e.paymentMethod === "信用卡").reduce((s, e) => s + (e.twd || 0) + (e.fee || 0), 0);

  // --- row 2: per-person totals (all expenses, regardless of split) ---
  const totalSpentByPerson = {};
  participants.forEach(p => totalSpentByPerson[p.id] = 0);
  currentExpenses.forEach(e => {
    if (e.splits && e.splits.length) {
      e.splits.forEach(s => { if (totalSpentByPerson[s.payerId] != null) totalSpentByPerson[s.payerId] += s.amount; });
    } else if (totalSpentByPerson[e.payerId] != null) {
      totalSpentByPerson[e.payerId] += (e.twd || 0) + (e.fee || 0);
    }
  });

  // --- settlement balances (even-split only) ---
  const paidByPerson = {};
  participants.forEach(p => paidByPerson[p.id] = 0);
  shared.forEach(e => {
    if (e.splits && e.splits.length) {
      e.splits.forEach(s => { if (paidByPerson[s.payerId] != null) paidByPerson[s.payerId] += s.amount; });
    } else if (paidByPerson[e.payerId] != null) {
      paidByPerson[e.payerId] += (e.twd || 0) + (e.fee || 0);
    }
  });
  const personalTotals = {};
  participants.forEach(p => personalTotals[p.id] = 0);
  currentExpenses.filter(e => e.splitEven === false).forEach(e => {
    if (e.splits && e.splits.length) {
      e.splits.forEach(s => { if (personalTotals[s.payerId] != null) personalTotals[s.payerId] += s.amount; });
    } else if (personalTotals[e.payerId] != null) {
      personalTotals[e.payerId] += (e.twd || 0) + (e.fee || 0);
    }
  });
  const settledNet = {};
  participants.forEach(p => settledNet[p.id] = 0);
  currentSettlements.forEach(s => {
    if (settledNet[s.fromId] != null) settledNet[s.fromId] += s.amount;
    if (settledNet[s.toId] != null) settledNet[s.toId] -= s.amount;
  });

  // --- foreign currency reconciliation (cash only) ---
  const actualRemaining = currentTrip.actualRemaining || {};
  const cashSpentByCur = {};
  currentExpenses.forEach(e => {
    if (e.currency && e.currency !== "TWD" && e.paymentMethod === "現金") {
      cashSpentByCur[e.currency] = (cashSpentByCur[e.currency] || 0) + (Number(e.amount) || 0);
    }
  });
  const exchangedByCur = {};
  currentExchanges.forEach(x => { exchangedByCur[x.toCurrency] = (exchangedByCur[x.toCurrency] || 0) + (Number(x.toAmount) || 0); });

  const taxRefundTotal = currentExpenses.filter(e => e.category === "退稅").reduce((s, e) => s + (e.twd || 0) + (e.fee || 0), 0);

  root.innerHTML = `
    <div class="section-title" style="margin-top:0;">旅遊總支出</div>
    <div class="metric-grid" style="grid-template-columns:repeat(${2 + foreignCurrencies.length},minmax(120px,1fr));overflow-x:auto;display:flex;gap:10px;">
      <div class="metric-card" style="flex:0 0 auto;"><div class="lbl">台幣總支出</div><div class="val">${fmt(grandTotalTwd)}</div></div>
      ${foreignCurrencies.map(c => `<div class="metric-card" style="flex:0 0 auto;"><div class="lbl">${escapeHtml(c.code)} 原幣支出</div><div class="val">${fmt(rawByCurrency[c.code] || 0)}</div></div>`).join("")}
      <div class="metric-card" style="flex:0 0 auto;"><div class="lbl">信用卡支出（台幣）</div><div class="val">${fmt(creditCardTotal)}</div></div>
    </div>

    <div class="section-title">每人總計支出</div>
    <div class="metric-grid">
      ${participants.map(p => `<div class="metric-card"><div class="lbl">${escapeHtml(p.name)}</div><div class="val">${fmt(totalSpentByPerson[p.id] || 0)}</div></div>`).join("")}
    </div>

    <div class="section-title">均分結算</div>
    <div class="metric-grid">
      <div class="metric-card"><div class="lbl">列入均分總額</div><div class="val">${fmt(total)}</div></div>
      <div class="metric-card"><div class="lbl">每人應付（${participants.length} 人）</div><div class="val">${fmt(fairShare)}</div></div>
    </div>
    ${participants.map(p => {
      const paid = paidByPerson[p.id] || 0;
      const rawBalance = paid - fairShare;
      const balance = rawBalance + (settledNet[p.id] || 0);
      const rounded = Math.round(balance);
      let badge;
      if (Math.abs(rounded) < 1) badge = `<span class="settle-badge settle-even">打平</span>`;
      else if (rounded > 0) badge = `<span class="settle-badge settle-plus">從基金收 ${fmt(rounded)}</span>`;
      else badge = `<span class="settle-badge settle-minus">補基金 ${fmt(-rounded)}</span>`;
      const personal = personalTotals[p.id];
      return `
        <div class="person-row">
          <div>
            <div class="name">${escapeHtml(p.name)}</div>
            <div class="paid">均分已付 ${fmt(paid)}${personal ? `　個人花費 ${fmt(personal)}` : ""}</div>
          </div>
          ${badge}
        </div>`;
    }).join("")}

    ${foreignCurrencies.length ? `
      <div class="section-title">外幣現金結餘</div>
      <div id="fx-recon"></div>
    ` : ""}

    <div class="section-title">退稅</div>
    <div class="metric-card" style="margin-bottom:10px;">
      <div class="lbl">實際退稅總額</div>
      <div class="val">${fmt(taxRefundTotal)}</div>
    </div>
    <button class="btn btn-sm" id="btn-add-taxrefund">＋ 記錄退稅收到</button>

    <div class="section-title">已結清紀錄</div>
    <div id="settle-log"></div>
    <button class="btn btn-sm" id="btn-add-settlement" style="margin-top:6px;">＋ 記一筆已還款</button>
  `;

  if (foreignCurrencies.length) {
    const fxRoot = $("#fx-recon");
    fxRoot.innerHTML = foreignCurrencies.map(c => {
      const exchanged = exchangedByCur[c.code] || 0;
      const spent = cashSpentByCur[c.code] || 0;
      const a = exchanged - spent;
      const b = actualRemaining[c.code] != null ? actualRemaining[c.code] : "";
      return `
        <div class="person-row" style="flex-wrap:wrap;">
          <div style="width:100%;margin-bottom:8px;"><span class="name">${escapeHtml(c.code)}</span>
            <span style="font-size:12px;color:var(--muted);"> 換匯 ${fmt(exchanged)} － 現金支出 ${fmt(spent)}</span></div>
          <div class="row-inline" style="width:100%;justify-content:space-between;">
            <div><div class="paid">應結餘 A</div><div class="name">${fmt(a)}</div></div>
            <div><div class="paid">實際結餘 B</div><input type="number" class="fx-input fx-actual" data-cur="${c.code}" value="${b}" placeholder="自行輸入"></div>
            <div><div class="paid">不知去向 (A－B)</div><div class="name">${b === "" ? "—" : fmt(a - Number(b))}</div></div>
          </div>
        </div>`;
    }).join("");
    fxRoot.querySelectorAll(".fx-actual").forEach(inp => {
      inp.addEventListener("change", () => {
        const cur = inp.dataset.cur;
        const val = inp.value === "" ? firebase.firestore.FieldValue.delete() : Number(inp.value);
        const path = `actualRemaining.${cur}`;
        tripsRef().doc(currentTripId).update({ [path]: val }).catch(() => {
          // fallback if field path update fails (e.g. actualRemaining not yet an object)
          const merged = { ...(currentTrip.actualRemaining || {}) };
          if (inp.value === "") delete merged[cur]; else merged[cur] = Number(inp.value);
          tripsRef().doc(currentTripId).update({ actualRemaining: merged });
        });
      });
    });
  }

  const logRoot = $("#settle-log");
  if (currentSettlements.length === 0) {
    logRoot.innerHTML = `<p style="font-size:13px;color:var(--muted);">還沒有結清紀錄，如果旅行中已經先還過對方錢，可以記在這裡，結算金額會自動扣除。</p>`;
  } else {
    logRoot.innerHTML = currentSettlements.map(s => {
      const from = participants.find(p => p.id === s.fromId);
      const to = participants.find(p => p.id === s.toId);
      return `
        <div class="exchange-card" data-id="${s.id}">
          <div class="top"><span>${escapeHtml(from ? from.name : "?")} → ${escapeHtml(to ? to.name : "?")}</span><span>台幣 ${fmt(s.amount)}</span></div>
          <div class="sub">${escapeHtml(s.date || "")}${s.note ? " · " + escapeHtml(s.note) : ""} <span style="color:var(--danger);cursor:pointer;" class="del-settlement">刪除</span></div>
        </div>`;
    }).join("");
    logRoot.querySelectorAll(".del-settlement").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.closest(".exchange-card").dataset.id;
        if (!confirm("刪除這筆結清紀錄？")) return;
        await settlementsRef(currentTripId).doc(id).delete();
      });
    });
  }

  $("#btn-add-settlement").addEventListener("click", () => openSettlementModal(participants));
  $("#btn-add-taxrefund").addEventListener("click", () => openTaxRefundModal());
}

function openTaxRefundModal() {
  const participants = currentTrip.participants || DEFAULT_PARTICIPANTS;
  const currencies = currentTrip.currencies || [{ code: "TWD", name: "台幣", rate: 1 }];
  let payerId = null; // null = 共同基金
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-sheet">
      <div class="modal-head"><h2>記錄退稅收到</h2><button class="icon-btn" id="m-close">✕</button></div>
      <div class="field"><label>日期</label><input id="tr-date" type="date" value="${todayStr()}"></div>
      <div class="field"><label>收到多少退稅</label>
        <div class="amount-row">
          <select id="tr-currency">
            ${currencies.map(c => `<option value="${c.code}">${escapeHtml(c.code)}</option>`).join("")}
          </select>
          <input id="tr-amount" type="number" inputmode="decimal" placeholder="0">
        </div>
        <div class="convert-hint" id="tr-hint"></div>
      </div>
      <div class="field"><label>這筆算誰的</label>
        <div class="payer-row" id="tr-payer">
          <button type="button" data-id="" class="active">共同基金</button>
          ${participants.map(p => `<button type="button" data-id="${p.id}">${escapeHtml(p.name)}</button>`).join("")}
        </div>
      </div>
      <div class="field"><label>備註</label><textarea id="tr-note" rows="2" placeholder="選填，例如：機場退稅櫃檯"></textarea></div>
      <p style="font-size:12px;color:var(--muted);">這筆會記成一筆「退稅」類別的支出（金額為負數）。選「共同基金」代表不歸屬任何人，會平均降低每人應付；選特定人代表這筆錢是他拿走的，會從他的已付金額中扣除。</p>
      <button class="btn btn-primary btn-block" id="tr-save">儲存</button>
    </div>`;
  $("#modal-root").appendChild(modal);

  function updateHint() {
    const amt = Number(modal.querySelector("#tr-amount").value) || 0;
    const cur = modal.querySelector("#tr-currency").value;
    if (cur === "TWD") { modal.querySelector("#tr-hint").textContent = ""; return; }
    const twd = toTwd(amt, cur, currentTrip);
    modal.querySelector("#tr-hint").textContent = `≈ 台幣 ${fmt(twd)}`;
  }
  updateHint();
  modal.querySelector("#tr-amount").addEventListener("input", updateHint);
  modal.querySelector("#tr-currency").addEventListener("change", updateHint);

  modal.querySelector("#m-close").addEventListener("click", () => modal.remove());
  modal.querySelector("#tr-payer").addEventListener("click", e => {
    if (e.target.dataset.id === undefined) return;
    modal.querySelectorAll("#tr-payer button").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    payerId = e.target.dataset.id || null;
  });

  modal.querySelector("#tr-save").addEventListener("click", async () => {
    const amount = Number(modal.querySelector("#tr-amount").value) || 0;
    const currency = modal.querySelector("#tr-currency").value;
    if (!amount) { toast("請輸入金額"); return; }
    const twd = toTwd(amount, currency, currentTrip);
    await expensesRef(currentTripId).add({
      date: modal.querySelector("#tr-date").value || todayStr(),
      category: "退稅", name: "退稅收到", currency,
      amount: -amount, fee: 0, twd: -twd,
      paymentMethod: "", payerId, splitEven: true, taxRefundable: false,
      note: modal.querySelector("#tr-note").value.trim(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    modal.remove();
    toast("已記錄");
  });
}

function openSettlementModal(participants) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-sheet">
      <div class="modal-head"><h2>記一筆已還款</h2><button class="icon-btn" id="m-close">✕</button></div>
      <div class="field"><label>日期</label><input id="s-date" type="date" value="${todayStr()}"></div>
      <div class="field"><label>誰付錢</label>
        <div class="payer-row" id="s-from">${participants.map((p, i) => `<button type="button" data-id="${p.id}" class="${i === 0 ? "active" : ""}">${escapeHtml(p.name)}</button>`).join("")}</div>
      </div>
      <div class="field"><label>付給誰</label>
        <div class="payer-row" id="s-to">${participants.map((p, i) => `<button type="button" data-id="${p.id}" class="${i === 1 ? "active" : ""}">${escapeHtml(p.name)}</button>`).join("")}</div>
      </div>
      <div class="field"><label>金額（台幣）</label><input id="s-amount" type="number" inputmode="decimal" placeholder="0"></div>
      <div class="field"><label>備註</label><textarea id="s-note" rows="2" placeholder="選填，例如：LINE Pay 轉帳"></textarea></div>
      <button class="btn btn-primary btn-block" id="s-save">儲存</button>
    </div>`;
  $("#modal-root").appendChild(modal);
  let fromId = participants[0] ? participants[0].id : "";
  let toId = participants[1] ? participants[1].id : "";
  modal.querySelector("#m-close").addEventListener("click", () => modal.remove());
  modal.querySelector("#s-from").addEventListener("click", e => {
    if (!e.target.dataset.id) return;
    modal.querySelectorAll("#s-from button").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active"); fromId = e.target.dataset.id;
  });
  modal.querySelector("#s-to").addEventListener("click", e => {
    if (!e.target.dataset.id) return;
    modal.querySelectorAll("#s-to button").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active"); toId = e.target.dataset.id;
  });
  modal.querySelector("#s-save").addEventListener("click", async () => {
    const amount = Number(modal.querySelector("#s-amount").value) || 0;
    if (!amount) { toast("請輸入金額"); return; }
    if (fromId === toId) { toast("付錢的人跟收錢的人要不一樣"); return; }
    await settlementsRef(currentTripId).add({
      date: modal.querySelector("#s-date").value || todayStr(),
      fromId, toId, amount,
      note: modal.querySelector("#s-note").value.trim(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    modal.remove();
    toast("已記錄");
  });
}

/* ========= exchange tab ========= */
function renderExchange() {
  const root = $("#tab-exchange");
  const currencies = (currentTrip.currencies || []).filter(c => c.code !== "TWD");

  let html = "";
  if (currencies.length) {
    const spentByCur = {};
    currentExpenses.forEach(e => {
      if (e.currency && e.currency !== "TWD" && e.paymentMethod === "現金") {
        spentByCur[e.currency] = (spentByCur[e.currency] || 0) + (Number(e.amount) || 0);
      }
    });
    const exchangedByCur = {};
    currentExchanges.forEach(x => { exchangedByCur[x.toCurrency] = (exchangedByCur[x.toCurrency] || 0) + (Number(x.toAmount) || 0); });

    html += `<div class="metric-grid" style="grid-template-columns:1fr;">` +
      currencies.filter(c => exchangedByCur[c.code]).map(c => {
        const exchanged = exchangedByCur[c.code] || 0;
        const spent = spentByCur[c.code] || 0;
        const remain = exchanged - spent;
        return `<div class="metric-card" style="margin-bottom:0;"><div class="lbl">${escapeHtml(c.code)} 現金推算剩餘（換匯 ${fmt(exchanged)} － 現金支出 ${fmt(spent)}）</div><div class="val">${fmt(remain)} ${escapeHtml(c.code)}</div></div>`;
      }).join("") + `</div>`;
    if (!currencies.some(c => exchangedByCur[c.code])) html = "";
    if (html) html += `<p style="font-size:12px;color:var(--muted);margin:-8px 0 16px;">只統計付款方式標記為「現金」的支出，刷卡不會被算進消耗</p>`;
  }

  if (currentExchanges.length === 0) {
    html += `<div class="empty"><p>還沒有換匯紀錄。<br>按下方新增一筆。</p></div>`;
  } else {
    html += currentExchanges.map(x => {
      const p = (currentTrip.participants || []).find(pp => pp.id === x.payerId);
      const rate = x.rate || (x.toAmount ? (x.fromAmount / x.toAmount) : 0);
      return `
        <div class="exchange-card" data-id="${x.id}">
          <div class="top"><span>台幣 ${fmt(x.fromAmount)} → ${fmt(x.toAmount)} ${escapeHtml(x.toCurrency)}</span><span>匯率 ${rate.toFixed(4)}</span></div>
          <div class="sub">${escapeHtml(x.date || "")}${p ? " · " + escapeHtml(p.name) + " 出的錢" : ""}${x.note ? " · " + escapeHtml(x.note) : ""} <span style="color:var(--danger);cursor:pointer;" class="del-exchange">刪除</span></div>
        </div>`;
    }).join("");
  }

  root.innerHTML = html + `<button class="btn btn-primary btn-block" id="btn-add-exchange" style="margin-top:10px;">＋ 新增換匯紀錄</button>`;

  root.querySelectorAll(".del-exchange").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.closest(".exchange-card").dataset.id;
      if (!confirm("刪除這筆換匯紀錄？")) return;
      await exchangesRef(currentTripId).doc(id).delete();
    });
  });
  $("#btn-add-exchange").addEventListener("click", () => openExchangeModal());
}

function openExchangeModal() {
  const participants = currentTrip.participants || DEFAULT_PARTICIPANTS;
  const currencies = (currentTrip.currencies || []).filter(c => c.code !== "TWD");
  if (!currencies.length) { toast("請先到設定新增外幣幣別"); return; }
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-sheet">
      <div class="modal-head"><h2>新增換匯紀錄</h2><button class="icon-btn" id="m-close">✕</button></div>
      <div class="field"><label>日期</label><input id="x-date" type="date" value="${todayStr()}"></div>
      <div class="field"><label>誰出的台幣</label>
        <div class="payer-row" id="x-payer">${participants.map((p, i) => `<button type="button" data-id="${p.id}" class="${i === 0 ? "active" : ""}">${escapeHtml(p.name)}</button>`).join("")}</div>
      </div>
      <div class="field"><label>出多少台幣</label><input id="x-from" type="number" inputmode="decimal" placeholder="0"></div>
      <div class="field"><label>換成哪個幣別</label>
        <select id="x-currency">${currencies.map(c => `<option value="${c.code}">${escapeHtml(c.code)}</option>`).join("")}</select>
      </div>
      <div class="field"><label>匯率（1 外幣 = 多少台幣，這次實際換匯的匯率）</label><input id="x-rate" type="number" step="0.0001" inputmode="decimal" placeholder="例如 0.21"></div>
      <div class="field"><label>換到多少外幣（會自動算，也可以手動改）</label><input id="x-to" type="number" inputmode="decimal" placeholder="0"></div>
      <div class="field"><label>備註</label><textarea id="x-note" rows="2" placeholder="選填，例如：在哪裡換的"></textarea></div>
      <button class="btn btn-primary btn-block" id="x-save">儲存</button>
    </div>`;
  $("#modal-root").appendChild(modal);
  let payerId = participants[0] ? participants[0].id : "";
  let toTouched = false;
  function recalcTo() {
    if (toTouched) return;
    const from = Number(modal.querySelector("#x-from").value) || 0;
    const rate = Number(modal.querySelector("#x-rate").value) || 0;
    if (rate > 0) modal.querySelector("#x-to").value = (from / rate).toFixed(2);
  }
  modal.querySelector("#x-from").addEventListener("input", recalcTo);
  modal.querySelector("#x-rate").addEventListener("input", recalcTo);
  modal.querySelector("#x-to").addEventListener("input", () => { toTouched = true; });
  modal.querySelector("#m-close").addEventListener("click", () => modal.remove());
  modal.querySelector("#x-payer").addEventListener("click", e => {
    if (!e.target.dataset.id) return;
    modal.querySelectorAll("#x-payer button").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active"); payerId = e.target.dataset.id;
  });
  modal.querySelector("#x-save").addEventListener("click", async () => {
    const fromAmount = Number(modal.querySelector("#x-from").value) || 0;
    const toAmount = Number(modal.querySelector("#x-to").value) || 0;
    const rate = Number(modal.querySelector("#x-rate").value) || (toAmount ? fromAmount / toAmount : 0);
    if (!fromAmount || !toAmount) { toast("請輸入台幣與外幣金額"); return; }
    await exchangesRef(currentTripId).add({
      date: modal.querySelector("#x-date").value || todayStr(),
      payerId, fromAmount, toAmount, rate,
      toCurrency: modal.querySelector("#x-currency").value,
      note: modal.querySelector("#x-note").value.trim(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    modal.remove();
    toast("已新增");
  });
}

/* ========= settings tab ========= */
/* ========= quick-jot (隨手記) tab ========= */
const CATEGORY_KEYWORDS = {
  "食物": ["早餐", "午餐", "晚餐", "宵夜", "點心", "咖啡", "飲料", "下午茶", "消夜", "便當", "小吃"],
  "購物": ["紀念品", "伴手禮", "戰利品", "名產", "禮物", "戰績"],
  "交通": ["車票", "計程車", "公車", "捷運", "高鐵", "火車", "油錢", "停車", "uber", "taxi", "機票"],
  "景點": ["門票", "入場", "博物館", "樂園", "展覽"],
  "住宿": ["飯店", "旅館", "住宿", "民宿"]
};
function guessCategory(name) {
  for (const cat in CATEGORY_KEYWORDS) {
    if (CATEGORY_KEYWORDS[cat].some(w => name.includes(w))) return cat;
  }
  return "其他";
}

const CURRENCY_KEYWORDS = {
  TWD: ["台幣", "新台幣", "NTD"],
  JPY: ["日幣", "日圓", "円"],
  USD: ["美金", "美元"],
  KRW: ["韓元", "韓幣"],
  EUR: ["歐元"],
  THB: ["泰銖"],
  SGD: ["新加坡幣", "新幣"],
  MYR: ["馬幣", "令吉"],
  HKD: ["港幣", "港元"],
  CNY: ["人民幣", "人民币"],
  GBP: ["英鎊"]
};
function detectCurrency(text) {
  const available = (currentTrip.currencies || []).map(c => c.code);
  for (const code of available) {
    const words = (CURRENCY_KEYWORDS[code] || []).concat([code]);
    const hit = words.find(w => text.includes(w));
    if (hit) return { code, matched: hit };
  }
  return null;
}
function detectPaymentMethod(text) {
  const methods = currentTrip.paymentMethods || DEFAULT_PAYMENT_METHODS;
  const hit = methods.find(m => text.includes(m));
  return hit || null;
}

function parseQuickLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const dateMatch = trimmed.match(/^([\d\/\-]{4,10})\s*(.*)$/);
  if (!dateMatch || !dateMatch[2]) return { ok: false, raw: line, reason: "找不到日期或找不到品項" };
  const digits = dateMatch[1].replace(/[\/\-]/g, "");
  let rest = dateMatch[2];
  let year, month, day;
  if (digits.length === 8) {
    year = parseInt(digits.slice(0, 4), 10); month = digits.slice(4, 6); day = digits.slice(6, 8);
  } else if (digits.length === 7) {
    year = parseInt(digits.slice(0, 3), 10) + 1911; month = digits.slice(3, 5); day = digits.slice(5, 7);
  } else if (digits.length === 4) {
    year = new Date().getFullYear(); month = digits.slice(0, 2); day = digits.slice(2, 4);
  } else {
    return { ok: false, raw: line, reason: "日期格式看不懂（支援 0913 / 2026/09/13 / 115/09/13）" };
  }
  month = parseInt(month, 10); day = parseInt(day, 10);
  if (month < 1 || month > 12 || day < 1 || day > 31) return { ok: false, raw: line, reason: "日期看起來不對" };
  const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  let currency = "TWD";
  const curHit = detectCurrency(rest);
  if (curHit) { currency = curHit.code; rest = rest.replace(curHit.matched, " "); }
  let paymentMethod = "";
  const payHit = detectPaymentMethod(rest);
  if (payHit) { paymentMethod = payHit; rest = rest.replace(payHit, " "); }

  const items = [];
  const re = /([^\d]+?)\s*(\d+)/g;
  let m;
  while ((m = re.exec(rest)) !== null) {
    const name = m[1].trim();
    const amount = Number(m[2]);
    if (name && amount) items.push({ name, amount });
  }
  if (!items.length) return { ok: false, raw: line, reason: "找不到品項或金額" };
  return { ok: true, date: dateStr, currency, paymentMethod, items };
}

function parseQuickText(text) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const candidates = [], fails = [];
  lines.forEach(line => {
    const r = parseQuickLine(line);
    if (!r) return;
    if (!r.ok) { fails.push({ source: "new", raw: line, reason: r.reason }); return; }
    r.items.forEach(it => {
      candidates.push({
        key: "new:" + Math.random().toString(36).slice(2, 9),
        source: "new", date: r.date, name: it.name, amount: it.amount,
        currency: r.currency, paymentMethod: r.paymentMethod,
        category: guessCategory(it.name), checked: true
      });
    });
  });
  return { candidates, fails };
}

function renderQuicknote() {
  const root = $("#tab-quicknote");
  const dbCandidates = currentQuicknotes.filter(q => q.parseOk !== false).map(q => ({
    key: "db:" + q.id, source: "db", dbId: q.id, date: q.date, name: q.name, amount: q.amount,
    currency: q.currency || "TWD", paymentMethod: q.paymentMethod || "",
    category: q.category, checked: qnDbChecked[q.id] !== false
  }));
  const dbFails = currentQuicknotes.filter(q => q.parseOk === false).map(q => ({ key: "dbf:" + q.id, source: "db", dbId: q.id, raw: q.rawLine, reason: q.reason || "格式看不懂" }));

  const allCandidates = [...dbCandidates, ...qnCandidates];
  const allFails = [...dbFails, ...qnFails];

  let html = `
    <div class="field">
      <label>貼上或輸入隨手記文字，一行一個日期開頭，後面接品項＋金額（可以連續好幾筆），例如：<br>
      0913 早餐 500 午餐300 晚餐600<br>0912 紀念品30</label>
      <textarea id="qn-input" rows="5"></textarea>
    </div>
    <button class="btn btn-primary btn-block" id="qn-parse" style="margin-bottom:16px;">🔍 解析</button>
  `;

  if (allCandidates.length) {
    html += `<div class="section-title" style="margin-top:0;">待確認項目（勾選要加入支出的）</div>`;
    html += allCandidates.map(c => `
      <div class="qn-candidate" data-key="${c.key}">
        <input type="checkbox" ${c.checked !== false ? "checked" : ""}>
        <div class="qn-main">
          <div class="qn-name">${escapeHtml(c.name)}</div>
          <div class="qn-meta">${escapeHtml(c.date)} · ${escapeHtml(c.category)}${c.currency && c.currency !== "TWD" ? " · " + escapeHtml(c.currency) : ""}${c.paymentMethod ? " · " + escapeHtml(c.paymentMethod) : ""}</div>
        </div>
        <div class="qn-amt">${c.currency && c.currency !== "TWD" ? escapeHtml(c.currency) : "台幣"} ${fmt(c.amount)}</div>
      </div>`).join("");
    html += `<button class="btn btn-primary btn-block" id="qn-confirm" style="margin-top:6px;">✅ 確認送出</button>`;
  }

  if (allFails.length) {
    html += `<div class="section-title">無法辨識，需要手動處理</div>`;
    html += allFails.map(f => `
      <div class="qn-fail" data-key="${f.key}">
        <div style="font-size:13px;color:var(--ink-soft);">⚠️ ${escapeHtml(f.reason)}</div>
        <div class="raw">${escapeHtml(f.raw)}</div>
        ${f.source === "db" ? `<button class="btn btn-sm btn-danger" style="margin-top:8px;" data-del-fail="${f.dbId}">刪除這行</button>` : ""}
      </div>`).join("");
  }

  if (!allCandidates.length && !allFails.length) {
    html += `<p style="font-size:13px;color:var(--muted);">目前沒有待確認的隨手記項目。</p>`;
  }

  root.innerHTML = html;

  const parseBtn = root.querySelector("#qn-parse");
  if (parseBtn) parseBtn.addEventListener("click", () => {
    const text = root.querySelector("#qn-input").value;
    const { candidates, fails } = parseQuickText(text);
    qnCandidates = qnCandidates.concat(candidates);
    qnFails = qnFails.concat(fails);
    renderQuicknote();
  });

  root.querySelectorAll(".qn-candidate input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", () => {
      const key = cb.closest(".qn-candidate").dataset.key;
      if (key.startsWith("new:")) {
        const found = qnCandidates.find(x => x.key === key);
        if (found) found.checked = cb.checked;
      } else if (key.startsWith("db:")) {
        qnDbChecked[key.slice(3)] = cb.checked;
      }
    });
  });

  root.querySelectorAll("[data-del-fail]").forEach(btn => {
    btn.addEventListener("click", async () => {
      await quicknotesRef(currentTripId).doc(btn.dataset.delFail).delete();
    });
  });

  const confirmBtn = root.querySelector("#qn-confirm");
  if (confirmBtn) confirmBtn.addEventListener("click", () => commitQuicknotes(allCandidates));
}

async function commitQuicknotes(candidates) {
  const batch = db.batch();
  let addedCount = 0, keptCount = 0;
  candidates.forEach(c => {
    const checked = c.source === "new" ? (c.checked !== false) : (qnDbChecked[c.dbId] !== false);
    const currency = c.currency || "TWD";
    const paymentMethod = c.paymentMethod || "";
    if (checked) {
      batch.set(expensesRef(currentTripId).doc(), {
        date: c.date, category: c.category, name: c.name, currency,
        amount: c.amount, fee: 0, twd: toTwd(c.amount, currency, currentTrip),
        paymentMethod, payerId: null, splitEven: true, note: "", quickAdd: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      addedCount++;
      if (c.source === "db") batch.delete(quicknotesRef(currentTripId).doc(c.dbId));
    } else {
      keptCount++;
      if (c.source === "new") {
        batch.set(quicknotesRef(currentTripId).doc(), {
          parseOk: true, date: c.date, name: c.name, amount: c.amount,
          currency, paymentMethod, category: c.category,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    }
  });
  qnFails.filter(f => f.source === "new").forEach(f => {
    batch.set(quicknotesRef(currentTripId).doc(), {
      parseOk: false, rawLine: f.raw, reason: f.reason,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    keptCount++;
  });
  await batch.commit();
  qnCandidates = []; qnFails = []; qnDbChecked = {};
  toast(`已新增 ${addedCount} 筆支出，${keptCount} 筆留在隨手記`);
}

function renderSettings() {
  const root = $("#tab-settings");
  const currencies = currentTrip.currencies || [];
  const participants = currentTrip.participants || [];
  const categories = currentTrip.categories || DEFAULT_CATEGORIES;

  root.innerHTML = `
    <div class="section-title">旅行資訊</div>
    <div class="list-row"><span>${escapeHtml(currentTrip.name)}</span><button class="btn btn-sm" id="s-edit-trip">編輯</button></div>

    <div class="section-title">幣別與匯率</div>
    <div id="s-currencies"></div>
    <button class="btn btn-sm" id="s-add-currency" style="margin-top:8px;">＋ 新增幣別</button>

    <div class="section-title">參與人員</div>
    <div id="s-participants"></div>
    <button class="btn btn-sm" id="s-add-participant" style="margin-top:8px;">＋ 新增人員</button>

    <div class="section-title">自訂類別</div>
    <div class="chip-row" id="s-categories">
      ${categories.map(c => `<span class="chip" data-cat="${escapeHtml(c)}">${escapeHtml(c)} ✕</span>`).join("")}
    </div>
    <button class="btn btn-sm" id="s-add-category" style="margin-top:8px;">＋ 新增類別</button>

    <div class="section-title">付款方式</div>
    <div class="chip-row" id="s-methods">
      ${(currentTrip.paymentMethods || DEFAULT_PAYMENT_METHODS).map(m => `<span class="chip" data-method="${escapeHtml(m)}">${escapeHtml(m)} ✕</span>`).join("")}
    </div>
    <button class="btn btn-sm" id="s-add-method" style="margin-top:8px;">＋ 新增付款方式</button>

    <div class="section-title">資料備份</div>
    <button class="btn btn-block" id="s-export" style="margin-bottom:8px;">匯出這趟旅行（Excel）</button>
    <label class="btn btn-block" style="display:flex;">
      匯入花費紀錄（Excel）
      <input type="file" id="s-import" accept=".xlsx,.xls" class="hidden">
    </label>

    <div class="section-title">危險區</div>
    <button class="btn btn-danger btn-block" id="s-delete-trip">刪除這趟旅行</button>
  `;

  // currencies
  const curRoot = $("#s-currencies");
  curRoot.innerHTML = currencies.map((c, i) => `
    <div class="list-row" data-i="${i}">
      <div class="row-inline">
        <span style="font-weight:500;">${escapeHtml(c.code)}</span>
        ${c.code !== "TWD" ? `<input class="small-input rate-input" type="number" step="0.0001" value="${c.rate}">` : `<span style="color:var(--muted);font-size:13px;">基準幣別</span>`}
      </div>
      ${c.code !== "TWD" ? `<button class="icon-btn del-currency">✕</button>` : ""}
    </div>`).join("");
  curRoot.querySelectorAll(".rate-input").forEach((inp, idx) => {
    inp.addEventListener("change", () => {
      const list = [...currencies];
      list[idx + 1] = { ...list[idx + 1], rate: Number(inp.value) || 0 };
      tripsRef().doc(currentTripId).update({ currencies: list });
    });
  });
  curRoot.querySelectorAll(".del-currency").forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      const list = currencies.filter((c, i) => i !== idx + 1);
      tripsRef().doc(currentTripId).update({ currencies: list });
    });
  });
  $("#s-add-currency").addEventListener("click", () => {
    const code = prompt("幣別代碼，例如 JPY、USD、KRW：");
    if (!code) return;
    const rate = Number(prompt(`1 ${code.toUpperCase()} 兌換多少台幣？`, "1"));
    const list = [...currencies, { code: code.trim().toUpperCase(), rate: rate || 0 }];
    tripsRef().doc(currentTripId).update({ currencies: list });
  });

  // participants
  const partRoot = $("#s-participants");
  partRoot.innerHTML = participants.map((p, i) => `
    <div class="list-row" data-i="${i}">
      <input class="name-input" value="${escapeHtml(p.name)}" style="max-width:160px;">
      <button class="icon-btn del-participant">✕</button>
    </div>`).join("");
  partRoot.querySelectorAll(".name-input").forEach((inp, idx) => {
    inp.addEventListener("change", () => {
      const list = [...participants];
      list[idx] = { ...list[idx], name: inp.value.trim() || list[idx].name };
      tripsRef().doc(currentTripId).update({ participants: list });
    });
  });
  partRoot.querySelectorAll(".del-participant").forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      if (!confirm(`移除「${participants[idx].name}」？（這個人過去記錄的花費不會被刪除，但結算會拿掉他）`)) return;
      const list = participants.filter((p, i) => i !== idx);
      tripsRef().doc(currentTripId).update({ participants: list });
    });
  });
  $("#s-add-participant").addEventListener("click", () => {
    const name = prompt("新增人員名稱：");
    if (!name || !name.trim()) return;
    const id = "p_" + Date.now();
    const list = [...participants, { id, name: name.trim() }];
    tripsRef().doc(currentTripId).update({ participants: list });
  });

  // categories
  $("#s-categories").addEventListener("click", e => {
    const cat = e.target.dataset.cat;
    if (!cat) return;
    if (!confirm(`刪除類別「${cat}」？（已用這個類別的支出不會被更動）`)) return;
    const list = categories.filter(c => c !== cat);
    tripsRef().doc(currentTripId).update({ categories: list });
  });
  $("#s-add-category").addEventListener("click", () => {
    const name = prompt("新增類別名稱：");
    if (!name || !name.trim()) return;
    const list = Array.from(new Set([...categories, name.trim()]));
    tripsRef().doc(currentTripId).update({ categories: list });
  });

  // payment methods
  $("#s-methods").addEventListener("click", e => {
    const m = e.target.dataset.method;
    if (!m) return;
    if (!confirm(`刪除付款方式「${m}」？（已用這個方式的支出不會被更動）`)) return;
    const list = (currentTrip.paymentMethods || DEFAULT_PAYMENT_METHODS).filter(x => x !== m);
    tripsRef().doc(currentTripId).update({ paymentMethods: list });
  });
  $("#s-add-method").addEventListener("click", () => {
    const name = prompt("新增付款方式名稱：");
    if (!name || !name.trim()) return;
    const list = Array.from(new Set([...(currentTrip.paymentMethods || DEFAULT_PAYMENT_METHODS), name.trim()]));
    tripsRef().doc(currentTripId).update({ paymentMethods: list });
  });

  $("#s-edit-trip").addEventListener("click", () => openTripEditModal(currentTrip));

  $("#s-export").addEventListener("click", () => {
    const wb = XLSX.utils.book_new();

    const expRows = currentExpenses.map(e => {
      let payerName = "", splitDetail = "";
      if (e.splits && e.splits.length) {
        splitDetail = e.splits.map(s => {
          const p = (currentTrip.participants || []).find(x => x.id === s.payerId);
          return `${p ? p.name : s.payerId}:${s.amount}`;
        }).join(";");
      } else {
        const p = (currentTrip.participants || []).find(x => x.id === e.payerId);
        payerName = p ? p.name : "";
      }
      return {
        日期: e.date, 類別: e.category, 名稱: e.name, 幣別: e.currency,
        金額: e.amount, 手續費: e.fee || 0, 台幣金額: e.twd || 0,
        付款方式: e.paymentMethod || "", 支出人: payerName, 分攤明細: splitDetail,
        列入均分: e.splitEven !== false ? "是" : "否", 備註: e.note || ""
      };
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(expRows), "支出");

    const exRows = currentExchanges.map(x => {
      const p = (currentTrip.participants || []).find(pp => pp.id === x.payerId);
      return { 日期: x.date, 誰出的台幣: p ? p.name : "", 出多少台幣: x.fromAmount, 換成幣別: x.toCurrency, 匯率: x.rate || "", 換到多少外幣: x.toAmount, 備註: x.note || "" };
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(exRows), "換匯");

    const setRows = currentSettlements.map(s => {
      const from = (currentTrip.participants || []).find(p => p.id === s.fromId);
      const to = (currentTrip.participants || []).find(p => p.id === s.toId);
      return { 日期: s.date, 誰付: from ? from.name : "", 付給誰: to ? to.name : "", 金額: s.amount, 備註: s.note || "" };
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(setRows), "結清紀錄");

    XLSX.writeFile(wb, `${currentTrip.name}.xlsx`);
  });

  $("#s-import").addEventListener("change", async ev => {
    const file = ev.target.files[0];
    if (!file) return;
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });

      let newParticipants = [...(currentTrip.participants || [])];
      let newCategories = [...(currentTrip.categories || DEFAULT_CATEGORIES)];
      let newMethods = [...(currentTrip.paymentMethods || DEFAULT_PAYMENT_METHODS)];
      function ensureParticipant(name) {
        name = (name || "").trim();
        if (!name) return null;
        let p = newParticipants.find(x => x.name === name);
        if (!p) { p = { id: "p_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6), name }; newParticipants.push(p); }
        return p.id;
      }

      const expSheet = wb.Sheets["支出"];
      const expRows = expSheet ? XLSX.utils.sheet_to_json(expSheet) : [];
      const exSheet = wb.Sheets["換匯"];
      const exRows = exSheet ? XLSX.utils.sheet_to_json(exSheet) : [];
      const setSheet = wb.Sheets["結清紀錄"];
      const setRows = setSheet ? XLSX.utils.sheet_to_json(setSheet) : [];

      const expensesToAdd = expRows.map(r => {
        const cat = r["類別"] || "其他";
        if (!newCategories.includes(cat)) newCategories.push(cat);
        const method = r["付款方式"] || "";
        if (method && !newMethods.includes(method)) newMethods.push(method);
        let payerId = null, splits;
        if (r["分攤明細"]) {
          splits = String(r["分攤明細"]).split(";").filter(Boolean).map(pair => {
            const [n, amt] = pair.split(":");
            return { payerId: ensureParticipant(n), amount: Number(amt) || 0 };
          });
        } else if (r["支出人"]) {
          payerId = ensureParticipant(r["支出人"]);
        }
        const currency = r["幣別"] || "TWD";
        const amount = Number(r["金額"]) || 0;
        const fee = Number(r["手續費"]) || 0;
        const twd = r["台幣金額"] != null && r["台幣金額"] !== "" ? Number(r["台幣金額"]) : toTwd(amount, currency, currentTrip);
        const payload = {
          date: r["日期"] ? String(r["日期"]) : todayStr(),
          category: cat, name: r["名稱"] || "", currency, amount, fee, twd,
          paymentMethod: method, payerId,
          splitEven: r["列入均分"] === "否" ? false : true,
          note: r["備註"] || "",
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        if (splits && splits.length) payload.splits = splits;
        return payload;
      });

      const exchangesToAdd = exRows.map(r => ({
        date: r["日期"] ? String(r["日期"]) : todayStr(),
        payerId: ensureParticipant(r["誰出的台幣"]),
        fromAmount: Number(r["出多少台幣"]) || 0,
        toCurrency: r["換成幣別"] || "",
        rate: Number(r["匯率"]) || 0,
        toAmount: Number(r["換到多少外幣"]) || 0,
        note: r["備註"] || "",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }));

      const settlementsToAdd = setRows.map(r => ({
        date: r["日期"] ? String(r["日期"]) : todayStr(),
        fromId: ensureParticipant(r["誰付"]),
        toId: ensureParticipant(r["付給誰"]),
        amount: Number(r["金額"]) || 0,
        note: r["備註"] || "",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }));

      if (!expensesToAdd.length && !exchangesToAdd.length && !settlementsToAdd.length) {
        toast("找不到可匯入的資料"); ev.target.value = ""; return;
      }

      await tripsRef().doc(currentTripId).update({ participants: newParticipants, categories: newCategories, paymentMethods: newMethods });

      const batch = db.batch();
      expensesToAdd.forEach(e => batch.set(expensesRef(currentTripId).doc(), e));
      exchangesToAdd.forEach(x => batch.set(exchangesRef(currentTripId).doc(), x));
      settlementsToAdd.forEach(s => batch.set(settlementsRef(currentTripId).doc(), s));
      await batch.commit();

      toast(`已匯入 ${expensesToAdd.length} 筆支出、${exchangesToAdd.length} 筆換匯、${settlementsToAdd.length} 筆結清`);
    } catch (err) {
      console.error(err);
      toast("匯入失敗，請確認檔案格式");
    }
    ev.target.value = "";
  });

  $("#s-delete-trip").addEventListener("click", async () => {
    if (!confirm(`確定要刪除「${currentTrip.name}」嗎？這會刪除這趟旅行的所有花費、換匯與結清紀錄，無法復原。`)) return;
    const [expSnap, exSnap, setSnap] = await Promise.all([
      expensesRef(currentTripId).get(), exchangesRef(currentTripId).get(), settlementsRef(currentTripId).get()
    ]);
    const batch = db.batch();
    expSnap.docs.forEach(d => batch.delete(d.ref));
    exSnap.docs.forEach(d => batch.delete(d.ref));
    setSnap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
    await tripsRef().doc(currentTripId).delete();
    $("#btn-back-trips").click();
    toast("已刪除這趟旅行");
  });
}
