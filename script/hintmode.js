var safeclicks = 3
var gHints = {
    effectTimer: false,
    hint: {
        isOn: false
    },
    megaHints: {
        isOn: false,
        locations: [],
    }
}


function hintMode(elHint) {
    if (gHints.hint.isOn || !gGame.isOn) {
        return
    }

    gHints.hint.isOn = true
    elHint.classList.remove('hint')
    elHint.classList.add('hint-used')
}

function hintClicked(elCell) {
    gHints.effectTimer = true
    let cellI = +elCell.getAttribute("data-i")
    let cellJ = +elCell.getAttribute("data-j")
    for (let i = cellI - 1; i < cellI + 2; i++) {
        if (i === - 1) continue
        if (i === gBoard.length) break
        for (let j = cellJ - 1; j < cellJ + 2; j++) {
            if (j === - 1) continue
            if (j === gBoard.length) continue
            if (gBoard[i][j].isShown) continue
            let newCell = document.querySelector(`td[data-i="${i}"][data-j="${j}"]`)
            newCell.classList.add('expanded')
            if (gBoard[i][j].isMine) {
                newCell.innerText = MINE
            }
            else {
                newCell.innerText = setMinesNegsCount(gBoard, { i, j })
            }
            setTimeout(() => {
                newCell.classList.remove('expanded')
                newCell.innerText = ' '
                if (gBoard[i][j].isMarked) newCell.innerText = FLAG
                gHints.effectTimer = false
            }, 1000)
        }

    }

}


function megaHintMode(button) {
    if (button.classList.contains('disabled')) return
    gHints.megaHints.isOn = true
    console.log('choose 2 locations on the board');
    disableAllBtns()
}

function megaHint(i, j) {
    if (gHints.megaHints.locations.length <= 1) {
        gHints.megaHints.locations.push({ i, j })
    }
    if (gHints.megaHints.locations.length === 2) {
        megaHintReveal()
    }
}

function megaHintReveal() {
    gHints.effectTimer = true

    //find the smaller i and the smaller j
    let smallI = Math.min(gHints.megaHints.locations[0].i, gHints.megaHints.locations[1].i)
    let smallJ = Math.min(gHints.megaHints.locations[0].j, gHints.megaHints.locations[1].j)

    let bigI = Math.max(gHints.megaHints.locations[0].i, gHints.megaHints.locations[1].i)
    let bigJ = Math.max(gHints.megaHints.locations[0].j, gHints.megaHints.locations[1].j)

    let from = { i: smallI, j: smallJ }
    let to = { i: bigI, j: bigJ }

    for (let i = from.i; i <= to.i; i++) {
        for (let j = from.j; j <= to.j; j++) {
            if (gBoard[i][j].isShown) continue
            let newCell = document.querySelector(`td[data-i="${i}"][data-j="${j}"]`)
            newCell.classList.add('expanded')
            if (gBoard[i][j].isMine) {
                newCell.innerText = MINE
            }
            else {
                newCell.innerText = setMinesNegsCount(gBoard, { i, j })
            }
            setTimeout(() => {
                newCell.classList.remove('expanded')
                newCell.innerText = ' '
                if (gBoard[i][j].isMarked) newCell.innerText = FLAG
                gHints.effectTimer = false
            }, 1000)
        }
    }
    gHints.megaHints.isOn = false
    enableAllBtns()
    document.querySelector('#megaHint').classList.add('disabled')
}


function safeCell(elBtn) {
    if (elBtn.classList.contains('disabled')) return
    gGame.safeclicks--
    let elCell = getSafeCell()
    elCell.classList.add('safeclick')
    elBtn.innerText = `Safe Clicks: ${gGame.safeclicks}`
    if (!gGame.safeclicks) {
        elBtn.classList.add('disabled')
    }
    setTimeout(() => elCell.classList.remove('safeclick'), 2000)
}

function getSafeCell() {

    let idx = 0
    let randIdx = getRandomInt(0, gLevel.size ** 2 - gLevel.mines - gGame.shownCount)       // the X'th cell which isnt a mine
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isShown) continue
            if (gBoard[i][j].isMine) continue
            if (idx === randIdx) {
                return document.querySelector(`td[data-i="${i}"][data-j="${j}"]`)
            }
            idx++
        }
    }
}

function disableHints() {
    let elHints = document.querySelectorAll('.hint')
    for (const hint of elHints) {
        hint.classList.add('hint-used')
    }
}

function enableHints() {
    gHints.effectTimer = false
    gHints.hint.isOn = false
    gHints.megaHints.isOn = false
    gHints.megaHints.locations.splice(0)

    let elHints = document.querySelectorAll('.hint-used')
    for (const hint of elHints) {
        hint.classList.remove('hint-used')
        hint.classList.add('hint')
    }
}