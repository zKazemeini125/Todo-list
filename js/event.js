import { loadTasks } from "./storage.js";
import { state } from "./state.js";
import { validateInputs, resetForm } from "./validation.js";
import { setId } from "./idGenerator.js";
import { sort } from "./render.js";
import {
  titleTaskInput,
  bodyTaskInput,
  searchInput,
  taskListElement,
  sortListElement,
  cancelEditButton,
  clearSearchButton,
  storeTaskButton,
} from "./dom.js";
import { filterTasks, clearinputSearch } from "./search.js";
import { handleTaskActions, cancelEditTask } from "./taskActions.js";
import { storeTask } from "./taskService.js";

export function bindEvents() {
  document.addEventListener("DOMContentLoaded", initialSetting);
  titleTaskInput.addEventListener("input", validateInputs);
  bodyTaskInput.addEventListener("input", validateInputs);
  searchInput.addEventListener("input", filterTasks);
  taskListElement.addEventListener("click", handleTaskActions);
  sortListElement.addEventListener("change", () => sort());
  cancelEditButton.addEventListener("click", cancelEditTask);
  clearSearchButton.addEventListener("click", clearinputSearch);
  storeTaskButton.addEventListener("click", storeTask);
}

function initialSetting() {
  initLoadData();
  validateInputs();
  sort();
  resetForm();
}

function initLoadData() {
  const temp = loadTasks();
  if (temp && temp.length > 0) {
    state.tasks = temp;
  }
}
