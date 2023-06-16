var csvData;
var cocktailList;

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
    var container = document.getElementById('order-list'); 
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
    var lines = csvData.split('\n'); // Split CSV into lines
    var tableHTML = '<table>';
  
    // Generate table header
    var headers = lines[0].split(',');
    tableHTML += '<tr>';
    for (var i = 0; i < headers.length; i++) {
      tableHTML += '<th>' + headers[i] + '</th>';
    }
    tableHTML += '</tr>';
  
    // Generate table rows
    for (var j = 1; j < lines.length; j++) {
      var row = lines[j].split(',');
      tableHTML += '<tr>';
      for (var k = 0; k < row.length; k++) {
        tableHTML += '<td>' + row[k] + '</td>';
      }
      tableHTML += '</tr>';
    }
  
    tableHTML += '</table>';
  
    return tableHTML;
  }




///////////////
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
            //orderResult = onTextChange(finalTranscript)
        } else {
            interimTranscript += text;
            //orderResult = onTextChange(interimTranscript)
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
