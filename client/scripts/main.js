const editor = document.getElementById('editor')
const playButton = document.getElementById('play')
const loadButton = document.getElementById('load')
const exportButton = document.getElementById('export')
const importButton = document.getElementById('import')
//                     0    1     2    3     4    5     6    7    
const chordLetters = ["A", "A#", "B", "C", "C#", "D", "D#", "E",
//   8    9     10   11
    "F", "F#", "G", "G#"];
//                    0     1
const chordTypes = ['maj', 'min']
const durations = [1, 2, 4]
const labels = ['chord:', 'type:', 'duration:']

const tabPresets = {
    '0': {
        '0': [0, 2, 2, 2, 0, null],
        '1': [0, 1, 2, 2, 0, null]
    },
    '5': {
        '0': [2, 3, 2, 0, null, null],
        '1': [1, 3, 2, 0, null, null],
    },
    '3': {
        '0': [0, 1, 0, 2, 3, null]
    },
    '10': {
        '0': [3, 0, 0, 0, 2, 3]
    }
}

const tabTemplates = {
    '0': [0, 0, 1, 2, 2, 0], // E major
    '1': [0, 0, 0, 2, 2, 0]  // E minor
}

class Chord {
    chord = null;
    type = 0;
    duration = 1;
}

let chords = [new Chord()];

const divisionWidth = 230;
const rowHeight = 160;
const editorWidth = editor.clientWidth;
const selectorOffset = -15;
const linesHeight = 80;
const labelOffset = 24;
const numberOffset = (linesHeight / 5) / 2;
const numberFontSize = 16;

const divisionsPerRow = Math.floor(editorWidth / divisionWidth)

function chordPositionPx(position) {
    return Math.floor(divisionWidth / 5) * (1 + position + Math.floor(position / 4))
}

function getTabNumbers(chordNumber, typeNumber) {
    if (tabPresets[chordNumber] && tabPresets[chordNumber][typeNumber]) {
        return tabPresets[chordNumber][typeNumber]
    }

    return tabTemplates[typeNumber].map(number => 
        (number + chordNumber - 7 + chordLetters.length) % chordLetters.length)
}

function chordNumbers(position, index) {
    const root = document.createElement('div')
    root.className = 'chordNumbers'
    root.style.height = `${linesHeight}px`
    root.style.left = `${chordPositionPx(position)}px`
    const numbers = getTabNumbers(chords[index].chord, chords[index].type)
    for (let i = 0; i < 6; i++) {
        if (numbers[i] === null) {
            continue;
        }
        const chordNumber = document.createElement('div')
        chordNumber.className = 'chordNumber'
        chordNumber.style.top = `${(i * linesHeight / 5) - numberOffset}px`
        chordNumber.innerText = numbers[i]
        root.appendChild(chordNumber);
    }
    return root
}

function getHandler(property, index) {
    return (e) => {
        chords[index][property] = Number(e.target.value);
        displayEditor()
    } 
}

function chordEditor(position, index) { // position - missing notes
    const root = document.createElement('div')
    root.className = 'chordEditor'
    root.style.top = '0'
    root.style.left = `${chordPositionPx(position) + selectorOffset}px`

    const letterSelector = document.createElement('select')
    letterSelector.className = 'selector'
    
    chordLetters.forEach((letter, index) => {
        const option = document.createElement('option')
        option.value = index
        option.innerText = letter
        letterSelector.appendChild(option)
    })

    letterSelector.value = chords[index].chord === null ? '' : chords[index].chord
    letterSelector.onchange = getHandler('chord', index)

    const typeSelector = document.createElement('select')
    typeSelector.className = 'selector'

    chordTypes.forEach((type, index) => {
        const option = document.createElement('option', index)
        option.value = index
        option.innerText = type
        typeSelector.appendChild(option)
    })    

    typeSelector.value = chords[index].type
    typeSelector.onchange = getHandler('type', index)

    const durationSelector = document.createElement('select')
    durationSelector.className = 'selector'

    durations.forEach(duration => {
        const option = document.createElement('option')
        option.value = duration
        option.innerText = duration
        durationSelector.appendChild(option)
    })

    durationSelector.value = chords[index].duration
    durationSelector.onchange = getHandler('duration', index)

    root.appendChild(letterSelector)
    root.appendChild(typeSelector)
    root.appendChild(durationSelector)
    
    return root
}

function RowLines() {
    const root = document.createElement('div')
    root.className = 'lines'
    root.style.height = `${linesHeight}px`
    for (let i = 0; i < 6; i++) {
        const line = document.createElement('div')
        line.className = 'line'
        line.style.top = `${i * linesHeight / 5}px`
        line.style.width = `${divisionWidth * divisionsPerRow}px`
        root.appendChild(line);
    }
    for (let i = 0; i < divisionsPerRow + 1; i++) {
        const divisionSeparator = document.createElement('div')
        divisionSeparator.className = 'divisionSeparator'
        divisionSeparator.style.left = `${i * divisionWidth}px`
        root.appendChild(divisionSeparator)
    }
    return root;
}

function Row(offset, startIndex, endIndex) {
    const root = document.createElement('div')
    root.className = 'row'
    root.style.height = `${rowHeight}px`

    labels.forEach((label, index) => {
        const labelElem = document.createElement('div')
        labelElem.className = 'label'
        labelElem.style.top = `${index * labelOffset}px`
        labelElem.innerText = label
        root.appendChild(labelElem)
    })

    const rowLines = RowLines()
    root.appendChild(rowLines)
    
    for (let i = startIndex; i <= endIndex; i++) {
        root.appendChild(chordEditor(offset, i))
        if (chords[i].chord !== null) {
            root.appendChild(chordNumbers(offset, i))    
        }
        offset += chords[i].duration
    }

    return root
}

function displayEditor() {
    editor.innerHTML = ''
    if (chords[chords.length - 1].chord !== null) {
        chords[chords.length] = new Chord()
    }

    let offset = 0, startIndex = 0, startOffset = 0;
    const totalPositions = divisionsPerRow * 4
    for (let i = 0; i < chords.length; i++) {
        offset += chords[i].duration
        if (offset >= totalPositions) {
            editor.appendChild(Row(startOffset, startIndex, i))
            offset -= totalPositions;
            startOffset = offset;
            startIndex = i + 1;
        }
    }
    if (startIndex < chords.length) {
        editor.appendChild(Row(startOffset, startIndex, chords.length - 1))
    }
}

displayEditor()