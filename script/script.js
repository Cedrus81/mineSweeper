const MINE = 'X'
const FLAG = 'F'
var timerId
var gGame = {
    hintMode: false,
    seconds: 0,
    markedCount: 0,
    shownCount: 0,
    secsPassed: 0,
    isExpand: false,
    firstClick: true,
    lives: 3,
}
var gLevel = {}
var gBoard
//build board, render board, start timer
function initGame(matSize, mineNum) {
    gLevel.size = matSize
    gLevel.mines = mineNum
    buildBoard(matSize, mineNum)
    renderBoard(gBoard)

}



function clickOnMine(elCell) {
    elCell.classList.add('mine')
    if (gGame.firstClick === true) {
        gLevel.mines--
        normalCell(elCell)
        return
    }
    gGame.lives--
    elLives = document.querySelector('#lives')
    elLives.innerText = `Lives: ${gGame.lives}`
    console.log(gGame.lives);
    if (!gGame.lives) {
        gameOver()
    }
}

function cellClicked(elCell) {
    if (gGame.hintMode === true) {
        hintClicked(elCell)
    }
    elCell.classList.remove('unclicked')
    if (!gGame.isExpand) {
        if (elCell.innerText === MINE) {
            clickOnMine(elCell)
            return
        }

        if (elCell.innerText === FLAG) {
            let isMine = elCell.getAttribute("isMine")
            if (isMine) {
                clickOnMine(elCell)
                return
            }
        }
    }
    normalCell(elCell)
}


// handle a non-flag or bomb Cell
function normalCell(elCell) {

    if (gGame.firstClick === true) {
        startTimer()
    }
    elCell.classList.add('expanded')
    gGame.firstClick = false
    let i = +elCell.getAttribute("data-i")
    let j = +elCell.getAttribute("data-j")
    gBoard[i][j].isShown = true
    elCell.innerText = setMinesNegsCount(gBoard, { i, j })
    if (elCell.innerText == 0) {
        expandShown(gBoard, elCell, { i, j })
    }
    gGame.shownCount++
}

//flag
function cellMarked(elCell) {
    if (elCell.innerText === FLAG) return
    gGame.markedCount++
    if (elCell.innerText === MINE) elCell.setAttribute("isMine", true)

    //DOM
    let i = +elCell.getAttribute("data-i")
    let j = +elCell.getAttribute("data-j")
    gBoard[i][j].isMarked = true

    //MODEL
    elCell.innerText = FLAG
    elCell.classList.remove('unclicked')
}

function checkGameOver() {
    let unclicked = document.querySelectorAll(".unclicked")
    let hidden = document.querySelectorAll(".hidden")
    for (let cell of unclicked) {
        cell.classList.remove('unclicked')
        cell.classList.add('expanded')
    }
    for (let span of hidden) {
        span.classList.remove('hidden')
    }
}



//stop timer, show text, stop score
function gameOver() {
    checkGameOver()
    clearInterval(timerId)
    console.log('gameover');
}