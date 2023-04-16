const messageDiv = document.getElementById('message');

document.getElementById('saveButton').addEventListener('click', () => {
  chrome.tabs.executeScript(
    { code: 'window.getSelection().toString();' },
    ([selectedText]) => {
      if (selectedText) {
        saveText(selectedText);
        messageDiv.textContent = 'Text saved';
      } else {
        messageDiv.textContent = 'No text selected';
      }
    }
  );
});

document.getElementById('exportButton').addEventListener('click', () => {
  const fileFormat = document.getElementById('fileFormat').value;
  chrome.storage.local.get(['savedText'], (result) => {
    if (result.savedText) {
      if (fileFormat === 'both') {
        exportAllText(result.savedText);
      } else {
        exportText(result.savedText, fileFormat);
      }
      // Clear the storage after exporting
      chrome.storage.local.remove(['savedText']);
      messageDiv.textContent = 'Text exported';
    } else {
      messageDiv.textContent = 'No saved text to export';
    }
  });
});

document.getElementById('clearButton').addEventListener('click', () => {
  chrome.storage.local.remove(['savedText'], () => {
    messageDiv.textContent = 'Storage cleared';
  });
});

function saveText(text) {
  chrome.storage.local.get(['savedText'], (result) => {
    const bulletPoint = '• ';
    let newText = result.savedText ? result.savedText + '\n' + bulletPoint + text : bulletPoint + text;
    chrome.storage.local.set({ savedText: newText });
  });
}

function exportText(text, fileFormat) {
  let mimeType;
  let fileContent;
  let fileName;

  if (fileFormat === 'csv') {
    mimeType = 'text/csv;charset=utf-8';
    fileContent = text
      .split('\n')
      .map(line => line.replace('• ', ''))
      .join('\n');
    fileName = 'exported-text.csv';
  } else {
    mimeType = 'text/plain;charset=utf-8';
    fileContent = text;
    fileName = 'exported-text.txt';
  }

  const blob = new Blob([fileContent], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

function exportAllText(text) {
  exportText(text, 'txt');
  setTimeout(() => {
    exportText(text, 'csv');
  }, 1000);
}
