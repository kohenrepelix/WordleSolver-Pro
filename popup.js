document.addEventListener('DOMContentLoaded', function() {
  var greenLettersSelect = document.getElementById('greenLettersSelect');
  var greenLettersContainer = document.getElementById('greenLettersContainer');

  function toggleGreenLettersContainer() {
    greenLettersContainer.style.display = greenLettersSelect.value === 'yes' ? 'block' : 'none';
  }

  toggleGreenLettersContainer(); // Initial state

  greenLettersSelect.addEventListener('change', function() {
    toggleGreenLettersContainer(); // Toggle when the dropdown value changes
  });

  var solveButton = document.getElementById('solveButton');
  solveButton.addEventListener('click', solveWordle);

  function solveWordle() {
    var grayInput = document.getElementById('grayInput').value.toLowerCase();
    var yellowInput = document.getElementById('yellowInput').value.toLowerCase();
    var greenPositionsInput = document.getElementById('greenPositionsInput').value;
    var greenLettersInput = document.getElementById('greenLettersInput').value.toLowerCase();

    var grayLetters = grayInput.replace(/\s/g, '').split(",");
    var yellowLetters = yellowInput.replace(/\s/g, '').split(",");
    var greenPositions = greenPositionsInput.replace(/\s/g, '').split(",").map(Number);
    var greenLettersArray = greenLettersInput.replace(/\s/g, '').split(",");

    var wordListUrl = 'https://raw.githubusercontent.com/charlesreid1/five-letter-words/master/sgb-words.txt';

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var wordListData = xhr.responseText;
          var wordList = wordListData.split("\n");

          var matchingWords = wordList.filter(function(word) {
            word = word.trim().toLowerCase();
            if (word.length !== 5) return false;

            // Check if the word has any gray letters
            for (var i = 0; i < grayLetters.length; i++) {
              if (word.includes(grayLetters[i])) {
                return false; // Word has gray letter, so it's not a match
              }
            }

            var hasYellowLetter = false;
            var hasGreenLetter = false;

            // Check if the word has at least one yellow letter and no green letters in specified positions
            for (var i = 0; i < yellowLetters.length; i++) {
              if (word.includes(yellowLetters[i])) {
                hasYellowLetter = true;
                if (greenLettersSelect.value === 'yes') {
                  for (var j = 0; j < greenPositions.length; j++) {
                    var position = greenPositions[j] - 1;
                    var letter = greenLettersArray[j];
                    if (word.charAt(position) !== letter) return false;
                  }
                }
                break;
              }
            }

            if (greenLettersSelect.value === 'no') {
              for (var i = 0; i < greenPositions.length; i++) {
                var position = greenPositions[i] - 1;
                var letter = greenLettersArray[i];
                if (word.charAt(position) === letter) {
                  hasGreenLetter = true;
                  break;
                }
              }
            }

            if (greenLettersSelect.value === 'no' && hasGreenLetter) {
              return false; // Word has a green letter in specified position, so it's not a match
            }

            return hasYellowLetter; // Word has no gray letters and at least one yellow letter
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
});
