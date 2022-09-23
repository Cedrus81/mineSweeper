

function sBoom() {
    reset()
    gGame.firstClick = false
    gGame.isOn = true
    arrange7BOOM()
    renderBoard(gBoard)
}

function arrange7BOOM() {
    let counter = 1
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            gBoard[i][j].isShown = false
            if (counter % 7 === 0 || has7(counter)) {
                gBoard[i][j].isMine = true
            }
            else {
                gBoard[i][j].isMine = false
            }
            counter++
        }

    }
}

function has7(counter) {
    let text = counter.toString()
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '7') return true
    }
    return false
}