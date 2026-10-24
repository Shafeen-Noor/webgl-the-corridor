import { App } from './App/index.js';

// Boot when the DOM is ready. If WebGL cannot start (old browser, blocked
// hardware acceleration), show a readable message instead of a blank page.
try {
  const app = new App();
  app.start();
} catch (error) {
  console.error('Failed to start the WebGL scene:', error);
  document.getElementById('webgl-error')?.classList.add('visible');
}
