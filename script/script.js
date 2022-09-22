const MINE = 'X'
const FLAG = '🚩'
var timerId
var gGame = {
    isOn: true,
    hintMode: false,
    seconds: 0,
    markedCount: 0,
    shownCount: 0,
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
        saveMatrix()
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
    if (gGame.firstClick) {
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
    if (gBoard[i][j].isMine) gBoard[i][j].isMine = false  // helps in case of megahint
    if (gBoard[i][j].isMarked) gBoard[i][j].isMarked = false

    elCell.innerText = setMinesNegsCount(gBoard, { i, j })
    debugger
    if (elCell.innerText == 0) { //on purpose 2 and not 3 '='s
        expandShown(gBoard, elCell, { i, j })

    }
}

//flag
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
    if (gGame.shownCount + gGame.markedCount === gLevel.size ** 2) {
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
    document.querySelector('#undo').disabled = true
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
    // reset game stats
    clearInterval(timerId)
    gGame.firstClick = true
    gGame.isVictory = false
    gGame.markedCount = 0
    gGame.hintMode = false
    gGame.isExpand = false
    gGame.safeclicks = 3
    gGame.shownCount = 0
    gGame.isOn = true
    gGame.seconds = 0
    gGame.lives = 3

    gUndo.board.splice(0)
    gUndo.stats.splice(0)
    gUndo.counter = 0

    gMegaHint.locations.splice(0)
    manualMode = {}
    document.querySelector('#smiley').innerText = '😃'
    document.querySelector('#timer').innerText = 'Time: 0'
    document.querySelector('#lives').innerText = 'Lives: 3'
    let elBtns = document.querySelectorAll(':disabled')
    for (btn of elBtns) {
        btn.disabled = false
    }
    document.querySelector('#undo').disabled = true
    let hints = document.querySelectorAll('.hint-used')
    for (hint of hints) {
        hint.classList.remove('hint-used')
    }
}