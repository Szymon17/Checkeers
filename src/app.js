//code
import style from "./css/style.css";

import state from "./js/state";
import createBoard from "./js/renderBoard";
import { takeEvent, dropEvent, moveEvent } from "./js/mouseEvents";

const startGame = () => {
   document.body.innerHTML = "";
   state.resetState();

   const board = createBoard();
   state.areas = [...board.querySelectorAll(".area")];
   document.body.append(board);

   board.addEventListener("mousemove", moveEvent);
   state.playerPawns.forEach((pawn, i) => pawn.addEventListener("mousedown", e => takeEvent(i, e)));
   document.addEventListener("mouseup", dropEvent);
};

startGame();

export { startGame };
