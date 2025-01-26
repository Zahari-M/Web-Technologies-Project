import { data, getTabNumbers, stringLetters } from "./editor.js";


let file = ''
const positions = 4 * 4;

export function toACIIChords({chords, title}) {
    file = title + '\n';
    let position = 0, startIndex = 0, startPosition = 0;
    for (let i = 0; i < chords.length; i++) {
        position += chords[i].duration
        if (position >= positions) {
            for (let j = 0; j < 6; j++) {
                writeLine(startPosition, chords.slice(startIndex, i + 1), j)
            }
            file += '\n'
            position -= positions;
            startPosition = position;
            startIndex = i + 1;
        }
    }
    if (startIndex < data.chords.length) {
        for (let j = 0; j < 6; j++) {
            writeLine(startPosition, chords.slice(startIndex), j)
        }
    }
}

const separator = '|'
const empty = '-'
const empty3 = '---'

function writeLine(startPosition, chords, lineNumber) {
    let line = stringLetters[lineNumber] + separator + empty3;

    let position = 0

    function incrementLine(letter) {
        line += letter + empty3
        if ((position + 1) % 4 === 0) {
            line += separator + (position + 1 === positions ? '' : empty3)
        }
        position++
    }
    for (let i = 0; i < startPosition; i++) {
        incrementLine(empty)
    }
    for (let i = 0; i < chords.length; i++) {
        const numbers = getTabNumbers(chords[i])
        incrementLine(numbers[lineNumber] === null ? empty : numbers[lineNumber])
        for (let j = 1; j < chords[i].duration; j++) {
            incrementLine(empty)
        }
    }
    for (let i = position; i < positions; i++) {
        incrementLine(empty)
    }
    line += '\n'
    file += line
}

const popupContent = document.getElementById('popupContent')
const popupTitle = document.getElementById('popupTitle')
const confirmPopup = document.getElementById('confirmPopup')

export function exportPopupContent() {
    popupTitle.innerText = "Export"
    confirmPopup.addEventListener('click', onConfirm)
}

function onConfirm() {
    const currentData = data.getData()
    toACIIChords(currentData)
    const blob = new Blob([file], {type: 'text/plain'});
    const a = document.getElementById('download')
    a.href = URL.createObjectURL(blob);
    a.download = currentData.title + '.txt';
    a.click()
    confirmPopup.removeEventListener('click', onConfirm)
}