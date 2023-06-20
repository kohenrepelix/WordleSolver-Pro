document.addEventListener('DOMContentLoaded', function() {
    var greenLettersSelect = document.getElementById('greenLettersSelect');
    var greenLettersContainer = document.getElementById('greenLettersContainer');
  
    greenLettersSelect.addEventListener('change', function() {
      if (greenLettersSelect.value === 'yes') {
        greenLettersContainer.style.display = 'block';
      } else {
        greenLettersContainer.style.display = 'none';
      }
    });
  
    var solveButton = document.getElementById('solveButton');
    solveButton.addEventListener('click', solveWordle);
  });
  
  function solveWordle() {
    var greenLettersSelect = document.getElementById('greenLettersSelect');
    var grayInput = document.getElementById('grayInput').value.toUpperCase();
    var yellowInput = document.getElementById('yellowInput').value.toUpperCase();
    var greenPositionsInput = document.getElementById('greenPositionsInput').value;
    var greenLettersInput = document.getElementById('greenLettersInput').value.toUpperCase();
  
    var grayLetters = grayInput.replace(/\s/g, '').split(",");
    var yellowLetters = yellowInput.replace(/\s/g, '').split(",");
    var greenPositions = greenPositionsInput.replace(/\s/g, '').split(",").map(Number);
    var greenLettersArray = greenLettersInput.replace(/\s/g, '').split(",");
  
    var wordListUrl = 'https://raw.githubusercontent.com/charlesreid1/five-letter-words/master/sgb-words.txt';
  
    function hasRequiredLetters(word, letters) {
      for (var i = 0; i < letters.length; i++) {  
        if (word.indexOf(letters[i]) === -1) return false;
      }
      return true;
    }
  
    function isGreenLetterPosition(position, letter) {
      for (var i = 0; i < greenPositions.length; i++) {
        if (greenPositions[i] === position && greenLettersArray[i] === letter) return true;
      }
      return false;
    }
  
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var wordListData = xhr.responseText;
          var wordList = wordListData.split("\n");
  
          var matchingWords = wordList.filter(function(word) {
            word = word.trim().toLowerCase();
            if (word.length !== 5) return false;
  
            var isValid = true;
  
            for (var i = 0; i < grayLetters.length; i++) {
              if (word.includes(grayLetters[i].toLowerCase())) {
                isValid = false;
                break;
              }
            }
  
            if (!isValid) return false;
  
            var hasYellowLetter = false;
  
            for (var i = 0; i < yellowLetters.length; i++) {
              if (word.includes(yellowLetters[i].toLowerCase())) {
                hasYellowLetter = true;
                break;
              }
            }
  
            if (!hasYellowLetter) return false;
  
            for (var i = 0; i < greenPositions.length; i++) {
              var position = greenPositions[i] - 1;
              var letter = greenLettersArray[i].toLowerCase();
              if (word.charAt(position) !== letter) return false;
            }
  
            return true;
          });
  
          var resultElement = document.getElementById('result');
          if (matchingWords.length > 0) {
            resultElement.textContent = "Possible words: " + matchingWords.join(", ");
          } else {
            resultElement.textContent = "No matching words found.";
          }
        } else {
          console.error("Error:", xhr.status);
        }
      }
    };
  
    xhr.open("GET", wordListUrl, true);
    xhr.send();
  }
  