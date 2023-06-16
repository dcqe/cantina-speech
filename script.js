let csvData;
let cocktailList;

// Function to handle the CSV file response
function handleCSVResponse(response) {
    if (!response.ok) {
        console.error('Failed to load the CSV file:', response.status, response.statusText);
        return;
    }

    response.text().then(function (contents) {
        csvData = contents; // Store the CSV data in the global variable
        console.log('CSV data:', csvData);
        cocktailList = parseCSVFile(csvData)
        console.log(cocktailList)

        // Get the container element where the table will be displayed
        const container = document.getElementById('order-list');
        // Generate the HTML table and insert it into the container
        container.innerHTML = generateHTMLTable(contents);
    });
}

// Fetch the CSV file from the server
fetch('cocktails.csv')
    .then(handleCSVResponse)
    .catch(function (error) {
        console.error('Failed to fetch the CSV file:', error);
    });


function generateHTMLTable(csvData) {
    const lines = csvData.split('\n'); // Split CSV into lines
    let tableHTML = '<table>';

    // Generate table header
    const headers = lines[0].split(',');
    tableHTML += '<tr>';
    for (let i = 0; i < headers.length; i++) {
        tableHTML += '<th>' + headers[i] + '</th>';
    }
    tableHTML += '</tr>';

    // Generate table rows
    for (let j = 1; j < lines.length; j++) {
        const row = lines[j].split(',');
        tableHTML += '<tr>';
        for (let k = 0; k < row.length; k++) {
            tableHTML += '<td>' + row[k] + '</td>';
        }
        tableHTML += '</tr>';
    }

    tableHTML += '</table>';

    return tableHTML;
}



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

        if (result.isFinal) {
            finalTranscript += text;
        } else {
            interimTranscript += text;
        }
    }

    const transcriptionElement = document.getElementById('transcription');
    transcriptionElement.innerHTML = `<div  class="interim">${interimTranscript}</div ><div  class="final">${finalTranscript}</div >`;
    let orderResult = onTextChange(finalTranscript + interimTranscript)
    const logElem = document.getElementById('log');
    logElem.innerHTML = orderResult;
    if (orderResult !== "" && orderResult !== null && orderResult !== 0) {
        console.log(orderResult);
    }
};

recognition.onend = () => {
    // Restart the recognition when it ends
    recognition.start();
};

recognition.start();

recognition.onstart = () => {
    const logElem = document.getElementById('log');
    logElem.innerHTML = `<div class="log">recognition started</div >`;
}

/////////////
class Cocktail {

    constructor(id, name) {
        this.id = id;
        this.name = String(name);
    }

    toString() {
        return String(this.id) + ": " + String(this.name);
    }
}

function onTextChange(entireText) {//detect cocktail
    let trimmedText = entireText.trim();
    trimmedText = trimmedText.replace(",", "");
    console.log(trimmedText);
    for (var i = 0; i < cocktailList.length; i++) {
        var cocktail = cocktailList[i];
        if (includedIn(cocktail, trimmedText)) {
            return cocktail
        }
    }
    return null;
}

function includedIn(cocktail, text) {
    const lowerText = String(text).toLowerCase()
    console.log(lowerText)
    return lowerText.includes(cocktail.id) || lowerText.includes(String(cocktail.name).toLowerCase());
}

function parseCSVFile(csvData) {
    const lines = csvData.split('\n');
    var cocktails = [];

    for (let i = 1; i < lines.length; i++) {//ignore header
        let line = lines[i].trim();
        const [id, name] = line.split(',');
        if (id && name) {
            const cocktail = new Cocktail(id, name);
            cocktails.push(cocktail);
        }
    }

    return cocktails;
}
