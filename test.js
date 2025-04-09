const { GlobalKeyboardListener } = require("node-global-key-listener");

const gkl = new GlobalKeyboardListener();

gkl.addListener(e => {
  if (e.state === "DOWN") {
    console.log(`Pressed: ${e.name} | Ctrl: ${e.ctrlKey}, Shift: ${e.shiftKey}, Alt: ${e.altKey}`);
  }
});
