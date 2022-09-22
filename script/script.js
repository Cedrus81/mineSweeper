const MINE = 'X'
const FLAG = '🚩'
var timerId
var gGame = {
    isOn: true,
    hintMode: false,
    seconds: 0,
    markedCount: 0,
    shownCount: 0,
    secsPassed: 0,
    isExpand: false,
    firstClick: true,
    lives: 3,
    safeclicks: 3,
    isVictory: false
}

var gLevel = { bestScore: 0 }
var gBoard
//build board, render board, start timer
function initGame(matSize, mineNum) {
    reset()
    gGame.isOn = true
    gLevel.size = matSize
    gLevel.mines = mineNum
    buildBoard(matSize, mineNum)
    renderBoard(gBoard)

}



function cellClicked(elCell) {
    //get the DOM
    let i = +elCell.getAttribute("data-i")
    let j = +elCell.getAttribute("data-j")
    if (gBoard[i][j].isShown) {
        return
    }
    if (gMegaHint.isOn) {
        megaHint(i, j)
        return
    }
    if (gGame.hintMode) {
        if (elCell.classList.contains('.expanded')) return
        hintClicked(elCell)
        gGame.hintMode = false
        return
    }
    if (!gGame.isExpand) {
        if (gBoard[i][j].isMine) {
            gBoard[i][j].isShown = true
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


function clickOnMine(elCell) {
    elCell.classList.remove('unclicked')
    let color = gGame.isVictory ? 'mine-victory' : 'mine'
    elCell.classList.add(color)
    if (gGame.isOn) {
        gGame.lives--
    }
    if (gGame.firstClick === true) {
        normalCell(elCell)
        return
    }
    elLives = document.querySelector('#lives')
    elLives.innerText = `Lives: ${gGame.lives}`
    elCell.innerText = MINE
    if (!gGame.lives) {
        gameOver()
    }
}

// handle a non-flag or bomb Cell
function normalCell(elCell) {
    if (gGame.firstClick === true) {
        startTimer()
        gGame.firstClick = false
    }
    if (elCell.classList.contains('unclicked')) {
        elCell.classList.remove('unclicked')
        if (gGame.isOn) {
            gGame.shownCount++
            checkScore()
        }
    }
    elCell.classList.add('expanded')
    let i = +elCell.getAttribute("data-i")
    let j = +elCell.getAttribute("data-j")
    gBoard[i][j].isShown = true
    elCell.innerText = setMinesNegsCount(gBoard, { i, j })
    if (elCell.innerText == 0) {
        expandShown(gBoard, elCell, { i, j })
    }
}

//flag
function cellMarked(elCell) {
    let i = +elCell.getAttribute("data-i")
    let j = +elCell.getAttribute("data-j")
    if (gBoard[i][j].isShown || gBoard[i][j].isMarked) {
        return
    }
    gGame.markedCount++

    //DOM
    gBoard[i][j].isMarked = true

    //MODEL
    elCell.innerText = FLAG
    checkScore()
}

function checkGameOver() {
    let unclicked = document.querySelectorAll(".unclicked")
    let hidden = document.querySelectorAll(".hidden")
    for (let elCell of unclicked) {
        cellClicked(elCell)
    }
    for (let span of hidden) {
        span.classList.remove('hidden')
    }
}



function checkScore() {
    document.querySelector('#score').innerText = `Score: ${gGame.shownCount}`
    if (gGame.shownCount > gLevel.bestScore) {
        gLevel.bestScore = gGame.shownCount
        document.querySelector('#best-score').innerText = `Best Score: ${gLevel.bestScore}`
    }
    if (gGame.shownCount + gGame.markedCount === gLevel.size ** 2) {
        victory()
    }
}

//stop timer, show text, stop score
function gameOver() {
    gGame.isOn = false
    checkGameOver()
    clearInterval(timerId)
    console.log('gameover');
}

function victory() {
    gGame.isOn = false
    gGame.isVictory = true
    checkGameOver()
    clearInterval(timerId)
}


function reset() {
    // reset game stats
    gGame.firstClick = true
    gGame.isVictory = false
    gGame.markedCount = 0
    gGame.hintMode = false
    gGame.isExpand = false
    gGame.safeclicks = 3
    gGame.shownCount = 0
    gGame.secsPassed = 0
    gGame.isOn = true
    gGame.seconds = 0
    gGame.lives = 3

}