import {
  titleTaskInput,
  bodyTaskInput,
  storeTaskButton,
  searchInput,
} from "./dom.js";
import { state } from "./state.js";

export function validateInputs() {
  titleTaskInput.value.trim() || bodyTaskInput.value.trim()
    ? (storeTaskButton.disabled = false)
    : (storeTaskButton.disabled = true);
}

export function resetForm() {
  titleTaskInput.value = null;
  bodyTaskInput.value = null;
  storeTaskButton.disabled = true;
  state.editingId = null;
  state.isEditing = false;
  searchInput.value = null;
  state.searchText = null;
}
