
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
            elCell.classList.add('expanded')
            if (gBoard[i][j].isMine) {
                elCell.innerText = MINE
            }
            else {
                elCell.innerText = setMinesNegsCount(gBoard, { i, j })
            }
            debugger
            setTimeout(() => elCell.classList.remove('expanded'), 1000)
        }

    }

}