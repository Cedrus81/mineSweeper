const MINE = 'X'
const EMPTY = 'O'
const FLAG = 'F'
var gGame = { flags: 0 }
var gBoard
//build board, render board, start timer
function initGame(matSize, mineNum) {
    gGame.flags = mineNum
    buildBoard(matSize, mineNum)
    renderBoard(gBoard)
}

// take 
function buildBoard(matSize, mineNum) {
    let mines = mineGenerator(matSize, mineNum)
    let mineIdx = 0
    gBoard = []
    for (let i = 0; i < matSize; i++) {
        gBoard[i] = []
        for (let j = 0; j < matSize; j++) {
            if (mines[0] === mineIdx) {
                gBoard[i][j] = MINE
                mines.splice(0, 1)
            }
            else {
                gBoard[i][j] = EMPTY
            }
            mineIdx++
        }

    }
    console.table(gBoard)
}

function mineGenerator(matSize, mineNum) {
    let mat = []
    let mines = []
    for (let i = 0; i < matSize ** 2; i++) {
        mat[i] = i
    }
    for (let j = 0; j < mineNum; j++) {
        let randIdx = getRandomInt(0, mat.length)
        let randNum = mat[randIdx]
        mines.push(randNum)
        mat.splice(randIdx, 1)
    }
    return mines.sort((a, b) => a - b)
}


//count the mines around the cell
function setMinesNegsCount(board, location) {
    let mineCount = 0
    for (let i = location.i - 1; i < location.i + 2; i++) {
        if (i === -1) continue
        if (i === board.length) continue
        for (let j = location.j - 1; j < location.j + 2; j++) {
            if (location.i === i && location.j === j) continue
            if (j === -1) continue
            if (j === board[i].length) continue
            if (board[i][j] === MINE) mineCount++
        }
    }
    return mineCount
}

function renderBoard(board) {
    let elTable = document.querySelector('table')
    let strHTML = '\t<tbody>'
    for (let i = 0; i < board.length; i++) {
        strHTML += '\t\n<tr>\n'
        for (let j = 0; j < board[i].length; j++) {
            strHTML += `\t<td data-i="${i}" data-j="${j}" `
            strHTML += `onclick="cellClicked(this)" oncontextmenu="cellMarked(this); return false;" `
            strHTML += `class="unclicked">${board[i][j]}</td>\n`
        }
        strHTML += '\t\n</tr>\n'
    }
    strHTML += '\n\t</tbody>'
    elTable.innerHTML = strHTML
}

function cellClicked(elCell) {
    if (elCell.innerText === MINE) {
        console.log('gameover')
        elCell.innerText = MINE
        return
    }
    else if (elCell.innerText === FLAG) {
        let isMine = elCell.getAttribute("isMine")
        if (isMine) {
            elCell.innerText = MINE
            console.log('gameover')
            return
        }
    }
    else {
        let i = +elCell.getAttribute("data-i")
        let j = +elCell.getAttribute("data-j")
        elCell.innerText = setMinesNegsCount(gBoard, { i, j })
        elCell.classList.remove('unclicked')
    }
}

// //flag
function cellMarked(elCell) {
    if (elCell.innerText === FLAG) return
    if (elCell.innerText === MINE) elCell.setAttribute("isMine", true)
    //model

    //DOM
    elCell.innerText = FLAG
    elCell.classList.remove('unclicked')
}

// checkGameOver()

// //bonus
// expandShown(board, elCell, i, j)


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}