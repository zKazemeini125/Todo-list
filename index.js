//#region Definition of constants
const titleTaskInput = document.getElementById("inputTitle");
const bodyTaskInput = document.getElementById("inputBody");
const taskListElement = document.getElementById("taskList");
const storeTaskButton = document.getElementById("storeTasks");
const cancelEditButton = document.getElementById("cancelEdit");
//! sorting & filtring
const searchInput = document.getElementById("searchInput");
const clearSearchButton = document.getElementById("clearSearch");
const sortListElement = document.getElementById("selectSort");

//! modal props
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalButtonHolder = document.getElementById("modalButtonHolder");

//! toast props
//#endregion
const toast = document.getElementById("toast");
const toastTextElement = document.getElementById("toastText");
const toastCloseButton = document.getElementById("closeToast");

//#region Variables
let id = 0;
let state = {
  tasks: [],
  editingId: null,
  isEditing: false,
  deletingId: null,
  searchText: null,
  //isShowToast: false,
};
let constantStrings = {
  addTask: "add task",
  updateTask: "update task",
  deleteModalTitle: "Delete Task",
  toastUpdateTask: "Edit completed successfully.",
  toastAddTask: "New task added successfully.",
  toastDeleteTask: "Task deletion was successful.",
  toastError: "The operation encountered an error.",
};
//#endregion

//#region addEventListener
titleTaskInput.addEventListener("input", validateInputs);
bodyTaskInput.addEventListener("input", validateInputs);
document.addEventListener("DOMContentLoaded", initialSetting);
searchInput.addEventListener("input", filterTasks);
sortListElement.addEventListener("change", () => sort());
//#endregion

//#region Initial form settings
function initialSetting() {
  initLoadData();
  validateInputs();
  setId();
  sort();
  resetForm();
}

function validateInputs() {
  titleTaskInput.value.trim() || bodyTaskInput.value.trim()
    ? (storeTaskButton.disabled = false)
    : (storeTaskButton.disabled = true);
}

function setId() {
  id++;
  let IDs = [];
  if (state.tasks && state.tasks.length > 0) {
    id = state.tasks.length + 1;
    state.tasks.forEach((element) => {
      IDs.push(element.id);
    });

    loop2: for (let index = state.tasks.length; index >= 0; index--) {
      if (IDs.includes(id)) id--;
      else break loop2;
    }
    loop1: for (let index = 0; index < state.tasks.length; index++) {
      if (IDs.includes(id)) id++;
      else break loop1;
    }
  }
}

function initLoadData() {
  const temp = loadTasks();

  if (temp && temp.length > 0) {
    state.tasks = temp;
  }
}

function toggleEmptyMsg() {
  const emptyMsg = document.getElementById("emptyMsg");
  emptyMsg.style.display = state.tasks.length === 0 ? "block" : "none";
}

function renderTaskList(list = state.tasks) {
  toggleEmptyMsg();
  taskListElement.innerHTML = "";
  for (const element of list) {
    const li = Object.assign(document.createElement("li"), {
      id: element.id,
      innerHTML: `<div class="flex-row border-bottom border-lightgray p-2">
              <div class="flex-col w-80" style="{height: 100%}">
                <h4 class="m-1 titleList">${highlight(element.title)}</h4>
                <p class="m-1 bodyList">${highlight(element.body)}</p>
                </div>
                <div class="flex-col w-20 justify-center align-end">
                  <div class="flex-row actionContainer">
                    <button type='button' class="m-1" onclick=toggleEditMode(${element.id}) ${state.editingId == element.id ? "disabled" : ""}>edit</button>
                    <button type='button' class="m-1" onclick=openDeleteModal(${element.id}) ${state.editingId == element.id ? "disabled" : ""} >delete</button>
                    </div>
                    </div>
                    </div>`,
    });
    taskListElement.appendChild(li);
  }
}

function resetForm() {
  titleTaskInput.value = null;
  bodyTaskInput.value = null;
  storeTaskButton.disabled = true;
  state.editingId = null;
  state.isEditing = false;
  searchInput.value = null;
  state.searchText = null;
}

//#endregion

//#region CRUD
function storeTask() {
  if (!state.isEditing) createTask();
  else updateTask();
}

function createTask() {
  try {
    state.tasks.push({
      id: id,
      title: titleTaskInput.value,
      body: bodyTaskInput.value,
    });
    saveTasks();
    openToast("addSuccessful");
    setId();
    sort();
    resetForm();
  } catch (e) {
    console.log(e);
    openToast("error");
  }
}

function updateTask() {
  const taskindex = state.tasks.findIndex((t) => t.id === state.editingId);
  state.tasks.splice(taskindex, 1, {
    id: state.editingId,
    title: titleTaskInput.value,
    body: bodyTaskInput.value,
  });
  saveTasks();
  openToast("updateSuccessful");
  cancelEditButton.style.display = "none";
  storeTaskButton.innerText = constantStrings.addTask;
  resetForm();
  sort();
}

function deleteTask() {
  const tempList = state.tasks.filter((t) => t.id != state.deletingId);
  state.tasks = tempList;
  modal.style.display = "none";
  saveTasks();
  openToast("deleteSuccessful");
  sort();
  resetForm();
}

function filterTasks(e) {
  state.searchText = e.target.value;
  const searchList = state.tasks.filter((element) => {
    return (
      element.title.trim().toLowerCase().includes(state.searchText) ||
      element.body.trim().toLowerCase().includes(state.searchText)
    );
  });

  sort(searchList);

  if (searchInput.value && searchInput.value.length > 0) {
    clearSearchButton.style.visibility = "visible";
  } else clearSearchButton.style.visibility = "hidden";
}

function sort(list = state.tasks) {
  console.log(list);

  switch (sortListElement.value) {
    case "az":
      const AToZ = [...list].sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
      renderTaskList(AToZ);
      break;
    case "za":
      const ZToA = [...list].sort((a, b) => {
        return b.title.localeCompare(a.title);
      });
      renderTaskList(ZToA);
      break;
    default:
      renderTaskList(list);
      break;
  }
}
//#endregion

//#region Local storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(state.tasks));
}

function loadTasks() {
  return JSON.parse(localStorage.getItem("tasks"));
}
//#endregion

//#region Display control
function toggleEditMode(taskId) {
  state.editingId = taskId;
  cancelEditButton.style.display = "block";
  storeTaskButton.innerText = constantStrings.updateTask;
  const task = state.tasks.find((t) => t.id === state.editingId);
  titleTaskInput.value = task.title;
  bodyTaskInput.value = task.body;
  state.isEditing = true;
  location.hash = "#formAria";

  titleTaskInput.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
  titleTaskInput.focus();
  sort();
}

function openDeleteModal(taskId) {
  modal.style.display = "block";
  state.deletingId = taskId;
  modalTitle.innerText = constantStrings.deleteModalTitle;
  const selectedTask = state.tasks.find((t) => t.id === taskId);
  modalBody.innerHTML = `<p>Are you sure you want to delete 
  <span style="text-decoration: underline; font-weight: bolder; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; 
  -webkit-line-clamp: 1;">"${selectedTask.title}"</span>
   from task list?</p>
   <p style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; 
  -webkit-line-clamp: 2; margin-bottom: 2rem">${selectedTask.body}</p>`;
  modalButtonHolder.innerHTML = `<button type="button" class="m-1" onclick="deleteTask()">confirm</button>`;
}

function colseModal() {
  state.deletingId = null;
  modal.style.display = "none";
}

function cancelEditTask() {
  storeTaskButton.innerText = constantStrings.addTask;
  cancelEditButton.style.display = "none";
  resetForm();
  sort();
}

function highlight(text) {
  if (!state.searchText) return text;
  const regex = new RegExp(`(${state.searchText})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

function clearinputSearch() {
  searchInput.value = null;
  state.searchText = null;
  clearSearchButton.style.visibility = "hidden";
  sort();
}

function closeToast() {
  toast.classList.remove(
    "show",
    "error",
    "addSuccessful",
    "updateSuccessful",
    "deleteSuccessful",
  );
}

function openToast(type) {
  toast.classList.add("show");
  toast.classList.add(type);
  switch (type) {
    case "error":
      toastTextElement.innerText = constantStrings.toastError;
      break;
    case "addSuccessful":
      toastTextElement.innerText = constantStrings.toastAddTask;
      break;
    case "updateSuccessful":
      toastTextElement.innerText = constantStrings.toastUpdateTask;
      break;
    case "deleteSuccessful":
      toastTextElement.innerText = constantStrings.toastDeleteTask;
      break;
    default:
      break;
  }
  setTimeout(() => {
    closeToast();
  }, 2700);
}
//#endregion
