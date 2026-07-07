//h
import { state } from "./state.js";
import { todoLang } from "../lang/en.js";
import { handleTaskActions } from "./taskActions.js";
import {modal, modalTitle, modalBody, modalButtonHolder, confirmDelete} from "./dom.js"


//! modal props


modalContent.addEventListener("click", handleTaskActions);


function openDeleteModal(taskId) {
  modal.style.display = "block";
  state.deletingId = taskId;
  modalTitle.innerText = todoLang.deleteModalTitle;
  const selectedTask = state.tasks.find((t) => t.id === taskId);
  modalBody.innerHTML = `<span>Are you sure you want to delete <span style="text-decoration: underline; font-weight: bolder; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1;">"${selectedTask.title}"</span> from task list?</span>
   <span style="overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; 
  -webkit-line-clamp: 2; margin-bottom: 2rem">${selectedTask.body}</span>`;
  modalButtonHolder.innerHTML = `<button type="button" class="m-1 deleteTask" data-id="${taskId}">confirm</button>`;
}

function colseModal() {
  state.deletingId = null;
  modal.style.display = "none";
}

export {colseModal, openDeleteModal }