//h Data rendering functions

import { taskListElement } from "./dom.js";
import { state } from "./state.js";
import { highlight } from "./search.js";
import { sortListElement } from "./dom.js";

function sort(list = state.tasks) {
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
      className: "border-bottom border-lightgray flex-row p-2",
      innerHTML: `<div class="flex-col w-80" style="{height: 100%}">
                <h4 class="m-1 titleList">${highlight(element.title)}</h4>
                <p class="m-1 bodyList">${highlight(element.body)}</p>
              </div>
              <div class="flex-col w-20 justify-center align-end">
                <div class="flex-row actionContainer">
                  <button type='button' class="m-1 editButton" data-id="${element.id}" ${state.editingId == element.id ? "disabled" : ""}>edit</button>
                  <button type='button' class="m-1 deleteButton" data-id="${element.id}" ${state.editingId == element.id ? "disabled" : ""} >delete</button>
                </div>
              </div>`,
    });
    taskListElement.appendChild(li);
  }
}

export { sort };
