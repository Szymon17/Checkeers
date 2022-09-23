import state from "./state";
import { renderEndScreen } from "./renderBoard";

const getAroundCords = (pawn, x, y, value) => {
   const cords = [];

   if (pawn.dataset.type === "queen") {
      let i = 0;

      if (value === 1) {
         while (x + i < 8 || x - i > 1 || y + i < 8 || y - i > 1) {
            i++;
            _saveCords(i);
         }
      } else {
         while (x + -i > 1 || x - -i < 8 || y + -i > 1 || y - -i < 8) {
            i++;
            _saveCords(i);
         }
      }
   } else
      cords.push(
         { x: x - 1, y: y - 1 },
         { x: x - 1, y: y + 1 },
         { x: x + 1, y: y - 1 },
         { x: x + 1, y: y + 1 },
         { x: x - 2, y: y - 2 },
         { x: x - 2, y: y + 2 },
         { x: x + 2, y: y - 2 },
         { x: x + 2, y: y + 2 }
      );

   function _saveCords(i) {
      let a = { x: x + i * value, y: y + i * value };
      if (a.x <= 8 && a.y <= 8 && a.x >= 1 && a.y >= 1) cords.push(a);

      a = { x: x - i * value, y: y - i * value };
      if (a.x <= 8 && a.y <= 8 && a.x >= 1 && a.y >= 1) cords.push(a);

      a = { x: x + i * value, y: y - i * value };
      if (a.x <= 8 && a.y <= 8 && a.x >= 1 && a.y >= 1) cords.push(a);

      a = { x: x - i * value, y: y + i * value };
      if (a.x <= 8 && a.y <= 8 && a.x >= 1 && a.y >= 1) cords.push(a);
   }

   return cords;
};

const whomRound = () => {
   let enemyPawn = null;
   let pawns = null;

   switch (state.playerTurn) {
      case true:
         enemyPawn = "AI-pawn";
         break;
      case false:
         enemyPawn = "player-pawn";
         break;
   }

   if (state.playerTurn === true) pawns = state.playerPawns.filter(pawn => pawn !== null);
   else pawns = state.AiPawns.filter(pawn => pawn !== null);

   return { enemyPawn, pawns };
};

const areasToMove = pawn => {
   const aroundAreas = findAroundAreas(pawn);
   const avilableAreas = checkAvilableAreas(aroundAreas, pawn);
   return checkEmptyArea(avilableAreas);
};

const findAroundAreas = pawn => {
   const pawnArea = pawn.parentElement;

   const value = state.playerTurn === true ? 1 : -1;
   const x = Number(pawnArea.dataset.x);
   const y = Number(pawnArea.dataset.y);
   const cords = getAroundCords(pawn, x, y, value);
   const areas = [];

   cords.forEach(cord => {
      const area = state.areas.filter(area => area.dataset.x == cord.x && area.dataset.y == cord.y);
      if (area[0] !== undefined) areas.push(area[0]);
   });

   if (value === 1)
      return {
         nextAreas: [areas.filter(area => area.dataset.y > y && area.dataset.x > x), areas.filter(area => area.dataset.y > y && area.dataset.x < x)],
         backAreas: [areas.filter(area => area.dataset.y < y && area.dataset.x > x), areas.filter(area => area.dataset.y < y && area.dataset.x < x)],
      };
   else
      return {
         nextAreas: [areas.filter(area => area.dataset.y < y && area.dataset.x > x), areas.filter(area => area.dataset.y < y && area.dataset.x < x)],
         backAreas: [areas.filter(area => area.dataset.y > y && area.dataset.x > x), areas.filter(area => area.dataset.y > y && area.dataset.x < x)],
      };
};

const checkForHitting = () => {
   const { enemyPawn, pawns } = whomRound();
   const hittingList = [];

   pawns.forEach(pawn => {
      const hits = findHittingForPawn(pawn, enemyPawn);
      if (hits.length > 0) hittingList.push(hits);
   });

   return hittingList;
};

const findHittingForPawn = (pawn, enemyPawnName) => {
   const { nextAreas, backAreas } = findAroundAreas(pawn);
   const hit = [];

   [...nextAreas, ...backAreas].forEach(site => {
      const avilableAreas = [];
      let sawPawn = false;
      let enemyPawn = null;
      let repeat = 0;

      site.forEach(area => {
         const pawnOnVision = area.lastChild;

         if (pawnOnVision !== null && pawnOnVision.dataset.name === enemyPawnName && repeat === 0) {
            sawPawn = true;
            repeat++;
            enemyPawn = pawnOnVision;
         } else if (sawPawn && pawnOnVision === null && repeat === 1) avilableAreas.push(area);
         else if (pawnOnVision !== null) repeat++;
      });
      if (avilableAreas.length > 0 && enemyPawn !== null) hit.push([pawn, enemyPawn, avilableAreas]);
   });

   return hit;
};

const checkAvilableAreas = (areas, pawn) => {
   const pawnArea = pawn.parentElement;
   if (pawn.dataset.type === "pawn")
      return [...areas.nextAreas[0], ...areas.nextAreas[1]].filter(area => area.dataset.x == Number(pawnArea.dataset.x) + 1 || area.dataset.x == Number(pawnArea.dataset.x) - 1);
   else {
      const newAreas = [...areas.backAreas, ...areas.nextAreas];
      let avilableAreas = [];
      let repeatCounter = 0;

      newAreas.forEach(tab => {
         repeatCounter = 0;

         tab.forEach(el => {
            if (el.childNodes.length === 0 && repeatCounter === 0) avilableAreas.push(el);
            else repeatCounter++;
         });
      });

      return avilableAreas;
   }
};

const checkEmptyArea = nextAreas => {
   return nextAreas.filter(area => area.childNodes.length === 0);
};

const hitPawn = (hit, emptyArea) => {
   hit[0].remove();
   hit[1].remove();
   emptyArea.append(hit[0]);

   return { forced: hit[0], hited: hit[1] };
};

const forceBeating = (hittingList, choicedPawn = hittingList[0][0][0], choicedArea = hittingList[0][0][2][0]) => {
   let ob = null;

   hittingList.forEach(hits => {
      hits.forEach(hit => {
         if (hit[0] === choicedPawn) {
            hit[2].forEach(emptyArea => {
               if (emptyArea === choicedArea) ob = hitPawn(hit, emptyArea);
            });
         }
      });
   });

   return ob;
};

const tryChangePawnToQueen = pawn => {
   const value = pawn.dataset.name === "player-pawn" ? 8 : 1;
   if (pawn.parentElement.dataset.y == value) {
      pawn.dataset.type = "queen";
      pawn.classList.add("queen");
   }
};

const tryEndGame = () => {
   const avilableAiPawns = state.AiPawns.filter(pawn => pawn !== null);
   const avilablePlayerPawns = state.playerPawns.filter(pawn => pawn !== null); //mayby error with duble hit
   const pawns = state.playerTurn === true ? state.playerPawns : state.AiPawns;
   const pawnWithavilableMove = [];

   pawns.forEach(pawn => {
      if (pawn !== null) {
         const goodAreas = areasToMove(pawn);
         if (goodAreas.length > 0) pawnWithavilableMove.push(pawn);
      }
   });

   const hittings = checkForHitting();

   if (avilableAiPawns.length === 0 || avilablePlayerPawns.length === 0 || (pawnWithavilableMove.length === 0 && hittings.length === 0)) {
      renderEndScreen();
      state.endGame = true;
   }
};

export { checkForHitting, forceBeating, findHittingForPawn, tryChangePawnToQueen, tryEndGame, areasToMove };