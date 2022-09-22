
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
    let m
    this.classList.add('hide')
    console.log('choose 2 locations on the board');
    let locations = []
    for (let  = 0;  < 2; ++) {


    }
}