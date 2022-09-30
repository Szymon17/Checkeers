import state from "./state";
import { checkForHitting, findHittingForPawn, forceBeating, tryChangePawnToQueen, tryEndGame, areasToMove, endGame } from "./gameLogic.js";

const takePawnsWithAvilableMove = () => {
   const pawnWithavilableMove = [];

   state.AiPawns.forEach(pawn => {
      if (pawn !== null && areasToMove(pawn).length > 0) pawnWithavilableMove.push(pawn);
   });

   return pawnWithavilableMove;
};

const getRandomPawn = pawns => {
   const index = Math.floor(Math.random() * pawns.length);
   return pawns[index];
};

const chnageTurn = () => {
   const forAiTry = tryEndGame();
   const aiHittingList = checkForHitting();

   state.playerTurn = true;

   const forPlayerTry = tryEndGame();
   const playerHittingList = checkForHitting();

   if (forAiTry === true && playerHittingList.length === 0) endGame();
   else if (forPlayerTry === true && aiHittingList.length === 0) endGame();
};

const getRandomArea = pawn => {
   const areas = areasToMove(pawn);
   const index = Math.floor(Math.random() * areas.length);
   return areas[index];
};

const forceAnotherAiHit = () => {
   let nextHit = [findHittingForPawn(state.anotherHit, "player-pawn")];

   if (nextHit[0].length > 0) {
      const tryForceBeat = forceBeating(nextHit);
      deletePlayerPawn(tryForceBeat.hited);

      nextHit = [findHittingForPawn(tryForceBeat.forced, "player-pawn")];

      if (nextHit[0].length > 0) {
         state.anotherHit = tryForceBeat.forced;
         aiInit();
         return;
      }

      tryChangePawnToQueen(state.anotherHit);
      state.anotherHit = null;
      chnageTurn();
   }
};

const deletePlayerPawn = pawnToDelete => {
   const index = state.playerPawns.findIndex(pawn => pawn === pawnToDelete);
   state.playerPawns[index] = null;
};

const aiInit = () => {
   let randomPawn = null;
   let randomArea = null;

   const pawns = takePawnsWithAvilableMove();

   if (pawns.length > 0) {
      randomPawn = getRandomPawn(pawns);
      randomArea = getRandomArea(randomPawn);
   }

   const hittings = checkForHitting();

   if (hittings.length > 0) {
      if (state.anotherHit === null) {
         const tryForceBeat = forceBeating(hittings);
         deletePlayerPawn(tryForceBeat.hited);

         const nextHit = [findHittingForPawn(tryForceBeat.forced, "player-pawn")]; //new rule

         if (nextHit[0].length > 0) {
            state.anotherHit = tryForceBeat.forced;
            aiInit();
            return;
         }
         tryChangePawnToQueen(tryForceBeat.forced);
      } else {
         forceAnotherAiHit();
         return;
      }
   } else if (randomPawn !== null) {
      randomPawn.remove();
      randomArea.append(randomPawn);
      tryChangePawnToQueen(randomPawn);
   }

   chnageTurn();
};

export default aiInit;
