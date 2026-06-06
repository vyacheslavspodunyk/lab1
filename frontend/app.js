const PASSES_API_URL = "http://localhost:3000/api/passes";
const USERS_API_URL = "http://localhost:3000/api/users";
const DEMO_USER_ID = "1";

const state = {
    users: [],
    selectedUserId: null,
    items: [],
    editingId: null,
    status: "idle",
    error: null,
    filters: {
        search: "",
        reason: "",
        sort: ""
    }
};

const userSelect = document.getElementById("userSelect");
const userFormNameInput = document.getElementById("userFormName");
const createUserBtn = document.getElementById("createUserBtn");
const updateUserBtn = document.getElementById("updateUserBtn");
const deleteUserBtn = document.getElementById("deleteUserBtn");
const selectedUserInfo = document.getElementById("selectedUserInfo");

const form = document.getElementById("passForm");
const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const sortSelect = document.getElementById("sort");
const clearBtn = document.getElementById("clearBtn");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const listStatus = document.getElementById("listStatus");
const notice = document.getElementById("notice");

const reasonInput = document.getElementById("reason");
const dateInput = document.getElementById("date");
const commentInput = document.getElementById("comment");
const issuerInput = document.getElementById("issuer");

init();

async function init() {
    attachHandlers();
    await loadUsers();
    await loadItems();
}

function attachHandlers() {
    form.addEventListener("submit", onSubmit);
    tableBody.addEventListener("click", onTableClick);

    userSelect.addEventListener("change", () => {
        state.selectedUserId = Number(userSelect.value);
        syncSelectedUserToForm();
    });

    createUserBtn.addEventListener("click", createUser);
    updateUserBtn.addEventListener("click", updateUser);
    deleteUserBtn.addEventListener("click", deleteUser);

    searchInput.addEventListener("input", () => {
        state.filters.search = searchInput.value.toLowerCase();
        render();
    });

    filterSelect.addEventListener("change", () => {
        state.filters.reason = filterSelect.value;
        render();
    });

    sortSelect.addEventListener("change", () => {
        state.filters.sort = sortSelect.value;
        render();
    });

    clearBtn.addEventListener("click", resetForm);
}

function getHeaders(hasBody = false) {
    const headers = {
        "X-Demo-UserId": DEMO_USER_ID
    };

    if (hasBody) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
}

async function request(url, options = {}) {
    let response;

    try {
        response = await fetch(url, options);
    } catch (err) {
        throw {
            status: 0,
            message: "Помилка мережі або CORS. Перевір, чи запущений бекенд.",
            details: err.message
        };
    }

    if (response.status === 204) {
        return null;
    }

    const text = await response.text();

    if (response.ok) {
        return text ? JSON.parse(text) : null;
    }

    let errorBody = null;

    try {
        errorBody = text ? JSON.parse(text) : null;
    } catch {
        errorBody = null;
    }

    throw {
        status: response.status,
        message: errorBody?.error?.message || errorBody?.message || "HTTP помилка",
        details: text
    };
}

async function loadUsers() {
    try {
        const data = await request(USERS_API_URL, {
            method: "GET",
            headers: getHeaders()
        });

        state.users = data.items || data || [];

        if (state.users.length > 0 && !state.selectedUserId) {
            state.selectedUserId = state.users[0].id;
        }

        renderUsers();
        syncSelectedUserToForm();
    } catch (err) {
        showNotice(`Помилка завантаження користувачів: ${err.message}`);
    }
}

function renderUsers() {
    userSelect.textContent = "";

    if (state.users.length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Немає користувачів";
        userSelect.appendChild(option);
        return;
    }

    state.users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = `${user.id} — ${user.name}`;
        userSelect.appendChild(option);
    });

    if (state.selectedUserId) {
        userSelect.value = String(state.selectedUserId);
    }
}

function getSelectedUser() {
    return state.users.find(user => user.id === state.selectedUserId) || null;
}

function syncSelectedUserToForm() {
    const user = getSelectedUser();

    if (!user) {
        userFormNameInput.value = "";
        selectedUserInfo.textContent = "Користувач не обраний";
        return;
    }

    userFormNameInput.value = user.name;
    selectedUserInfo.textContent = `Обраний користувач: ${user.name}`;
}

async function createUser() {
    const name = userFormNameInput.value.trim();

    if (!name) {
        showNotice("Введіть ім’я користувача");
        return;
    }

    try {
        const created = await request(USERS_API_URL, {
            method: "POST",
            headers: getHeaders(true),
            body: JSON.stringify({
                name,
                email: `${Date.now()}@demo.local`
            })
        });

        state.selectedUserId = created.id;
        showNotice("Користувача створено");
        await loadUsers();
    } catch (err) {
        showNotice(`Помилка створення користувача: ${err.message}`);
    }
}

async function updateUser() {
    const user = getSelectedUser();
    const name = userFormNameInput.value.trim();

    if (!user) {
        showNotice("Спочатку оберіть користувача");
        return;
    }

    if (!name) {
        showNotice("Введіть ім’я користувача");
        return;
    }

    try {
        await request(`${USERS_API_URL}/${user.id}`, {
            method: "PUT",
            headers: getHeaders(true),
            body: JSON.stringify({
                name,
                email: user.email || `${user.id}@demo.local`
            })
        });

        showNotice("Користувача змінено");
        await loadUsers();
        await loadItems();
    } catch (err) {
        showNotice(`Помилка зміни користувача: ${err.message}`);
    }
}

async function deleteUser() {
    const user = getSelectedUser();

    if (!user) {
        showNotice("Спочатку оберіть користувача");
        return;
    }

    const confirmed = confirm("Точно видалити користувача?");
    if (!confirmed) return;

    try {
        await request(`${USERS_API_URL}/${user.id}`, {
            method: "DELETE",
            headers: getHeaders()
        });

        state.selectedUserId = null;
        showNotice("Користувача видалено");
        await loadUsers();
        await loadItems();
    } catch (err) {
        showNotice(`Помилка видалення користувача: ${err.message}`);
    }
}

async function loadItems() {
    state.status = "loading";
    state.error = null;
    render();

    try {
        const data = await request(PASSES_API_URL, {
            method: "GET",
            headers: getHeaders()
        });

        state.items = data.items || [];
        state.status = state.items.length === 0 ? "empty" : "success";
    } catch (err) {
        state.items = [];
        state.status = "error";
        state.error = err;
    }

    render();
}

async function onSubmit(e) {
    e.preventDefault();

    const dto = readForm();
    if (!validate(dto)) return;

    setFormEnabled(false);

    try {
        if (state.editingId) {
            await updateItem(state.editingId, dto);
            showNotice("Пропуск оновлено");
        } else {
            await createItem(dto);
            showNotice("Пропуск створено");
        }

        resetForm();
        await loadItems();
    } catch (err) {
        showNotice(`Помилка: ${err.message}`);
    } finally {
        setFormEnabled(true);
    }
}

async function createItem(dto) {
    return await request(PASSES_API_URL, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(dto)
    });
}

async function updateItem(id, dto) {
    return await request(`${PASSES_API_URL}/${id}`, {
        method: "PUT",
        headers: getHeaders(true),
        body: JSON.stringify(dto)
    });
}

async function deleteItem(id) {
    return await request(`${PASSES_API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    });
}

async function onTableClick(e) {
    const deleteId = e.target.dataset.del;
    const editId = e.target.dataset.edit;

    if (deleteId) {
        const confirmed = confirm("Точно видалити цей пропуск?");
        if (!confirmed) return;

        try {
            await deleteItem(Number(deleteId));
            showNotice("Пропуск видалено");
            await loadItems();
        } catch (err) {
            showNotice(`Помилка видалення: ${err.message}`);
        }
    }

    if (editId) {
        startEdit(Number(editId));
    }
}

function render() {
    renderStatus();

    let data = [...state.items];

    if (state.filters.search) {
        data = data.filter(item =>
            String(item.userName || "").toLowerCase().includes(state.filters.search)
        );
    }

    if (state.filters.reason) {
        data = data.filter(item => item.reason === state.filters.reason);
    }

    if (state.filters.sort === "dateAsc") {
        data.sort((a, b) => a.date.localeCompare(b.date));
    }

    if (state.filters.sort === "dateDesc") {
        data.sort((a, b) => b.date.localeCompare(a.date));
    }

    tableBody.textContent = "";

    data.forEach(item => {
        const tr = document.createElement("tr");

        const idTd = createTd(item.id);
        const userTd = createTd(item.userName);
        const reasonTd = createTd(translateReason(item.reason));
        const dateTd = createTd(item.date);
        const commentTd = createTd(item.comment || "-");
        const issuerTd = createTd(item.issuer);

        const actionsTd = document.createElement("td");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Ред.";
        editBtn.dataset.edit = item.id;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Вид.";
        deleteBtn.dataset.del = item.id;

        actionsTd.append(editBtn, deleteBtn);
        tr.append(idTd, userTd, reasonTd, dateTd, commentTd, issuerTd, actionsTd);
        tableBody.appendChild(tr);
    });
}

function createTd(value) {
    const td = document.createElement("td");
    td.textContent = value ?? "-";
    return td;
}

function renderStatus() {
    if (state.status === "loading") {
        listStatus.textContent = "Завантаження...";
        return;
    }

    if (state.status === "empty") {
        listStatus.textContent = "Поки що немає записів.";
        return;
    }

    if (state.status === "error") {
        listStatus.textContent = `Помилка: ${state.error?.message || "невідома"}`;
        return;
    }

    listStatus.textContent = "";
}

function readForm() {
    const user = getSelectedUser();

    return {
        userName: user ? user.name : "",
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

    const matchedUser = state.users.find(user => user.name === item.userName);
    if (matchedUser) {
        state.selectedUserId = matchedUser.id;
        userSelect.value = String(matchedUser.id);
        syncSelectedUserToForm();
    }

    reasonInput.value = item.reason;
    dateInput.value = item.date;
    commentInput.value = item.comment || "";
    issuerInput.value = item.issuer;

    formTitle.textContent = "Редагування пропуску";
    submitBtn.textContent = "Оновити";
}

function resetForm() {
    state.editingId = null;
    form.reset();
    clearErrors();
    syncSelectedUserToForm();

    formTitle.textContent = "Додати пропуск";
    submitBtn.textContent = "Зберегти";
}

function validate(dto) {
    clearErrors();

    let valid = true;

    if (!dto.userName) {
        showNotice("Оберіть або створіть користувача");
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

function showError(inputId, errorId, message) {
    document.getElementById(inputId).classList.add("invalid");
    document.getElementById(errorId).textContent = message;
}

function clearErrors() {
    document.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
    document.querySelectorAll(".error-text").forEach(el => el.textContent = "");
}

function showNotice(text) {
    notice.textContent = text;

    setTimeout(() => {
        notice.textContent = "";
    }, 4000);
}

function setFormEnabled(enabled) {
    submitBtn.disabled = !enabled;
    clearBtn.disabled = !enabled;
}

function translateReason(reason) {
    const map = {
        study: "Навчання",
        work: "Робота",
        repair: "Ремонт",
        other: "Інше"
    };

    return map[reason] || reason;
}