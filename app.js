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
const DEFAULT_CATEGORIES = ["交通", "住宿", "食物", "景點", "購物", "其他"];
const DEFAULT_PAYMENT_METHODS = ["現金", "信用卡", "行動支付"];
const DEFAULT_PARTICIPANTS = [
  { id: "husband", name: "老公" },
  { id: "wife", name: "老婆" }
];
const RAMPS = [
  { bg: "var(--brick-tint)", fg: "var(--brick-dark)" },
  { bg: "var(--jade-tint)", fg: "var(--jade-dark)" },
  { bg: "var(--gold-tint)", fg: "var(--gold)" }
];
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
let unsubExchanges = null;
let unsubSettlements = null;
let currentTab = "ledger";
let ledgerFilters = { payerId: "", splitEven: "", currency: "", from: "", to: "", min: "", max: "", text: "" };
let filterPanelOpen = false;

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
  $all(".tabbar button").forEach(b => b.classList.toggle("active", b.dataset.tab === "ledger"));
  hide($("#screen-trips"));
  show($("#screen-trip"));
  if (unsubExpenses) unsubExpenses();
  if (unsubExchanges) unsubExchanges();
  if (unsubSettlements) unsubSettlements();
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
  if (unsubTripDocFn) unsubTripDocFn();
  currentTripId = null; currentTrip = null; currentExpenses = []; currentExchanges = []; currentSettlements = [];
  hide($("#screen-trip"));
  show($("#screen-trips"));
  renderTripsList();
});
$("#btn-logout").addEventListener("click", () => auth.signOut());

$all(".tabbar button").forEach(btn => {
  btn.addEventListener("click", () => {
    currentTab = btn.dataset.tab;
    $all(".tabbar button").forEach(b => b.classList.toggle("active", b === btn));
    renderCurrentTab();
  });
});

function renderCurrentTab() {
  if (!currentTrip) return;
  ["ledger", "settle", "exchange", "settings"].forEach(t => {
    (t === currentTab ? show : hide)($("#tab-" + t));
  });
  if (currentTab === "ledger") renderLedger();
  if (currentTab === "settle") renderSettle();
  if (currentTab === "exchange") renderExchange();
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

  let html = `<button class="btn btn-sm" id="btn-toggle-filter" style="margin-bottom:12px;">🔍 篩選${hasFilters ? "（篩選中）" : ""}</button>`;
  if (filterPanelOpen) html += filterPanelHtml();

  if (hasFilters) {
    const subtotal = filtered.reduce((s, e) => s + (e.twd || 0) + (e.fee || 0), 0);
    html += `<div class="subtotal-bar"><span>符合條件 ${filtered.length} 筆</span><span class="n">台幣 ${fmt(subtotal)}</span></div>`;
  }

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
  const days = Object.keys(byDay).sort().reverse();
  html += days.map(day => {
    const items = byDay[day];
    const dayTotal = items.reduce((s, e) => s + (e.twd || 0) + (e.fee || 0), 0);
    return `
      <div class="day-group">
        <div class="day-head"><span class="d">${escapeHtml(day)}</span><span class="t">台幣 ${fmt(dayTotal)}</span></div>
        ${items.map(e => entryRow(e)).join("")}
      </div>`;
  }).join("");

  root.innerHTML = html;
  wireFilterEvents(root);
  $all(".entry", root).forEach(row => {
    row.addEventListener("click", () => {
      const exp = currentExpenses.find(e => e.id === row.dataset.id);
      if (exp) openExpenseModal(exp);
    });
  });
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
    <div class="entry" data-id="${e.id}">
      <div class="cat-dot" style="background:${c.bg};color:${c.fg};">${escapeHtml(cat.slice(0, 2))}</div>
      <div class="entry-main">
        <div class="name">${escapeHtml(e.name || "")}${total < 0 ? " (退款)" : ""}</div>
        <div class="meta">${escapeHtml(cat)}${methodTag}${noteTag}</div>
      </div>
      <div class="entry-side">
        <div class="amt">台幣 ${fmt(total)}</div>
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
    } else {
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
  const shared = currentExpenses.filter(e => e.splitEven !== false);
  const total = shared.reduce((s, e) => s + (e.twd || 0) + (e.fee || 0), 0);
  const fairShare = participants.length ? total / participants.length : 0;

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

  // net effect of already-recorded settlements (money paid directly between people)
  const settledNet = {};
  participants.forEach(p => settledNet[p.id] = 0);
  currentSettlements.forEach(s => {
    if (settledNet[s.fromId] != null) settledNet[s.fromId] += s.amount; // paid down what they owed
    if (settledNet[s.toId] != null) settledNet[s.toId] -= s.amount;     // already received part of what they're owed
  });

  root.innerHTML = `
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
            <div class="paid">已付 ${fmt(paid)}${personal ? `　個人花費 ${fmt(personal)}` : ""}</div>
          </div>
          ${badge}
        </div>`;
    }).join("")}

    <div class="section-title">已結清紀錄</div>
    <div id="settle-log"></div>
    <button class="btn btn-sm" id="btn-add-settlement" style="margin-top:6px;">＋ 記一筆已還款</button>
  `;

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
      const rate = x.toAmount ? (x.fromAmount / x.toAmount) : 0;
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
      <div class="field"><label>換到多少外幣</label><input id="x-to" type="number" inputmode="decimal" placeholder="0"></div>
      <div class="field"><label>備註</label><textarea id="x-note" rows="2" placeholder="選填，例如：在哪裡換的"></textarea></div>
      <button class="btn btn-primary btn-block" id="x-save">儲存</button>
    </div>`;
  $("#modal-root").appendChild(modal);
  let payerId = participants[0] ? participants[0].id : "";
  modal.querySelector("#m-close").addEventListener("click", () => modal.remove());
  modal.querySelector("#x-payer").addEventListener("click", e => {
    if (!e.target.dataset.id) return;
    modal.querySelectorAll("#x-payer button").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active"); payerId = e.target.dataset.id;
  });
  modal.querySelector("#x-save").addEventListener("click", async () => {
    const fromAmount = Number(modal.querySelector("#x-from").value) || 0;
    const toAmount = Number(modal.querySelector("#x-to").value) || 0;
    if (!fromAmount || !toAmount) { toast("請輸入台幣與外幣金額"); return; }
    await exchangesRef(currentTripId).add({
      date: modal.querySelector("#x-date").value || todayStr(),
      payerId, fromAmount, toAmount,
      toCurrency: modal.querySelector("#x-currency").value,
      note: modal.querySelector("#x-note").value.trim(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    modal.remove();
    toast("已新增");
  });
}

/* ========= settings tab ========= */
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

    <div class="section-title">付款方式</div>
    <div class="chip-row" id="s-methods">
      ${(currentTrip.paymentMethods || DEFAULT_PAYMENT_METHODS).map(m => `<span class="chip" data-method="${escapeHtml(m)}">${escapeHtml(m)} ✕</span>`).join("")}
    </div>
    <button class="btn btn-sm" id="s-add-method" style="margin-top:8px;">＋ 新增付款方式</button>

    <div class="section-title">資料備份</div>
    <button class="btn btn-block" id="s-export" style="margin-bottom:8px;">匯出這趟旅行（JSON）</button>
    <label class="btn btn-block" style="display:flex;">
      匯入花費紀錄（JSON）
      <input type="file" id="s-import" accept="application/json" class="hidden">
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
    const data = { trip: currentTrip, expenses: currentExpenses, exchanges: currentExchanges, settlements: currentSettlements };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${currentTrip.name}.json`;
    a.click();
  });

  $("#s-import").addEventListener("change", async ev => {
    const file = ev.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const list = Array.isArray(data) ? data : (data.expenses || []);
      if (!list.length) { toast("找不到可匯入的花費資料"); return; }
      const batch = db.batch();
      list.forEach(e => {
        const ref = expensesRef(currentTripId).doc();
        batch.set(ref, {
          date: e.date || todayStr(),
          category: e.category || "其他",
          name: e.name || "",
          currency: e.currency || "TWD",
          amount: Number(e.amount) || 0,
          fee: Number(e.fee) || 0,
          twd: e.twd != null ? Number(e.twd) : toTwd(e.amount, e.currency || "TWD", currentTrip),
          payerId: e.payerId || (currentTrip.participants[0] || {}).id,
          splitEven: e.splitEven !== false,
          note: e.note || "",
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });
      await batch.commit();
      toast(`已匯入 ${list.length} 筆`);
    } catch (err) {
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
