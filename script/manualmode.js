
var manualMode = {}

function ManualMode() {
    reset()
    manualMode.isOn = true
    manualMode.mines = gLevel.mines
    ManualBuildBoard(gLevel.size)
    renderBoard(gBoard)
    // disable all buttons while planting:
    elBtns = document.querySelectorAll('button')
    for (let button of elBtns) {
        button.disabled = true
    }
    console.log('Manual mode!!');
}



function ManualBuildBoard(matSize) {
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
    console.log('mines left:', manualMode.mines);
    if (manualMode.mines === 0) {
        elBtns = document.querySelectorAll('button')
        for (let button of elBtns) {
            button.disabled = false
        }
        cellClicked(elCell)
        return
    }
    let i = +elCell.getAttribute("data-i")
    let j = +elCell.getAttribute("data-j")
    if (gBoard[i][j].isMine) return
    manualMode.mines--
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
}
