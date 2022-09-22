var gUndo = {
    board: [],
    stats: [],
    counter: 0
}

function saveMatrix() {
    gUndo.board[gUndo.counter] = structuredClone(gBoard)
    gUndo.stats[gUndo.counter] = { ...gGame }
    gUndo.counter++
    document.querySelector('#undo').disabled = false
}

function undo(elBtn) {
    gUndo.counter--
    if (gUndo.counter === 0) elBtn.disabled = true
    //model
    // attributes I want to keep:
    gUndo.stats[gUndo.counter].seconds = gGame.seconds
    gUndo.stats[gUndo.counter].firstClick = gGame.firstClick

    gBoard = gUndo.board[gUndo.counter]
    gGame = gUndo.stats[gUndo.counter]
    //DOM
    renderUndo()
}

//renderBack runs over the new (old) gBoard, what is not shown is now unclicked and not expanded
function renderUndo() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {

            if (gBoard[i][j].isShown) continue
            let elCell = document.querySelector(`td[data-i="${i}"][data-j="${j}"]`)
            if (gBoard[i][j].isMine) {
                elCell.classList.remove('mine', 'mine-victory')
            }
            if (gBoard[i][j].isMarked) {
                elCell.innerText = FLAG
            }
            elCell.innerText = ' '
            elCell.setAttribute("isExpanded", false)
            elCell.classList.remove('expanded')
            elCell.classList.add('unclicked')

        }
    }
    document.querySelector('#smiley').innerText = '😃'
    document.querySelector('#lives').innerText = `Lives: ${gGame.lives}`
    gUndo.board.pop()
    gUndo.stats.pop()

}