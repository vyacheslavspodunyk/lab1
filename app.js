let passes = [];
let nextId = 1;

const form = document.getElementById("passForm");
const tableBody = document.getElementById("tableBody");
const clearBtn = document.getElementById("clearBtn");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const sortSelect = document.getElementById("sort");

// ===== STORAGE =====
function save() {
    localStorage.setItem("passes", JSON.stringify(passes));
}

function load() {
    const data = localStorage.getItem("passes");
    if (data) {
        passes = JSON.parse(data);
        nextId = passes.length ? Math.max(...passes.map(p => p.id)) + 1 : 1;
    }
}

// ===== READ =====
function readForm() {
    return {
        id: document.getElementById("editId").value,
        userName: document.getElementById("userName").value.trim(),
        reason: document.getElementById("reason").value,
        date: document.getElementById("date").value,
        comment: document.getElementById("comment").value.trim(),
        issuer: document.getElementById("issuer").value.trim()
    };
}

// ===== VALIDATE =====
function clearErrors() {
    document.querySelectorAll(".error-text").forEach(e => e.textContent = "");
    document.querySelectorAll("input, select").forEach(el => el.classList.remove("invalid"));
}

function validate(d) {
    clearErrors();
    let ok = true;

    if (!d.userName) {
        document.getElementById("userNameError").textContent = "Введіть ім’я";
        document.getElementById("userName").classList.add("invalid");
        ok = false;
    }

    if (!d.reason) {
        document.getElementById("reasonError").textContent = "Оберіть причину";
        ok = false;
    }

    if (!d.date) {
        document.getElementById("dateError").textContent = "Оберіть дату";
        ok = false;
    }

    if (!d.issuer) {
        document.getElementById("issuerError").textContent = "Введіть видавця";
        ok = false;
    }

    return ok;
}

// ===== ADD / UPDATE =====
function upsert(d) {
    if (d.id) {
        const item = passes.find(p => p.id === Number(d.id));
        Object.assign(item, d);
    } else {
        passes.push({ ...d, id: nextId++ });
    }
}

// ===== DELETE =====
function remove(id) {
    passes = passes.filter(p => p.id !== id);
}

// ===== RENDER =====
function render() {
    let data = [...passes];

    // search
    const q = searchInput.value.toLowerCase();
    if (q) data = data.filter(p => p.userName.toLowerCase().includes(q));

    // filter
    if (filterSelect.value) {
        data = data.filter(p => p.reason === filterSelect.value);
    }

    // sort
    if (sortSelect.value === "dateAsc") {
        data.sort((a, b) => a.date.localeCompare(b.date));
    }
    if (sortSelect.value === "dateDesc") {
        data.sort((a, b) => b.date.localeCompare(a.date));
    }

    tableBody.innerHTML = data.map(p => `
    <tr>
      <td>${p.userName}</td>
      <td>${p.reason}</td>
      <td>${p.date}</td>
      <td>${p.comment}</td>
      <td>${p.issuer}</td>
      <td>
        <button data-edit="${p.id}">✏️</button>
        <button data-del="${p.id}">🗑</button>
      </td>
    </tr>
  `).join("");
}

// ===== EDIT =====
function fillForm(id) {
    const p = passes.find(x => x.id === id);

    document.getElementById("editId").value = p.id;
    document.getElementById("userName").value = p.userName;
    document.getElementById("reason").value = p.reason;
    document.getElementById("date").value = p.date;
    document.getElementById("comment").value = p.comment;
    document.getElementById("issuer").value = p.issuer;

    document.getElementById("formTitle").textContent = "Редагування";
}

// ===== EVENTS =====
form.addEventListener("submit", e => {
    e.preventDefault();

    const data = readForm();
    if (!validate(data)) return;

    upsert(data);
    save();
    render();
    form.reset();
    document.getElementById("editId").value = "";
});

clearBtn.addEventListener("click", () => {
    form.reset();
    clearErrors();
});

tableBody.addEventListener("click", e => {
    if (e.target.dataset.del) {
        remove(Number(e.target.dataset.del));
        save();
        render();
    }

    if (e.target.dataset.edit) {
        fillForm(Number(e.target.dataset.edit));
    }
});

searchInput.addEventListener("input", render);
filterSelect.addEventListener("change", render);
sortSelect.addEventListener("change", render);

load();
render();