/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
    for (let i = 0; i < WIDTH; i++) {
        let arr = []
        board.push(arr)
        for (let j = 0; j < HEIGHT; j++) {
            arr.push(null)
        }
    }

}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
    // get "htmlBoard" variable from the item in HTML w/ID of "board"
    const htmlBoard = document.getElementById('board')

    //create "click column so that onclick can work
    let top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", handleClick);

    // create td's for click column to differentiate clicks for each col
    for (let x = 0; x < WIDTH; x++) {
        let headCell = document.createElement("td");
        headCell.setAttribute("id", x);
        top.append(headCell);
    }
    htmlBoard.append(top);

    //loop over board rows/cols and generate corresponding table elements.
    for (let y = 0; y < HEIGHT; y++) {
        const row = document.createElement("tr");
        for (let x = 0; x < WIDTH; x++) {
            const cell = document.createElement("td");
            //add to table with id row-col
            cell.setAttribute("id", `${y}-${x}`);
            document.addEventListener('click',e=> {
                const id=e.target.id
                console.log(`id : ${id}`)
                console.log(board[id])
            })
            row.append(cell);
        }
        htmlBoard.append(row);
    }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
    const col = board[x]
    for (let i=col.length; i >= 0; i--){
        if ( col[i]===null){
            return i
        }
    }
}


/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
    if (board[x][y]) {
        //shouldn't run here
        throw new Error("Piece already there!")
    }
    const div = document.createElement('div')
    const id = `${y}-${x}`
    document.getElementById(id).append(div)
    div.className = `p${currPlayer} piece`
    div.id = `${y}-${x}-p`
    board[x][y] = currPlayer
}

/** endGame: announce game end */

function endGame(msg) {
    alert(`Game Over: ${msg}`)
}

/** handleClick: handle click of column top to play piece */

function handleClick({target}) {
    // get x from ID of clicked cell
    let x = +target.id;
    console.log("X", x )

    // place piece in board and add to HTML table
    try {
        // get next spot in column (if none, ignore click)
        y = findSpotForCol(x);
        placeInTable(y, x);

    } catch (e) {
        return alert(e)
    }
    // check for win
    if (checkForWin()) {
        return endGame(`Player ${currPlayer} won!`);
    }

    // check for tie
    if (board.every(e => e.every(e => e !== null))) {
        endGame("Tie!")
    }
    // switch players
    currPlayer = currPlayer === 1 ? 2 : 1
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
    function _win(cells) {
        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer

        //all current player via every
        return cells.every(
            ([y, x]) =>
                y >= 0 &&
                y < HEIGHT &&
                x >= 0 &&
                x < WIDTH &&
                board[y][x] === currPlayer
        );
    }

    //each row
    for (let y = 0; y < HEIGHT; y++) {
        //shift start col check
        for (let x = 0; x < WIDTH; x++) {

            //four ways to win
            let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
            let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
            let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
            let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

            //test all wins
            if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                return true;
            }
        }
    }
}

makeBoard();
makeHtmlBoard();
