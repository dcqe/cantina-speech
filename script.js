// Create a SpeechRecognition object
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();

// Set parameters for the recognition
recognition.lang = 'en-US';
recognition.continuous = true;
recognition.interimResults = true;

recognition.onresult = (event) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = 0; i < event.results.length; ++i) {
        const result = event.results[i];
        const text = result[0].transcript;

        let orderResult = null;
        if (result.isFinal) {
            finalTranscript += text;
            orderResult = onTextChange(finalTranscript)
        } else {
            interimTranscript += text;
            orderResult = onTextChange(interimTranscript)
        }
        if (orderResult !== null){
            return orderResult;
        }
    }

    const transcriptionElement = document.getElementById('transcription');
    //new interim text and final transcriptions in two lines
    transcriptionElement.innerHTML = `<div  class="interim">${interimTranscript}</div ><div  class="final">${finalTranscript}</div >`;
};

recognition.onend = () => {
    // Restart the recognition when it ends
    recognition.start();
};

recognition.start();

/////////////
class Cocktail {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    isEqual(text) {
        return text === this.id || text === this.name;
    }
}

function onTextChange(entireText) {//detect cocktail
    var trimmedText = entireText.trim();

    const fs = require('fs');
    const fileContents = fs.readFileSync('cocktails.csv', 'utf8');
    const allCocktails = parseCSVFile(fileContents);

    for (const cocktail in allCocktails){
        if(cocktail.isEqual(trimmedText)){
            return cocktail;
        }
    }
    return null;
}

function parseCSVFile(csvData) {
    const lines = csvData.split('\n');
    const cocktails = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        const [id, name] = line.split(',');
        if (id && name) {
            const cocktail = new Cocktail(id, name);
            cocktails.push(cocktail);
        }
    }

    return cocktails;
}
