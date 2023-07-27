(function() {
    var container = document.createElement('div');
    container.id = 'wordleSolverContainer';
    container.style.display = 'none';
  
    var button = document.createElement('button');
    button.textContent = 'Solve Wordle';
    button.id = 'wordleSolverButton';
  
    container.appendChild(button);
    document.body.appendChild(container);
  
    button.addEventListener('click', function() {
      window.postMessage({ type: 'OPEN_POPUP' }, '*');
    });
  
    window.addEventListener('message', function(event) {
      if (event.data.type === 'CLOSE_POPUP') {
        container.style.display = 'none';
      }
    });
  
    window.addEventListener('keydown', function(event) {
      if (event.key === 'w' && event.ctrlKey) {
        container.style.display = 'block';
      }
    });
  })();
  