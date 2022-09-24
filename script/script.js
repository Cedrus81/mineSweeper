const MINE = 'X'
const FLAG = '🚩'
var timerId
var gGame = {
    firstClick: true,
    isOn: true,
    seconds: 0,
    markedCount: 0,
    shownCount: 0,
    recursiveCounter: 0,
    lives: 3,
    safeclicks: 3,
    isVictory: false
}

var gLevel = {
    bestScore: 0,
    size: 8,
    mines: 14
}
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
    if (gHints.effectTimer) {
        return
    }
    //get the DOM
    let i = +elCell.getAttribute("data-i")
    let j = +elCell.getAttribute("data-j")
    if (gBoard[i][j].isShown) {
        return
    }
    if (gHints.megaHints.isOn) {
        megaHint(i, j)
        return
    }
    if (gHints.hint.isOn) {
        if (elCell.classList.contains('.expanded')) return
        hintClicked(elCell)
        gHints.hint.isOn = false
        return
    }


    if (!gGame.recursiveCounter) {
        if (gGame.isOn) saveMatrix()
        if (gBoard[i][j].isMine) {
            gBoard[i][j].isShown = true
            clickOnMine(elCell)
            return
        }
    }

    normalCell(elCell)

}


function clickOnMine(elCell) {
    elCell.classList.remove('unclicked')
    let color = gGame.isVictory ? 'mine-victory' : 'mine'
    if (gGame.firstClick) {
        gGame.markedCount++
        color = 'firstClick'
    }
    elCell.classList.add(color)
    elCell.innerText = MINE
    if (gGame.isOn && !gGame.firstClick) {
        gGame.lives--
        elLives = document.querySelector('#lives')
        elLives.innerText = `Lives: ${gGame.lives}`
        if (!gGame.lives) {
            gameOver()
        }
    }
    if (gGame.firstClick) {
        startTimer()
        gGame.firstClick = false
    }
}

// handle a non-flag or bomb Cell
function normalCell(elCell) {
    let i = +elCell.getAttribute("data-i")
    let j = +elCell.getAttribute("data-j")

    if (elCell.classList.contains('unclicked')) {
        elCell.classList.remove('unclicked')
        if (gGame.isOn) {
            gGame.shownCount++
            checkScore()
        }
    }
    elCell.classList.add('expanded')
    gBoard[i][j].isShown = true
    if (gBoard[i][j].isMarked) gBoard[i][j].isMarked = false
    elCell.innerText = setMinesNegsCount(gBoard, { i, j })
    if (elCell.innerText == 0) { //on purpose 2 and not 3 '='s
        gGame.recursiveCounter++
        expandShown(gBoard, elCell, { i, j })
        gGame.recursiveCounter--
    }
    if (gGame.firstClick) {
        startTimer()
        gGame.firstClick = false
    }
}


function cellMarked(elCell) {
    let i = +elCell.getAttribute("data-i")
    let j = +elCell.getAttribute("data-j")
    if (gBoard[i][j].isShown) {
        return
    }
    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false
        elCell.innerText = ' '
        gGame.markedCount--
        return
    }
    gGame.markedCount++

    //DOM
    gBoard[i][j].isMarked = true

    //MODEL
    elCell.innerText = FLAG
    checkScore()
}



function checkScore() {
    document.querySelector('#score').innerText = `Score: ${gGame.shownCount}`
    if (gGame.shownCount > gLevel.bestScore) {
        gLevel.bestScore = gGame.shownCount
        document.querySelector('#best-score').innerText = `Best Score: ${gLevel.bestScore}`
    }
    if (gGame.shownCount + gGame.markedCount + (3 - gGame.lives) === gLevel.size ** 2) {
        victory()
    }
}

//stop timer, show text, stop score
function gameOver() {
    document.querySelector('#smiley').innerText = '🤯'
    gGame.isOn = false
    checkGameOver()

}

function victory() {
    document.querySelector('#smiley').innerText = '😁'
    gGame.isOn = false
    gGame.isVictory = true
    checkGameOver()
}

function checkGameOver() {
    clearInterval(timerId)
    disableAllBtns()
    disableHints()
    resetUndo()
    let unclicked = document.querySelectorAll(".unclicked")
    let hidden = document.querySelectorAll(".hidden")
    for (let elCell of unclicked) {
        cellClicked(elCell)
    }
    for (let span of hidden) {
        span.classList.remove('hidden')
    }
}


function reset() {
    clearInterval(timerId)
    resetStats()
    renderStats()
    enableAllBtns()
    resetUndo()
    debugger
    enableHints()
}


function resetStats() {
    gGame.isVictory = false
    gGame.markedCount = 0
    gGame.recursiveCounter = 0
    gGame.firstClick = true
    gGame.safeclicks = 3
    gGame.shownCount = 0
    gGame.isOn = true
    gGame.seconds = 0
    gGame.lives = 3

    gExterminateCount = 0
    if (gExterminateCount) gLevel.mines += gExterminateCount
}