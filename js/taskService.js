import { state } from "./state.js";
import { saveTasks } from "./storage.js";
import { openToast } from "./toast.js";
import { setId } from "./idGenerator.js";
import { sort } from "./render.js";
import { validateInputs, resetForm } from "./validation.js";
import { colseModal } from "./modal.js";
import { todoLang } from "../lang/en.js";
import {
  titleTaskInput,
  bodyTaskInput,
  storeTaskButton,
  sortListElement,
  cancelEditButton,
} from "./dom.js";

export function storeTask() {
  if (!state.isEditing) createTask();
  else updateTask();
}

function createTask() {
  try {
    state.tasks.push({
      id: setId(),
      title: titleTaskInput.value,
      body: bodyTaskInput.value,
    });
    saveTasks(state.tasks);
    openToast("addSuccessful");
    sort();
    resetForm();
  } catch (e) {}
}

function updateTask() {
  const taskindex = state.tasks.findIndex((t) => t.id === state.editingId);
  state.tasks.splice(taskindex, 1, {
    id: state.editingId,
    title: titleTaskInput.value,
    body: bodyTaskInput.value,
  });
  saveTasks(state.tasks);
  openToast("updateSuccessful");
  cancelEditButton.style.display = "none";
  storeTaskButton.innerText = todoLang.addTask;
  resetForm();
  sort();
}

export function deleteTask() {
  const tempList = state.tasks.filter((t) => t.id != state.deletingId);
  state.tasks = tempList;
  saveTasks(state.tasks);
  openToast("deleteSuccessful");
  sort();
  resetForm();
  colseModal();
}
