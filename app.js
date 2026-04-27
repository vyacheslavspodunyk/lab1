// ================= STATE =================
const state = {
    items: [],
    editingId: null,
    filters: {
        search: "",
        reason: "",
        sort: ""
    }
};

// ================= DOM =================
const form = document.getElementById("passForm");
const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const sortSelect = document.getElementById("sort");
const clearBtn = document.getElementById("clearBtn");
const formTitle = document.getElementById("formTitle");

// inputs
const userNameInput = document.getElementById("userName");
const reasonInput = document.getElementById("reason");
const dateInput = document.getElementById("date");
const commentInput = document.getElementById("comment");
const issuerInput = document.getElementById("issuer");

// ================= INIT =================
(function init() {
    attachHandlers();
    load();
    render();
})();

// ================= HANDLERS =================
function attachHandlers() {
    form.addEventListener("submit", onSubmit);

    tableBody.addEventListener("click", onTableClick);

    searchInput.addEventListener("input", (e) => {
        state.filters.search = e.target.value.toLowerCase();
        render();
    });

    filterSelect.addEventListener("change", (e) => {
        state.filters.reason = e.target.value;
        render();
    });

    sortSelect.addEventListener("change", (e) => {
        state.filters.sort = e.target.value;
        render();
    });

    clearBtn.addEventListener("click", resetForm);
}

// ================= STORAGE =================
function save() {
    localStorage.setItem("passes", JSON.stringify(state.items));
}

function load() {
    const data = localStorage.getItem("passes");
    if (data) {
        state.items = JSON.parse(data);
    }
}

// ================= SUBMIT =================
function onSubmit(e) {
    e.preventDefault();

    const dto = readForm();
    if (!validate(dto)) return;

    if (state.editingId) {
        updateItem(state.editingId, dto);
    } else {
        addItem(dto);
    }

    save();
    render();
    resetForm();
}

// ================= CRUD =================
function addItem(dto) {
    const newItem = {
        ...dto,
        id: Date.now()
    };
    state.items.push(newItem);
}

function updateItem(id, dto) {
    const item = state.items.find(x => x.id === id);
    if (item) Object.assign(item, dto);
}

function deleteItem(id) {
    state.items = state.items.filter(x => x.id !== id);
    save();
    render();
}

// ================= TABLE CLICK =================
function onTableClick(e) {
    const del = e.target.dataset.del;
    const edit = e.target.dataset.edit;

    if (del) {
        deleteItem(Number(del));
    }

    if (edit) {
        startEdit(Number(edit));
    }
}

// ================= RENDER =================
function render() {
    let data = [...state.items];

    // search
    if (state.filters.search) {
        data = data.filter(p =>
            p.userName.toLowerCase().includes(state.filters.search)
        );
    }

    // filter
    if (state.filters.reason) {
        data = data.filter(p => p.reason === state.filters.reason);
    }

    // sort
    if (state.filters.sort === "dateAsc") {
        data.sort((a, b) => a.date.localeCompare(b.date));
    }

    if (state.filters.sort === "dateDesc") {
        data.sort((a, b) => b.date.localeCompare(a.date));
    }

    tableBody.innerHTML = "";

    data.forEach(p => {
        tableBody.innerHTML += `
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
        `;
    });
}

// ================= FORM =================
function readForm() {
    return {
        userName: userNameInput.value.trim(),
        reason: reasonInput.value,
        date: dateInput.value,
        comment: commentInput.value.trim(),
        issuer: issuerInput.value.trim()
    };
}

function startEdit(id) {
    const item = state.items.find(x => x.id === id);
    if (!item) return;

    state.editingId = id;

    userNameInput.value = item.userName;
    reasonInput.value = item.reason;
    dateInput.value = item.date;
    commentInput.value = item.comment;
    issuerInput.value = item.issuer;

    formTitle.textContent = "Редагування";
}

function resetForm() {
    state.editingId = null;
    form.reset();
    clearErrors();

    formTitle.textContent = "Новий пропуск";
}

// ================= VALIDATION =================
function validate(dto) {
    clearErrors();
    let valid = true;

    if (!dto.userName) {
        showError("userName", "userNameError", "Введіть ім’я");
        valid = false;
    }

    if (!dto.reason) {
        showError("reason", "reasonError", "Оберіть причину");
        valid = false;
    }

    if (!dto.date) {
        showError("date", "dateError", "Оберіть дату");
        valid = false;
    }

    if (!dto.issuer) {
        showError("issuer", "issuerError", "Введіть видавця");
        valid = false;
    }

    return valid;
}

// ================= ERRORS =================
function showError(inputId, errorId, message) {
    document.getElementById(inputId).classList.add("invalid");
    document.getElementById(errorId).textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
    document.querySelectorAll(".error-text").forEach(el => el.textContent = "");
}