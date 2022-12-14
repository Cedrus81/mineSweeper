var gMessages = {
    megaHint: 'Choose two cells to reveal the square between them',
    manualMode: `Plant ${gLevel.mines} mines on the board and play!`,
    sBoom: 'Play 7 boom, cells can only be revealed one by one, and do not show numbers',
    exterminate: `Exterminate ${3 > gLevel.mines ? 3 : gLevel.mines} of the ${gLevel.mines} currently unrevealed mines`,
    safeClick: `A safe non-mine cell will be marked in green`,
    undo: 'Undo the last move',
}



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
            let text = board[i][j].isMine ? MINE : is7Boom ? ' ' : setMinesNegsCount(gBoard, { i, j })
            let func = gManualMode.isOn ? "plantBomb(this)" : "cellClicked(this)"
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
}


function startTimer() {
    timerId = setInterval(() => {
        gGame.seconds++
        elTimer = document.querySelector('#timer')
        elTimer.innerHTML = `Time: ${gGame.seconds}`
    }, 1000)
}


function disableAllBtns() {
    let elBtns = document.querySelectorAll('.menu td')
    for (const btn of elBtns) {
        if (btn.classList.contains('difficulty')) continue
        if (btn.id === 'dark') continue
        btn.classList.add('disabled')
    }
}

function enableAllBtns() {
    let elBtns = document.querySelectorAll('.disabled')
    for (btn of elBtns) {
        if (btn.id === 'undo') continue
        btn.classList.remove('disabled')
    }
}



function renderStats() {
    document.querySelector('#smiley').innerText = '????'
    document.querySelector('#timer').innerText = `Time: ${gGame.seconds}`
    document.querySelector('#lives').innerText = `Lives: ${gGame.lives}`
    document.querySelector('#mines').innerText = `Mines: ${gLevel.mines}`
    document.querySelector('#safeClick').innerText = `Safe Clicks: ${gGame.safeclicks}`
}

function renderAll() {
    let unclicked = document.querySelectorAll(".unclicked")
    let hidden = document.querySelectorAll(".hidden")
    for (let elCell of unclicked) {
        cellClicked(elCell)
    }
    for (let span of hidden) {
        span.classList.remove('hidden')
    }
}



function darkMode() {
    let elBody = document.querySelector('body')
    if (elBody.classList.contains('body-dark')) {
        elBody.classList.remove('body-dark')
    }
    else {
        elBody.classList.add('body-dark')
    }
}

function info(elBtn) {
    let elInfoBoard = document.querySelector('.infoBoard')
    let text = ''
    switch (elBtn.id) {
        case 'megaHint':
            text = 'Choose two cells to reveal the square between them'
            break;
        case 'manualMode':
            text = `Plant ${gLevel.mines} mines on the board and play!`
            break;
        case 'sBoom':
            text = 'Play 7 boom, cells can only be revealed one by one, and do not show numbers'
            break
        case 'exterminate':
            text = `Exterminate ${3 < gLevel.mines ? 3 : gLevel.mines} of the ${gLevel.mines} currently unrevealed mines`
            break
        case 'safeClick':
            text = `A safe non-mine cell will be marked in green`
            break
        case 'undo':
            text = 'Undo the last move'
            break
    }
    elInfoBoard.innerText = text

}