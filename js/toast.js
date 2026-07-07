import { todoLang } from "../lang/en.js";
import { handleTaskActions } from "./taskActions.js";
import { toast, toastTextElement } from "./dom.js";

//! Toast


toast.addEventListener("click", handleTaskActions);

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
      toastTextElement.innerText = todoLang.toastError;
      break;
    case "addSuccessful":
      toastTextElement.innerText = todoLang.toastAddTask;
      break;
    case "updateSuccessful":
      toastTextElement.innerText = todoLang.toastUpdateTask;
      break;
    case "deleteSuccessful":
      toastTextElement.innerText = todoLang.toastDeleteTask;
      break;
    default:
      break;
  }
  setTimeout(() => {
    closeToast();
  }, 2700);
}
export { openToast, closeToast };
