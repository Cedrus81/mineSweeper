function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}



function buildBoard(matSize, mineNum) {
    let mines = mineGenerator(matSize, mineNum)
    let mineIdx = 0
    gBoard = []
    console.log(mines)
    for (let i = 0; i < matSize; i++) {
        gBoard[i] = []
        for (let j = 0; j < matSize; j++) {
            gBoard[i][j] = {}
            gBoard[i][j].isShown = false
            gBoard[i][j].isMine = false
            if (mines[0] === mineIdx) {
                gBoard[i][j].isMine = true
                mines.splice(0, 1)
            }
            mineIdx++
        }
    }
}

function mineGenerator(matSize, mineNum) {
    let mat = []
    let mines = []
    for (let i = 0; i < matSize ** 2; i++) {
        mat[i] = i
    }
    for (let j = 0; j < mineNum; j++) {
        let randIdx = getRandomInt(0, mat.length)
        let randNum = mat[randIdx]
        mines.push(randNum)
        mat.splice(randIdx, 1)
    }
    return mines.sort((a, b) => a - b)
}


//count the mines around the cell
function setMinesNegsCount(board, location) {
    let mineCount = 0
    for (let i = location.i - 1; i < location.i + 2; i++) {
        if (i === -1) continue
        if (i === board.length) continue
        for (let j = location.j - 1; j < location.j + 2; j++) {
            if (location.i === i && location.j === j) continue
            if (j === -1) continue
            if (j === board[i].length) continue
            if (board[i][j].isMine) mineCount++
        }
    }
    return mineCount
}


function renderBoard(board) {
    let elTable = document.querySelector('table')
    let strHTML = '\t<tbody>'
    for (let i = 0; i < board.length; i++) {
        strHTML += '\t\n<tr>\n'
        for (let j = 0; j < board[i].length; j++) {
            let text = board[i][j].isMine ? MINE : setMinesNegsCount(gBoard, { i, j })
            let func = manualMode.isOn ? "plantBomb(this)" : "cellClicked(this)"
            strHTML += `\t<td data-i="${i}" data-j="${j}" `
            strHTML += `onclick=${func} oncontextmenu="cellMarked(this); return false;" `
            strHTML += `class="unclicked"><span class="hidden">${text}</span></td>\n`
        }
        strHTML += '\t\n</tr>\n'
    }
    strHTML += '\n\t</tbody>'
    elTable.innerHTML = strHTML
}



// //bonus
function expandShown(board, elCell, location) {
    gGame.isExpand = true
    elCell.setAttribute("isExpanded", true)

    for (let i = location.i - 1; i < location.i + 2; i++) {
        if (i === -1) continue
        if (i === board.length) continue

        for (let j = location.j - 1; j < location.j + 2; j++) {
            if (j === -1) continue
            if (j === board[i].length) continue
            let newCell = document.querySelector(`td[data-i="${i}"][data-j="${j}"]`)
            if (!newCell.getAttribute("isExpanded") || newCell.getAttribute("isExpanded") === "false") {
                cellClicked(newCell)
            }
        }
    }
    gGame.isExpand = false
}


function startTimer() {
    timerId = setInterval(() => {
        gGame.seconds++
        elTimer = document.querySelector('#timer')
        elTimer.innerHTML = `Time: ${gGame.seconds}`
    }, 1000)
}