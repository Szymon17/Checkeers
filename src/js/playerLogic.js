import state from "./state";
import { checkForHitting, forceBeating, findHittingForPawn, tryChangePawnToQueen, areasToMove } from "./gameLogic";
import aiInit from "./AiLogic";

let lastTouchCords = null;

const makeChoicedArea = e => {
   const x = e === undefined ? lastTouchCords.x : e.clientX;
   const y = e === undefined ? lastTouchCords.y : e.clientY;

   return state.areas.filter(area => x > area.offsetLeft && x < area.offsetLeft + area.offsetWidth && y > area.offsetTop && y < area.offsetTop + area.offsetHeight)[0];
};

const resetPawn = () => {
   if (state.grabedPawn !== null) {
      state.grabedPawn.style = "";
      state.grabedPawn = null;
      state.pawnIsGrabed = false;
   }
};

const changeTurn = pawn => {
   if (state.endGame) return;
   state.playerTurn = false;
   resetPawn();
   tryChangePawnToQueen(pawn);
   aiInit();
};

const movePlayerPawn = (pawn, toArea) => {
   const avilableAreas = areasToMove(pawn);

   let pawnMoved = false;

   avilableAreas.forEach(area => {
      if (toArea === area) {
         pawn.remove();
         toArea.append(pawn);
         pawnMoved = true;
      }
   });

   return pawnMoved;
};

const deleteAiPawn = pawnToDelete => {
   const index = state.AiPawns.findIndex(pawn => pawn === pawnToDelete);
   state.AiPawns[index] = null;
};

const forceAnotherHit = (choicedArea, lookForAnotherPawn) => {
   const tryForceHit = forceBeating(lookForAnotherPawn, state.grabedPawn, choicedArea);

   if (tryForceHit !== null) {
      deleteAiPawn(tryForceHit.hited);
      const anotherHitArea = [findHittingForPawn(state.anotherHit, "AI-pawn")];

      if (anotherHitArea[0].length === 0) {
         const pawn = state.anotherHit;
         state.anotherHit = null;
         changeTurn(pawn);
      }
   }
};

const playerMove = e => {
   const pawn = state.grabedPawn === null ? state.anotherHit : state.grabedPawn;

   const choicedArea = makeChoicedArea(e);
   const hittings = checkForHitting();

   if (choicedArea === undefined) {
      resetPawn();
      return;
   }

   if (state.anotherHit !== null) {
      const anotherHitArea = [findHittingForPawn(state.anotherHit, "AI-pawn")];

      if (anotherHitArea[0].length > 0) {
         forceAnotherHit(choicedArea, anotherHitArea);
         resetPawn();
         return;
      }

      state.anotherHit = null;
      changeTurn(pawn);
   } else if (hittings.length > 0 && state.anotherHit === null) {
      const tryForceBeat = forceBeating(hittings, state.grabedPawn, choicedArea);

      if (tryForceBeat !== null && tryForceBeat.forced !== null) {
         state.anotherHit = tryForceBeat.forced;
         deleteAiPawn(tryForceBeat.hited);

         lastTouchCords = { x: e.clientX, y: e.clientY };
         playerMove();
      }

      resetPawn();
      return;
   } else {
      const pawnMoved = movePlayerPawn(pawn, choicedArea);
      if (pawnMoved) changeTurn(pawn);
   }
   resetPawn();
};

export { playerMove };
