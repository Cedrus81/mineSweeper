var gMegaHint = {
    isOn: false,
    locations: [],
}


function hintMode(img) {
    gGame.hintMode = true
    img.classList.add('hide')
}

function hintClicked(elCell) {
    let cellI = +elCell.getAttribute("data-i")
    let cellJ = +elCell.getAttribute("data-j")
    for (let i = cellI - 1; i < cellI + 2; i++) {
        if (i === - 1) continue
        if (i === gBoard.length) break
        for (let j = cellJ - 1; j < cellJ + 2; j++) {
            if (j === - 1) continue
            if (j === gBoard.length) continue
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
            }, 1000)
        }

    }

}


function megaHintMode(button) {
    gMegaHint.isOn = true
    button.classList.add('hide')
    console.log('choose 2 locations on the board');
}

function megaHint(i, j) {
    if (gMegaHint.locations.length <= 1) {
        gMegaHint.locations.push({ i, j })
    }
    if (gMegaHint.locations.length === 2) {
        megaHintReveal()
    }
}

function megaHintReveal() {

    //find the smaller i and the smaller j
    let smallI = Math.min(gMegaHint.locations[0].i, gMegaHint.locations[1].i)
    let smallJ = Math.min(gMegaHint.locations[0].j, gMegaHint.locations[1].j)

    let bigI = Math.max(gMegaHint.locations[0].i, gMegaHint.locations[1].i)
    let bigJ = Math.max(gMegaHint.locations[0].j, gMegaHint.locations[1].j)

    let from = { i: smallI, j: smallJ }
    let to = { i: bigI, j: bigJ }

    for (let i = from.i; i <= to.i; i++) {
        for (let j = from.j; j <= to.j; j++) {
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
            }, 1000)
        }
    }
    gMegaHint.isOn = false
}