const BUYER_INTAKE_LINK = "https://form.jotform.com/252063354378055";

let buyers = JSON.parse(localStorage.getItem("buyers")) || [];

function saveBuyers(){
  localStorage.setItem("buyers", JSON.stringify(buyers));
}

function money(value){
  const num = Number(String(value || "").replace(/,/g, ""));
  return num ? "$" + num.toLocaleString() : "—";
}

function clean(value){
  return value && String(value).trim() !== "" ? value : "—";
}

function openBuyerIntake(){
  window.open(BUYER_INTAKE_LINK, "_blank");
}

function copyBuyerIntake(){
  navigator.clipboard.writeText(BUYER_INTAKE_LINK);
  alert("✅ Intake link copied");
}

function buyerScore(buyer){
  let score = 0;

  if (buyer.tag === "VIP") score += 30;
  if (buyer.tag === "A Buyer") score += 20;
  if (buyer.role === "Contractor Buyer") score += 20;
  if (buyer.role === "Cash Buyer") score += 20;
  if (buyer.phone) score += 10;
  if (buyer.email) score += 10;
  if (buyer.maxPrice > 0) score += 10;

  return score;
}

function renderBuyers(){
  const list = document.getElementById("buyerList");
  list.innerHTML = "";

  if (buyers.length === 0) {
    list.innerHTML = `<p class="small">No buyers yet. Add your first buyer or contractor.</p>`;
    return;
  }

  buyers
    .map((b, i) => ({ ...b, index: i, score: buyerScore(b) }))
    .sort((a, b) => b.score - a.score)
    .forEach(b => {
      list.innerHTML += `
        <div class="buyer">
          <div class="tag">${clean(b.tag)} • Score ${b.score}</div>
          <b>${clean(b.name)}</b><br>
          ${clean(b.company)}<br>
          ${clean(b.role)}<br>
          📍 ${clean(b.area)}<br>
          💰 Max: ${money(b.maxPrice)}<br>
          🛠️ Rehab: ${clean(b.rehabLevel)}<br>
          📞 ${clean(b.phone)}<br>
          📧 ${clean(b.email)}<br>
          📝 ${clean(b.notes)}<br>

          <div class="actions">
            <button onclick="textBuyer(${b.index})">Text</button>
            <button onclick="emailBuyer(${b.index})">Email</button>
            <button onclick="deleteBuyer(${b.index})">Delete</button>
          </div>
        </div>
      `;
    });
}

function addBuyer(){
  const buyer = {
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    email: document.getElementById("email").value.trim(),
    company: document.getElementById("company").value.trim(),
    role: document.getElementById("role").value,
    tag: document.getElementById("tag").value,
    area: document.getElementById("area").value.trim(),
    maxPrice: Number(document.getElementById("maxPrice").value.replace(/,/g, "")) || 0,
    rehabLevel: document.getElementById("rehabLevel").value.trim(),
    notes: document.getElementById("notes").value.trim()
  };

  if (!buyer.name && !buyer.phone && !buyer.email) {
    alert("Add at least a name, phone, or email.");
    return;
  }

  buyers.push(buyer);
  saveBuyers();
  renderBuyers();

  document.getElementById("name").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("email").value = "";
  document.getElementById("company").value = "";
  document.getElementById("area").value = "";
  document.getElementById("maxPrice").value = "";
  document.getElementById("rehabLevel").value = "";
  document.getElementById("notes").value = "";

  alert("✅ Buyer / Contractor added");
}

function deleteBuyer(index){
  buyers.splice(index, 1);
  saveBuyers();
  renderBuyers();
}

function clearAllBuyers(){
  if (!confirm("Clear all buyers from this device?")) return;
  buyers = [];
  saveBuyers();
  renderBuyers();
}

function filterBuyers(){
  const search = document.getElementById("search").value.toLowerCase();
  const cards = document.querySelectorAll(".buyer");

  cards.forEach(card => {
    card.style.display = card.innerText.toLowerCase().includes(search) ? "block" : "none";
  });
}

function getDeal(){
  return {
    address: document.getElementById("dealAddress").value.trim(),
    area: document.getElementById("dealArea").value.trim(),
    price: Number(document.getElementById("dealPrice").value.replace(/,/g, "")) || 0,
    arv: Number(document.getElementById("dealARV").value.replace(/,/g, "")) || 0,
    rehab: Number(document.getElementById("dealRehab").value.replace(/,/g, "")) || 0
  };
}

function buildDealBlast(){
  const d = getDeal();
  const spread = d.arv - d.price - d.rehab;

  const msg =
`🔥 OFF-MARKET DEAL

Address: ${d.address || "TBD"}
Area: ${d.area || "TBD"}

Price: ${money(d.price)}
ARV: ${money(d.arv)}
Estimated Rehab: ${money(d.rehab)}
Estimated Spread: ${money(spread)}

Serious buyers only.

Richardson L.
RO’Lyfe Holdings LLC
267-808-5844
richman@rootoflyfe.com`;

  document.getElementById("dealMsg").value = msg;
}

function matchDeal(){
  const d = getDeal();
  const area = d.area.toLowerCase();

  let matched = buyers
    .map((b, i) => {
      let score = buyerScore(b);

      if (b.area && area && b.area.toLowerCase().includes(area)) score += 30;
      if (b.maxPrice && d.price && d.price <= b.maxPrice) score += 30;
      if (b.tag === "Do Not Send") score = -100;

      return { ...b, index: i, score };
    })
    .filter(b => b.score > 0)
    .sort((a, b) => b.score - a.score);

  const box = document.getElementById("matchResults");

  if (matched.length === 0) {
    box.innerHTML = `<p class="bad">❌ No matched buyers yet.</p>`;
    return;
  }

  box.innerHTML = `<h3>🔥 Matched Buyers</h3>`;

  matched.forEach(b => {
    box.innerHTML += `
      <div class="match">
        <b>${clean(b.name)}</b> • ${clean(b.role)}<br>
        Score: ${b.score}<br>
        📍 ${clean(b.area)}<br>
        💰 Max: ${money(b.maxPrice)}<br>
        📞 ${clean(b.phone)}<br>
        <button onclick="textBuyer(${b.index})">Text Deal</button>
        <button onclick="emailBuyer(${b.index})">Email Deal</button>
      </div>
    `;
  });
}

function copyBlast(){
  const msg = document.getElementById("dealMsg").value;
  navigator.clipboard.writeText(msg);
  alert("✅ Deal blast copied");
}

function sendEmailBlast(){
  const msg = encodeURIComponent(document.getElementById("dealMsg").value);
  window.open(`mailto:?subject=RO’Lyfe Off-Market Deal&body=${msg}`, "_blank");
}

function sendSMSBlast(){
  const msg = encodeURIComponent(document.getElementById("dealMsg").value);
  window.open(`sms:?body=${msg}`, "_blank");
}

function textBuyer(index){
  const b = buyers[index];
  const msg = encodeURIComponent(document.getElementById("dealMsg").value || "Deal ready. Contact Richardson.");
  window.open(`sms:${b.phone}?body=${msg}`, "_blank");
}

function emailBuyer(index){
  const b = buyers[index];
  const msg = encodeURIComponent(document.getElementById("dealMsg").value || "Deal ready. Contact Richardson.");
  window.open(`mailto:${b.email}?subject=RO’Lyfe Off-Market Deal&body=${msg}`, "_blank");
}

function exportBuyers(){
  let text = "RO’Lyfe Buyer Network\\n\\n";

  buyers.forEach((b, i) => {
    text += `${i + 1}. ${clean(b.name)}\\n`;
    text += `Role: ${clean(b.role)}\\n`;
    text += `Tag: ${clean(b.tag)}\\n`;
    text += `Area: ${clean(b.area)}\\n`;
    text += `Max Price: ${money(b.maxPrice)}\\n`;
    text += `Phone: ${clean(b.phone)}\\n`;
    text += `Email: ${clean(b.email)}\\n`;
    text += `Notes: ${clean(b.notes)}\\n\\n`;
  });

  navigator.clipboard.writeText(text);
  alert("✅ Buyer list copied");
}

renderBuyers();
