import { data, getTabNumbers, stringLetters, tabPresets, tabTemplates } from "./editor.js";
import { positions } from "./export.js";


function fromACIIChords(file) {
    let chords = [], title;
    const lines = file.split('\n')
    title = lines[0]
    for (let i = 1; i < lines.length; i += 7) {
        if (i + 5 >= lines.length) {
            break;
        }
        const {newChords, delay} = readChords(lines.slice(i, i + 6))   
        if (chords.length > 0) {
            chords[chords.length - 1].duration += delay
        }
        chords = chords.concat(chords, newChords)
    }
    return {chords, title}
}

function getChordInfo(numbers) {
    for (let chord in tabPresets) {
        for (let type in tabPresets[chord]) {
            if (JSON.stringify(numbers) === JSON.stringify(tabPresets[chord][type])) {
                return {chord: Number(chord), type}
            }
        }
    }

    const template = numbers.map(number => number - numbers[0])
    for (let type in tabTemplates) {
        if (JSON.stringify(tabTemplates[type]) === JSON.stringify(template)) {
            return {chord: (numbers[0] + 7) % 12, type}
        }
    }
}

function readChords(lines) {
    const newChords = [];

    let index = 5
    let duration = 1
    let delay = 0

    function readChord(position) {
        const numbers = []
        let hasNumbers = false
        for (let i = 0; i < lines.length; i++) {
            if (lines[i][index] === '-') {
                numbers[i] = null
            } else {
                numbers[i] = Number(lines[i][index])
                hasNumbers = true
            }

            if (lines[i][index + 1] !== '-') {
                numbers[i] = numbers[i] * 10 + Number(lines[i][index + 1])
            }
            if (isNaN(numbers[i])) {
                throw new Error()
            }
        }

        if (hasNumbers) {
            if (newChords.length === 0) {
                delay = duration - 1
            } else {
                newChords[newChords.length - 1].duration = duration
            }
            newChords.push({...getChordInfo(numbers), duration: 1})

            duration = 1
        } else {
            duration++
        }

        if (position % 4 === 0) {
            index += 8
        } else {
            index += 4
        }
    }    

    for (let i = 1; i <= positions; i++) {
        readChord(i)
    }

    newChords[newChords.length - 1].duration = Math.min(duration, 4)

    return {newChords, delay}
}

function fromCSV(file) {
    let chords = [], title;
    let lines = file.split('\n')
    title = lines[0]
    lines = lines.slice(2)
    for (let line of lines) {
        if (line !== '') {
        const values = line.split(',')
        chords.push({chord: Number(values[0]), type: Number(values[1]),
            duration: Number(values[2])})
        }
    }
    return {chords, title}
}

const popupContent = document.getElementById('popupContent')
const popupTitle = document.getElementById('popupTitle')
let importResult = 0 // 0 - unknown file type, 1 - parse error, 2 - Improt successful
const importMsg = ['Unknown file type', 'Invalid file content', 'Import successful']

export function importPopupDisplay() {
    popupTitle.innerText = "Import"
    const msg = document.createElement('section')

    msg.innerText = importMsg[importResult]
    popupContent.appendChild(msg)
}

export function importData(file, type) {
    let newData
    importResult = 0
    try {
        switch(type) {
            case 'txt':
                newData = fromACIIChords(file);
                break;
            case 'json':
                newData = JSON.parse(file)
                break;
            case 'csv':
                newData = fromCSV(file);
                break;
            default: 
                return;
        }
        data.setData(newData)
        importResult = 2
    } catch(e) {
        importResult = 1
    }
}