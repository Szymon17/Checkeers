import state from "./state";
import { startGame } from "../app";

export default () => {
   const board = document.createElement("section");
   board.classList.add("board");

   const actualArea = document.createElement("p");
   actualArea.classList.add("actual-area");

   const areasContainer = document.createElement("div");
   areasContainer.classList.add("areas-container");

   let chessboardIndex = 1;

   for (let i = 8; i > 0; i--) {
      chessboardIndex++;

      for (let j = 1; j < 9; j++) {
         const newArea = document.createElement("div");
         newArea.dataset.x = j;
         newArea.dataset.y = i;
         newArea.dataset.name = "area";

         if ((j + chessboardIndex) % 2 === 0) newArea.classList.add("area");
         else newArea.classList.add("area--disabled");

         areasContainer.append(newArea);
      }
   }
   board.append(actualArea, areasContainer);
   createPawns(board);

   return board;
};

//pawns
const createPawns = board => {
   const areas = [...board.querySelectorAll(".area")];

   for (let i = 0; i < 12; i++) {
      const AiPawn = newPawn("AI-pawn");
      state.AiPawns.push(AiPawn);
      areas[i].append(AiPawn);
   }

   for (let i = areas.length - 1; i > areas.length - 13; i--) {
      const playerPawn = newPawn("player-pawn");
      state.playerPawns.push(playerPawn);
      areas[i].append(playerPawn);
   }

   function newPawn(name) {
      const pawn = document.createElement("div");
      pawn.classList.add("pawn", name);
      pawn.dataset.name = name;
      pawn.dataset.type = "pawn";

      return pawn;
   }
};

//end screen

const renderEndScreen = params => {
   const endScreen = document.createElement("div");
   endScreen.classList.add("end-screen");

   const button = document.createElement("button");
   button.classList.add("end-screen-btn");
   button.innerText = "Start";
   button.addEventListener("click", startGame);
   endScreen.append(button);

   document.body.prepend(endScreen);
};

export { renderEndScreen };
