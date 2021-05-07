
var gameBoard = new Array(9);
var turn = 'X';

var xScore = 0;
var oScore = 0;

var box;
var playingAI = false;

function clearBoardArray() {
    var i, n = gameBoard.length;
    for (i = 0; i < n; ++i) {
        gameBoard[i] = undefined;
    }
}

function newGame(){
    playingAI = false;
    let x = document.getElementsByClassName("xo");
    let i;
    for(i=0;i < x.length; ++i){
        x[i].innerHTML = "";
    }
    turn = 'X';

    clearBoardArray();
}

function newGameAgainstAI() {
    playingAI = true;
    let x = document.getElementsByClassName("xo");
    let i;
    for(i=0;i < x.length; ++i){
        x[i].innerHTML = "";
    }
    turn = 'X';

    clearBoardArray();
}

function resetGame(){
    if (playingAI == true)
        newGameAgainstAI();
    else
        newGame();

    xScore = 0;
    oScore = 0;

    document.getElementById("xScore").innerHTML = xScore;
    document.getElementById("oScore").innerHTML = oScore;
}

function xWin() {
    alert('Player X has won');
        xScore++;
        document.getElementById("xScore").innerHTML = xScore;
}

function oWin() {
    alert('Player O has won');
        oScore++;
        document.getElementById("oScore").innerHTML = oScore;
}

function gameMove(box){
    //check to see if space is already taken
    if (gameBoard[box] != null) {
        return
    }

    gameBoard[box] = turn;
    document.getElementById(box).innerHTML = turn;
    document.getElementById(box).style.backgroundColor = "#FA8171";

    //check for full board (game ends)
    if (isFull(gameBoard)) {
        alert("It's a tie! Please start a new game.");
    }

    //check if a win exists after player's move
    let result = checkForWin(gameBoard);
    if (result == 'X')
        xWin();
    else if (result == 'O')
        oWin();
    
    //Check to see if not playing against AI
    if (playingAI == false) {

        if (turn == 'X'){
            turn = 'O'; 
            document.getElementById("player").innerHTML = turn; //not changing display name to O
            }
            else{
                turn = 'X';
                document.getElementById("player").innerHTML = turn;
            }

    //playing against AI
    } else {

        //AI_move = the index of the best move playable for O
        let AI_move = findBestMove(this.gameBoard);

        //draw the O on board and assign it to the gameboard.
        gameBoard[AI_move] = 'O';
        document.getElementById(AI_move).innerHTML = 'O';
        document.getElementById(AI_move).style.backgroundColor = "#FA8171";

        //check for full board (game ends)
        if (isFull(this.gameBoard)) {
            alert("It's a tie! Please start a new game.");
        }

        //check if a win exists after AI's move
        let result = checkForWin(gameBoard);
        if (result == 'X')
            xWin();
        else if (result == 'O')
            oWin();

    }
}

function findBestMove(board) {
    bestVal = -1000; //value of best move
    bestMove = undefined; //index of best move

    //check all empty spaces on gameBoard, return cell with highest value
    for (let j = 0; j < board.length; j++) {

        //if cell empty
        if (board[j] === undefined) {

            board[j] = 'O'; //assign temporary move
            //debugger;
            let moveVal = miniMax(board, 0, false); //find value for that move
            //debugger;
            board[j] = undefined; //undo the move
            
            //keep the higher value between bestMove and the move just made (moveVal)
            if (moveVal > bestVal) {
                bestVal = moveVal;
                bestMove = j;
            }
        }
    }

    //console.log("Best Move: ", bestMove, " Best Move Value: ", bestVal);

    return bestMove;
}

function miniMax(board, depth, isMaxPlayer) {
    let score = evaluate(board);

    if (score == 10) {
        return (score - depth);
    }

    if (score == -10) {
        return (score + depth);
    }

    if (isFull(board)) {
        return 0;
    }

    if (isMaxPlayer) {
        let best = -1000;

        for (let j = 0; j < board.length; j++) {
            if (board[j] === undefined) {
                board[j] = 'O';

                //call minimax recursively and choose max value
                isMaxPlayer = !isMaxPlayer; //flip the value
                best = Math.max(best, miniMax(board, depth+1, (isMaxPlayer)))

                //undo the move
                board[j] = undefined;
            }
        }

        return best;

    } else {
        let best = 1000;

        for (let j = 0; j < board.length; j++) {
            if (board[j] === undefined) {
                board[j] = 'X';

                //call minimax recursively and choose max value
                isMaxPlayer = !isMaxPlayer; //flip the value
                best = Math.min(best, miniMax(board, depth+1, (isMaxPlayer)))

                //undo the move
                board[j] = undefined;
            }
        }

        return best;
    }

}

function isFull(gameBoard) {
    let e = 0;
    for (let j = 0; j < gameBoard.length; ++j){
        if(gameBoard[j] === undefined){
            e++;
        }
    }
    if (e == 0){
        return true;
    } else {
        return false;
    }
}

function evaluate(gameBoard) {
    let result = checkForWin(gameBoard);

    if (result == 'X')
        return -10;
    else if (result == 'O')
        return +10;
    else
        return 0;
}

function checkForWin(board) {
    
    if( (gameBoard[0] == 'X' && gameBoard[4] == 'X' && gameBoard[8] == 'X') || //left to right diagonal
        (gameBoard[2] == 'X' && gameBoard[4] == 'X' && gameBoard[6] == 'X') || //right to left diagonal
        (gameBoard[0] == 'X' && gameBoard[3] == 'X' && gameBoard[6] == 'X') || //top horizontal
        (gameBoard[1] == 'X' && gameBoard[4] == 'X' && gameBoard[7] == 'X') || //middle horizontal
        (gameBoard[2] == 'X' && gameBoard[5] == 'X' && gameBoard[8] == 'X') || //bottom horizontal
        (gameBoard[0] == 'X' && gameBoard[1] == 'X' && gameBoard[2] == 'X') || //left vertical
        (gameBoard[4] == 'X' && gameBoard[3] == 'X' && gameBoard[5] == 'X') || //middle vertical
        (gameBoard[6] == 'X' && gameBoard[7] == 'X' && gameBoard[8] == 'X') ) {//right vertical

        return 'X';

    } else if (
        (gameBoard[0] == 'O' && gameBoard[4] == 'O' && gameBoard[8] == 'O') || //left to right diagonal
        (gameBoard[2] == 'O' && gameBoard[4] == 'O' && gameBoard[6] == 'O') || //right to left diagonal
        (gameBoard[0] == 'O' && gameBoard[3] == 'O' && gameBoard[6] == 'O') || //top horizontal
        (gameBoard[1] == 'O' && gameBoard[4] == 'O' && gameBoard[7] == 'O') || //middle horizontal
        (gameBoard[2] == 'O' && gameBoard[5] == 'O' && gameBoard[8] == 'O') || //bottom horizontal
        (gameBoard[0] == 'O' && gameBoard[1] == 'O' && gameBoard[2] == 'O') || //left vertical
        (gameBoard[4] == 'O' && gameBoard[3] == 'O' && gameBoard[5] == 'O') || //middle vertical
        (gameBoard[6] == 'O' && gameBoard[7] == 'O' && gameBoard[8] == 'O') ) {//right vertical

        return 'O';

    } else {

        return null;

    }
}