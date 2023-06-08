# Thai checkers


#How to start? -You can clone repository and start (npm i) in your node.js -If you don't want install, you can look of dist folder

#Rules
  -Pawns move and capture only forward, diagonally.
  -The queen can move any number of squares, but not in the case of capturing. If the queen beats, it must end its movement on the field right behind the captured pawn.
  -You can select any the sequence of capturing a pawn
    
#How it's working? -Game is divided on 6 scripts,
  -AiLogic: is responsible for the movement of ai.
  -playerLogic: is responsible for the movement of player.
  -gameLogic: it is the logic of the game, it is the main basis for joint actions such as capturing a pawn.
  -mouseEvents: a script that handles events related to the player's mouse movement.
  -renderBoard: renders the end screen and game boards.
  -state: stores the state of the application
