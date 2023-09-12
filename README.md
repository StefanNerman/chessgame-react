# Chess game react component
This is a chess game that I built for my online chess website. This app has most of the functionality that you'd expect from a chess game like: little dots that show you the possible moves for your piece, sytems to prevent you from making illegal moves, functions that are called every time something notable happens.

## How to run this program
### Setup
To use this app you need to add it to your react project (I built it using crete-react-app but it can most likely run on other types of react apps I havent checked). After that you need to add typerscript to your project using this console command `npm install --save-dev typescript @types/node @types/react @types/react-dom @types/jest` after that you need to initialize typescript by using `npx tsc --init` and set `"jsx": "react"` in tsconfig.json file. After that you can import ChessComponent file to use it in your app.
### How it works
When you add the component to your app a 256px by 256px chessboard will appear. To move a piece you first have to select it and the game will show you the possible moves for that piece, to move it you need to click on a tile, and if the move is legal the piece will move. At first you will only be able to make one move since your default color is set to white, to use the game normally read the next segment.
### How to use the app
If you want to play the game on a single device go to ChessComponent.tsx file and set the `isLocalGame = true` that way every time you make a move your player color changes and you can move as the other color.

 Use the `playerColor` variable in the ChessComponent.tsx file to change the color of the player if you need to.
 
 If you want to be able to move the piece with just a number input, use the `artificialMove()` function inside the same file and as parameters the function takes two locations in double digit number form, the first number is for the Y axis and the second number is for the X axis, for example the move e2 -> e4 would be 25 -> 45.
 
 If you go to line 42 in the ChessComponent file there will be multiple empty functions that are called when something happens, so for example if you want to add an alert every time there is a check you can add the code to the `handleKingAttack()` function. All of those functions receive the previous move information as parameters.
 
 If you want to use your own piece images insted of the random ones I've found on the internet just go to the piecesImages.ts file and replace my links with yours.
## TODO's
- System that recognises draws
- Pawn upgrade system
- Better system for recognizing check-mates
- The en passant move
- System to prevent player from castling if the king has to pass through a dangerous tile on his way to the desired position
