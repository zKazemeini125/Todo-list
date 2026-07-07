//!
import { colseModal, openDeleteModal } from "./modal.js";
import { closeToast } from "./toast.js";
import { state } from "./state.js";
import {
  cancelEditButton,
  storeTaskButton,
  sortListElement,
  titleTaskInput,
  bodyTaskInput,
} from "./dom.js";
import { todoLang } from "../lang/en.js";
import { sort } from "./render.js";
import { resetForm } from "./validation.js";
import { deleteTask } from "./taskService.js";

export function handleTaskActions(e) {
  const id = Number(e.target.dataset.id);

  if (e.target.classList.contains("deleteButton")) {
    openDeleteModal(id);
  }

  if (e.target.classList.contains("editButton")) {
    toggleEditMode(id);
  }

  if (e.target.classList.contains("deleteTask")) {
    deleteTask();
  }

  if (e.target.classList.contains("closeModal")) {
    colseModal();
  }

  if (e.target.classList.contains("closeToast")) {
    closeToast();
  }
}
export function cancelEditTask() {
  storeTaskButton.innerText = todoLang.addTask;
  cancelEditButton.style.display = "none";
  resetForm();
  sort();
}

function toggleEditMode(taskId) {
  state.editingId = taskId;
  cancelEditButton.style.display = "block";
  storeTaskButton.innerText = todoLang.updateTask;
  const task = state.tasks.find((t) => t.id === state.editingId);
  titleTaskInput.value = task.title;
  bodyTaskInput.value = task.body;
  state.isEditing = true;

  titleTaskInput.focus({
    preventScroll: true,
  });

  titleTaskInput.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

  sort();
}
