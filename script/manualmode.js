
var gManualMode = {}

function manualMode() {
    gManualMode.isOn = true
    gManualMode.mines = gLevel.mines
    manualBuildBoard(gLevel.size)
    renderBoard(gBoard)
    // disable all buttons while planting:
    disableAllBtns()
    console.log('Manual mode!!');
}



function manualBuildBoard(matSize) {
    gBoard = []
    for (let i = 0; i < matSize; i++) {
        gBoard[i] = []
        for (let j = 0; j < matSize; j++) {
            gBoard[i][j] = {}
            gBoard[i][j].isShown = false
            gBoard[i][j].isMine = false
        }
    }
}

function plantBomb(elCell) {
    console.log('mines left:', gManualMode.mines);
    if (gManualMode.isOn === false) {
        cellClicked(elCell)
        return
    }
    let i = +elCell.getAttribute("data-i")
    let j = +elCell.getAttribute("data-j")
    if (gBoard[i][j].isMine) return
    gManualMode.mines--
    //model
    gBoard[i][j].isMine = true

    //DOM
    elCell.classList.add('planted')
    elCell.classList.remove('hidden')
    elCell.innerText = MINE
    console.log('The bomb has been planted!');
    setTimeout(() => {
        elCell.classList.remove('planted')
        elCell.innerText = ' '
        elCell.classList.add('MINE', 'unclicked')

    }, 1500)

    if (gManualMode.mines === 0) {
        reset()
        gManualMode.isOn = false
    }
}

// in case the user presses reset while planting bombs
function resetManualMode() {
    gManualMode.isOn = false
    gManualMode.mines = 0
}