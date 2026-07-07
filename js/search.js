//! sorting & filtring
import {searchInput, clearSearchButton, sortListElement} from "./dom.js"
import { state } from "./state.js";
import { sort } from "./render.js";


export function filterTasks(e) {
  state.searchText = e.target.value;
  const searchList = state.tasks.filter((element) => {
    return (
      element.title.trim().toLowerCase().includes(state.searchText) ||
      element.body.trim().toLowerCase().includes(state.searchText)
    );
  });

  sort( searchList);

  if (searchInput.value && searchInput.value.length > 0) {
    clearSearchButton.style.visibility = "visible";
  } else clearSearchButton.style.visibility = "hidden";
}

export function clearinputSearch() {
  searchInput.value = null;
  state.searchText = null;
  clearSearchButton.style.visibility = "hidden";
  sort();
}

export function highlight(text) {
  if (!state.searchText) return text;
  const regex = new RegExp(`(${state.searchText})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}
