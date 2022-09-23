

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


function exterminate(elBtn) {
    debugger
    elBtn.disabled = true
    for (let i = 0; i < 3; i++) {
        let elCell = getUnsafeCell()
        //model done

        //DOM
        elCell.innerText = 'O'
        elCell.classList.add('planted')
        gHints.effectTimer = true
        setTimeout(() => {
            elCell.classList.remove('planted')
            elCell.innerText = ' '
            gHints.effectTimer = false
        }, 1000)
    }
}


function getUnsafeCell() {

    let idx = 0
    let randIdx = getRandomInt(0, gLevel.mines - (3 - gGame.lives))
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isShown) continue
            if (gBoard[i][j].isMine) {
                if (idx === randIdx) {
                    gBoard[i][j].isMine = false
                    gLevel.mines--
                    return document.querySelector(`td[data-i="${i}"][data-j="${j}"]`)
                }
                idx++
            }
        }
    }
}