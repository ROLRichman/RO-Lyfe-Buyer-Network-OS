let buyers = JSON.parse(localStorage.getItem("buyers")) || [];

function saveBuyers(){
  localStorage.setItem("buyers", JSON.stringify(buyers));
}

function renderBuyers(){
  const list = document.getElementById("buyerList");
  list.innerHTML = "";

  buyers.forEach((b, i) => {
    list.innerHTML += `
      <div class="buyer">
        <strong>${b.name}</strong><br>
        ${b.role}<br>
        📍 ${b.area}<br>
        💰 Max: ${b.maxPrice}<br>
        📞 ${b.phone}<br>
        📧 ${b.email}<br>
        📝 ${b.notes}<br>
        <button onclick="deleteBuyer(${i})">Delete</button>
      </div>
    `;
  });
}

function addBuyer(){
  const buyer = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    company: document.getElementById("company").value,
    role: document.getElementById("role").value,
    area: document.getElementById("area").value,
    maxPrice: document.getElementById("maxPrice").value,
    notes: document.getElementById("notes").value
  };

  buyers.push(buyer);
  saveBuyers();
  renderBuyers();

  alert("Buyer / Contractor added.");
}

function deleteBuyer(index){
  buyers.splice(index, 1);
  saveBuyers();
  renderBuyers();
}

function copyBlast(){
  const msg = document.getElementById("dealMsg").value;
  navigator.clipboard.writeText(msg);
  alert("Deal blast copied.");
}

renderBuyers();
