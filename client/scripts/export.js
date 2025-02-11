import { data, getTabNumbers, stringLetters } from "./editor.js";


const positions = 4 * 4;

function toACIIChords({chords, title}) {
    let file = title + '\n';
    let position = 0, startIndex = 0, startPosition = 0;
    for (let i = 0; i < chords.length; i++) {
        position += chords[i].duration
        if (position >= positions) {
            for (let j = 0; j < 6; j++) {
                file += writeLine(startPosition, chords.slice(startIndex, i + 1), j)
            }
            file += '\n'
            position -= positions;
            startPosition = position;
            startIndex = i + 1;
        }
    }
    if (startIndex < data.chords.length) {
        for (let j = 0; j < 6; j++) {
            file += writeLine(startPosition, chords.slice(startIndex), j)
        }
    }
    return file
}

const separator = '|'
const empty = '-'
const empty3 = '---'

function writeLine(startPosition, chords, lineNumber) {
    let line = stringLetters[lineNumber] + separator + empty3;

    let position = 0

    function incrementLine(characters) {
        characters = String(characters)
        line += characters + (characters.length === 1 ? empty3 : empty + empty)
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
    return line
}

function toCSV({chords}) {
    let file = ''
    for (let chord of chords) {
        file += chord.chord + ',' + chord.type + ',' + chord.duration + '\n'
    }
    return file
}

function toKeyboardAppJson({chords}){
    const keyMapping = {
        3: 'q',
        4:'2',
        5:'w',
        6:'3',
        7:'e',
        8: 'r',
        9: '5',
        10: 't',
        11: '6',
        0: 'y',
        1: '7',
        2: 'u'
    }
    let arr=[];
    let prevDur=0
    for (let chord of chords) {
        console.log(chord.chord);

        const rootNote = {
            note: keyMapping[chord.chord],
            delay:prevDur
        };
        let offset;
        switch (chord.type) {
            case 0:
                offset = 4;
                break;
            case 1:
                offset = 3;
                break;
            case 2:
                offset = 2;
                break;
            case 3:
                offset = 5;
                break;
            default:
                offset = 0;
        }


        const secondNote = {
            note: keyMapping[(chord.chord+offset)%12],
            delay:200
        };
        const thirdNote = {
            note: keyMapping[(chord.chord+7)%12],
            delay:200
        };
        arr.push(rootNote, secondNote, thirdNote);
        prevDur=chord.duration*500;
    }
    return JSON.stringify(arr);
}

const popupContent = document.getElementById('popupContent')
const popupTitle = document.getElementById('popupTitle')
const exportOptions = ['ASCII', 'JSON', 'KeyboardAppJSON', 'CSV']
let chosenOption = 0

export function exportPopupDisplay() {
    popupTitle.innerText = "Export"
    const msg = document.createElement('section')
    msg.innerText = "Choose a format:"
    popupContent.appendChild(msg)
    const exportSelector = document.createElement('select')
    exportSelector.className = 'exportSelector selector'
    exportSelector.size = 3

    exportOptions.forEach((exportOption, index) => {
        const option = document.createElement('option')
        if (index === 0) {
            option.selected = true
        }
        option.value = index
        option.innerText = exportOption
        exportSelector.appendChild(option)
    })    

    exportSelector.onchange = (e) => {
        chosenOption = e.target.value
    }

    chosenOption = 0;
    popupContent.appendChild(exportSelector)
}

export function exportConfirm() {
    const currentData = data.getData()
    let file
    let extension
    switch(exportOptions[chosenOption]) {
        case 'ASCII':
            file = toACIIChords(currentData);
            extension = '.txt'
            break;
        case 'JSON':
            file = JSON.stringify(currentData);
            extension = '.json'
            break;
        case 'KeyboardAppJSON':
            file = toKeyboardAppJson(currentData);
            extension = '.json'
            break;
        case 'CSV':
            file = toCSV(currentData);
            extension = '.csv'
    }
    const blob = new Blob([file], {type: 'text/plain'});
    const a = document.getElementById('download')
    a.href = URL.createObjectURL(blob);
    a.download = currentData.title + extension;
    a.click()
}