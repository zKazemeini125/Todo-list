//#region Definition of constants
const titleInput = document.getElementById("inputTitle");
const bodyInput = document.getElementById("inputBody");
const taskList = document.getElementById("taskList");
const addButton = document.getElementById("addButton");
const cancelEditButton = document.getElementById("cancelEdit");
const searchInput = document.getElementById("searchInput");
const clearButt = document.getElementById("clear");
const sortList = document.getElementById("sort");
//! modal props
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalButtons = document.getElementById("modalButtonHolder");
//#endregion

//#region Definition of variables
let state = {
  tasks: [],
  isEditing: false,
  editingId: null,
  deletingId: null,
};

let id = 0;
let title = titleInput.value;
let body = bodyInput.value;
let constantStrings = {
  addTaskStr: "add task",
  updateTaskStr: "update task",
  deleteTitle: "Delete Task",
};
//#endregion

//#region Initial function calls
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  checkTaskList();
  resetForm();
  setId();
});
//#endregion

//! Functions
//#region The body of the functions that are called first.
function loadData() {
  const tasksTemp = getItemLS();

  if (tasksTemp && tasksTemp.length > 0) {
    state.tasks = tasksTemp;
    sortTasks();
  }
}

//! Check if the task list is empty to display the empty list message
function checkTaskList() {
  const emptyMsg = document.getElementById("emptyMsg");
  emptyMsg.style.display = state.tasks.length == 0 ? "block" : "none";
}

function checkInputs() {
  titleInput.value.trim() || bodyInput.value.trim()
    ? (addButton.disabled = false)
    : (addButton.disabled = true);
}
titleInput.addEventListener("input", checkInputs);
bodyInput.addEventListener("input", checkInputs);

function setId() {
  const tasksTemp = getItemLS();
  let tempId = [];

  if (tasksTemp && tasksTemp.length > 0) {
    id = tasksTemp.length + 1;
    tasksTemp.forEach((t) => {
      tempId.push(t.id);
    });
    loop1: for (let index = tasksTemp.length; index >= 0; index--) {
      if (tempId.includes(id)) id--;
      else break loop1;
    }
    loop2: for (let i = 0; i < tasksTemp.length; i++) {
      if (tempId.includes(id)) id++;
      else break loop2;
    }
  }
}
//#endregion

//#region CRUD
function addTask() {
  if (!state.isEditing) {
    setId();
    state.tasks.push({
      id: id,
      title: titleInput.value,
      body: bodyInput.value,
    });
    id++;
    setItemLS();
    sortTasks();
    resetForm();
  } else {
    tasks.splice(taskIndex, 1, {
      title: titleInput.value,
      body: bodyInput.value,
      id: task.id, //چون id یک مقدار عددی است spread نمیشود باید حتما براش مقدار قرار داده شود
    });
    setItemLS();
    state.isEditing = false;
    addButton.innerText = constantStrings.addTaskStr;
    cancelEditButton.style.display = "none";
    state.editingId = null;
    sortTasks();
    resetForm();
  }
}

function searchTask(e) {
  const value = e.target.value.trim().toLowerCase();
  const searchResult = tasks.filter((item) => {
    return (
      item.title.trim().toLowerCase().includes(value) ||
      item.body.trim().toLowerCase().includes(value)
    );
  });
  sortTasks(searchResult);

  if (searchInput.value && searchInput.value.length > 0)
    clearButt.style.visibility = "visible";
  else clearButt.style.visibility = "hidden";
}
searchInput.addEventListener("input", searchTask);

function setItemLS() {
  // localStorage.setItem
  localStorage.setItem("state.tasks", JSON.stringify(state.tasks));
}

function getItemLS() {
  // localStorage.getItem
  return JSON.parse(localStorage.getItem("tasks"));
}

function renderList(list = tasks) {
  checkTaskList();
  taskList.innerHTML = "";
  for (const item of list) {
    // باید برای دکمه حتما type تعریف کنی اگر نه به صورت پیش فرض میاد یک نوع وقتی نوع دکمه را مشخص نکنی، به صورت پیش‌فرض type="submit" است و فرم را ارسال می‌کند.
    const li = Object.assign(document.createElement("li"), {
      id: item.id,
      innerHTML: `<div class="flex-row br-b border-lightgray p-2">
              <div class="flex-col w-80" style="{height: 100%}">
                <h4 class="m-1 titleList">${item.title}</h4>
                <p class="m-1 bodyList">${item.body}</p>
                </div>
                <div class="flex-col w-20 justify-center align-end">
                  <div class="flex-row actionContainer">
                    <button type='button' class="m-1" onclick=edit(${item.id}) ${state.editingId == item.id ? "disabled" : ""}>edit</button>
                    <button type='button' class="m-1" onclick=showDeleteModal(${item.id}) ${state.editingId == item.id ? "disabled" : ""} >delet</button>
                    </div>
                    </div>
                    </div>`,
    });
    taskList.appendChild(li);
  }
}

function deleteTask() {
  tasks = tasks.filter((task) => task.id != deletingId);
  setItemLS();
  sortTasks();
  colseModal();
}

function edit(taskNumber) {
  state.editingId = taskNumber;
  let task = state.tasks.find((item) => item.id == taskNumber);
  let taskIndex = state.tasks.findIndex((item) => item.id == taskNumber);
  titleInput.value = task.title;
  bodyInput.value = task.body;
  state.isEditing = true;
  addButton.innerText = constantStrings.updateTaskStr;
  cancelEditButton.style.display = "block";

  checkInputs();
  //renderList();
  sortTasks();
}
//#endregion

//#region Optimize form display
function cancelEditTask() {
  cancelEditButton.style.display = "none";
  addButton.innerText = constantStrings.addTaskStr;
  state.isEditing = false;
  state.editingId = null;
  //renderList();
  sortTasks();
  resetForm();
}

function resetForm() {
  titleInput.value = null;
  bodyInput.value = null;
  addButton.disabled = true;
  searchInput.value = null;
}

function clearSearchInput() {
  searchInput.value = "";
  clearButt.style.visibility = "hidden";
  //renderList();
  sortTasks();
}

function sortTasks(list = state.tasks) {
  switch (sortList.value) {
    case "newest":
      const newest = [...list].sort((a, b) => b.id - a.id); // Newest
      renderList(newest);

      break;
    case "oldest":
      const oldest = [...list].sort((a, b) => a.id - b.id); // Oldest
      renderList(oldest);
      break;

    case "az":
      const aToZ = [...list].sort((a, b) => a.title.localeCompare(b.title)); // A to Z
      renderList(aToZ);
      break;

    case "za":
      const zToA = [...list].sort((a, b) => b.title.localeCompare(a.title)); // Z to A
      renderList(zToA);
      break;

    default:
      renderList(list);
      break;
  }
}
sortList.addEventListener("change", () => sortTasks());
//#endregion

//#region Modal
//! کنترل نمایش مدال برای دیلیت
function showDeleteModal(taskNumber) {
  deletingId = taskNumber;
  task = tasks.find((item) => item.id === deletingId);
  setDeletModal(task);
  modal.style.display = "block";
}

function setDeletModal(Itask) {
  modalTitle.innerText = constantStrings.deleteTitle;
  modalBody.innerHTML = `Are you sure you want to delete ${Itask.title} from the task list?`;
  modalButtons.innerHTML = `<button type="button" class="m-1" onclick="deleteTask()">delete</button>
          <button type="button" class="m-1" onclick="colseModal()">cancel</button>`;
}

function colseModal() {
  modal.style.display = "none";
}
//#endregion
