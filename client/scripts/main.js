const editor = document.getElementById('editor')
const playButton = document.getElementById('play')
const loadButton = document.getElementById('load')
const exportButton = document.getElementById('export')
const importButton = document.getElementById('import')
//                     0    1     2    3     4    5     6    7     8    9
const chordLetters = ["A", "A#", "B", "B#", "C", "C#", "D", "D#", "E", "E#",
//   10   11    12    13
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
    '6': {
        '0': [2, 3, 2, 0, null, null],
        '1': [1, 3, 2, 0, null, null],
    },
    '4': {
        '0': [0, 1, 0, 2, 3, null]
    },
    '12': {
        '0': [3, 0, 0, 0, 2, 3]
    }
}

const tabTemplates = {
    '0': [0, 0, 1, 2, 2, 0], // E major
    '1': [0, 0, 0, 2, 2, 0]  // E minor
}

const newChord = {
    chord: null,
    type: 0,
    duration: 1
}

let chords = [];

const divisionWidth = 230;
const rowHeight = 160;
const editorWidth = editor.clientWidth;
const selectorOffset = -15;
const linesHeight = 80;
const labelOffset = 24  ;

const divisionsPerRow = Math.floor(editorWidth / divisionWidth)

function chordOffsetPx(offset) {
    return Math.floor(divisionWidth / 5) * (1 + offset + Math.floor(offset / 4))
}

function getTabNumbers(chordNumber, typeNumber) {

}

function chordNumbers(offset, index) {
    const root = document.createElement('div')
    root.className = 'chordNumbers'
    
}

function chordEditor(offset, index) { // offset - missing notes
    const root = document.createElement('div')
    root.className = 'chordEditor'
    root.style.top = '0'
    root.style.left = `${chordOffsetPx(offset) + selectorOffset}px`

    const letterSelector = document.createElement('select')
    letterSelector.className = 'selector'
    
    chordLetters.forEach((letter, index) => {
        const option = document.createElement('option')
        option.value = index
        option.innerText = letter
        letterSelector.appendChild(option)
    })

    letterSelector.value = chords[index].chord === null ? '' : chords[index].chord

    const typeSelector = document.createElement('select')
    typeSelector.className = 'selector'

    chordTypes.forEach((type, index) => {
        const option = document.createElement('option')
        option.value = index
        option.innerText = type
        typeSelector.appendChild(option)
    })    

    const durationSelector = document.createElement('select')
    durationSelector.className = 'selector'

    durations.forEach(duration => {
        const option = document.createElement('option')
        option.value = duration
        option.innerText = duration
        durationSelector.appendChild(option)
    })

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
    root.appendChild(chordEditor(0, 1))
    root.appendChild(chordEditor(1, 1))
    root.appendChild(chordEditor(2, 1))
    root.appendChild(chordEditor(3, 1))
    root.appendChild(chordEditor(4, 1))

    labels.forEach((label, index) => {
        const labelElem = document.createElement('div')
        labelElem.className = 'label'
        labelElem.style.top = `${index * labelOffset}px`
        labelElem.innerText = label
        root.appendChild(labelElem)
    })

    const rowLines = RowLines()
    root.appendChild(rowLines)
    return root
}

function displayEditor() {
    editor.appendChild(Row(0, 1, 2))
}

displayEditor()