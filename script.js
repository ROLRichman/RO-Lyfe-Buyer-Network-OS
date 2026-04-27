let buyers = JSON.parse(localStorage.getItem("buyers")) || [];

function save(){
  localStorage.setItem("buyers", JSON.stringify(buyers));
}

function safe(v){
  return v || "—";
}

function render(){
  const list = document.getElementById("buyerList");
  list.innerHTML = "";

  buyers.forEach((b, i) => {
    list.innerHTML += `
      <div class="buyer">
        <b>${safe(b.name)}</b><br>
        ${safe(b.role)}<br>
        📍 ${safe(b.area)}<br>
        💰 Max: $${safe(b.maxPrice)}<br>
        📞 ${safe(b.phone)}<br>
        📧 ${safe(b.email)}<br>
        📝 ${safe(b.notes)}<br>

        <div class="actions">
          <button onclick="textBuyer(${i})">Text</button>
          <button onclick="emailBuyer(${i})">Email</button>
          <button onclick="deleteBuyer(${i})">Delete</button>
        </div>
      </div>
    `;
  });
}

function addBuyer(){
  const buyer = {
    name: name.value,
    phone: phone.value,
    email: email.value,
    company: company.value,
    role: role.value,
    area: area.value,
    maxPrice: Number(maxPrice.value),
    notes: notes.value
  };

  buyers.push(buyer);
  save();
  render();

  alert("✅ Added");
}

function deleteBuyer(i){
  buyers.splice(i,1);
  save();
  render();
}

function filterBuyers(){
  const search = document.getElementById("search").value.toLowerCase();

  const cards = document.querySelectorAll(".buyer");

  cards.forEach(card=>{
    card.style.display =
      card.innerText.toLowerCase().includes(search) ? "block" : "none";
  });
}

function copyBlast(){
  navigator.clipboard.writeText(dealMsg.value);
  alert("Copied");
}

function sendEmailBlast(){
  window.open(`mailto:?subject=Deal&body=${encodeURIComponent(dealMsg.value)}`);
}

function sendSMSBlast(){
  window.open(`sms:?body=${encodeURIComponent(dealMsg.value)}`);
}

function textBuyer(i){
  const b = buyers[i];
  window.open(`sms:${b.phone}?body=${encodeURIComponent(dealMsg.value)}`);
}

function emailBuyer(i){
  const b = buyers[i];
  window.open(`mailto:${b.email}?subject=Deal&body=${encodeURIComponent(dealMsg.value)}`);
}

function matchDeal(){
  const area = dealArea.value.toLowerCase();
  const price = Number(dealPrice.value);

  const results = buyers.filter(b =>
    b.area.toLowerCase().includes(area) &&
    price <= b.maxPrice
  );

  const box = document.getElementById("matchResults");

  if(results.length === 0){
    box.innerHTML = "❌ No matching buyers";
    return;
  }

  box.innerHTML = "<b>🔥 MATCHED BUYERS:</b><br><br>";

  results.forEach(b=>{
    box.innerHTML += `
      ${b.name} — ${b.phone} ($${b.maxPrice})<br>
    `;
  });
}

render();
