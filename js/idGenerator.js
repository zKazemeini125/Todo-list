import { state } from "./state.js";
let id = 0;

export function setId() {
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
  return id
}
