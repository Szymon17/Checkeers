const state = {
   areas: [],
   actualArea: null,
   pawnMoved: false,

   playerHited: false,
   anotherHit: null,

   playerPawns: [],
   AiPawns: [],

   pawnIsGrabed: false,
   playerTurn: true,
   grabedPawn: null,
   endGame: false,

   resetState: () => {
      state.areas = [];
      state.actualArea = null;
      state.pawnMoved = false;
      state.pawnIsGrabed = false;
      state.playerPawns = [];
      state.AiPawns = [];
      state.playerTurn = true;
      state.grabedPawn = null;
      state.endGame = false;
   },
};

export default state;
