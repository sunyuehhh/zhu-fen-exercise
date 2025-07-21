// src/renderModule.js
function render() {
  app.innerHTML = "title3";
}

// src/main.js
render();
if (import.meta.hot) {
  import.meta.hot.accept(["./renderModule.js"], ([renderModule]) => {
    renderModule.render();
  });
}
