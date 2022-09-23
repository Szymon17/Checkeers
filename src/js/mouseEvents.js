import state from "./state";
import { playerMove } from "./playerLogic";

let startTouchCords = {
   x: null,
   y: null,
};

const moveEvent = e => {
   changeActualArea(e);

   if (state.pawnIsGrabed) {
      const pawn = state.grabedPawn;

      const x = (startTouchCords.x - e.clientX) * -1;
      const y = (startTouchCords.y - e.clientY) * -1;

      pawn.style.transform = `translate(${x}px,${y}px)`;
   }
};

const changeActualArea = e => {
   const targetArea = e.target.dataset.name === "area" ? e.target : e.target.parentElement;
   if (targetArea.dataset.x === undefined) return;

   state.actualArea = `${targetArea.dataset.x}, ${targetArea.dataset.y}`;
   document.querySelector(".actual-area").textContent = state.actualArea;
};

const takeEvent = (index, e) => {
   if (!state.playerTurn) return;

   const pawn = state.playerPawns[index];
   state.grabedPawn = pawn;

   startTouchCords.x = e.clientX;
   startTouchCords.y = e.clientY;

   state.pawnIsGrabed = true;
};

const dropEvent = e => {
   if (state.pawnIsGrabed === false) return;

   playerMove(e);
};

export { takeEvent, dropEvent, moveEvent };
