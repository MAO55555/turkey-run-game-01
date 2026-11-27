// Input controller handling keyboard, mouse, and coordinate transformation for 1280x720 canvas.

export function createInput(canvas, view) {
  const keys = new Map();
  const justPressed = new Set();
  let mouseX = 0;
  let mouseY = 0;
  let mouseClicked = false;
  let mouseJustClicked = false;

  function updateMouseCoords(evt) {
    const rect = canvas.getBoundingClientRect();
    const clickPxX = (evt.clientX - rect.left) * (canvas.width / rect.width);
    const clickPxY = (evt.clientY - rect.top) * (canvas.height / rect.height);
    const vScale = view && view.scale ? view.scale : 1;
    const vX = view && view.x !== undefined ? view.x : 0;
    const vY = view && view.y !== undefined ? view.y : 0;
    mouseX = (clickPxX - vX) / vScale;
    mouseY = (clickPxY - vY) / vScale;
  }

  function onKeyDown(evt) {
    // Prevent scrolling with arrows/space
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'KeyA', 'KeyD'].includes(evt.code)) {
      evt.preventDefault();
    }
    if (!keys.get(evt.code)) {
      justPressed.add(evt.code);
    }
    keys.set(evt.code, true);
  }

  function onKeyUp(evt) {
    keys.set(evt.code, false);
  }

  function onMouseMove(evt) {
    updateMouseCoords(evt);
  }

  function onMouseDown(evt) {
    updateMouseCoords(evt);
    mouseClicked = true;
    mouseJustClicked = true;
  }

  function onMouseUp() {
    mouseClicked = false;
  }

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);

  return {
    isDown(code) {
      return !!keys.get(code);
    },
    wasJustPressed(code) {
      return justPressed.has(code);
    },

    // Intent helpers
    isLeft() {
      return this.isDown('ArrowLeft') || this.isDown('KeyA');
    },
    isRight() {
      return this.isDown('ArrowRight') || this.isDown('KeyD');
    },
    isJump() {
      return this.isDown('Space') || this.isDown('ArrowUp') || this.isDown('KeyW');
    },
    wasJumpJustPressed() {
      return this.wasJustPressed('Space') || this.wasJustPressed('ArrowUp') || this.wasJustPressed('KeyW');
    },
    isSlide() {
      return this.isDown('ArrowDown') || this.isDown('KeyS');
    },
    wasSlideJustPressed() {
      return this.wasJustPressed('ArrowDown') || this.wasJustPressed('KeyS');
    },
    isHide() {
      return this.isDown('KeyE') || this.isDown('ArrowDown') || this.isDown('KeyS');
    },
    wasHideJustPressed() {
      return this.wasJustPressed('KeyE');
    },
    wasDecoyJustPressed() {
      return this.wasJustPressed('KeyF') || mouseJustClicked;
    },
    wasPauseJustPressed() {
      return this.wasJustPressed('KeyP') || this.wasJustPressed('Escape');
    },
    wasMuteJustPressed() {
      return this.wasJustPressed('KeyM');
    },
    wasRestartJustPressed() {
      return this.wasJustPressed('KeyR') || this.wasJustPressed('Space') || this.wasJustPressed('Enter');
    },

    getMouse() {
      return { x: mouseX, y: mouseY, isDown: mouseClicked, justClicked: mouseJustClicked };
    },

    // Clear frame-specific triggers at end of tick
    postUpdate() {
      justPressed.clear();
      mouseJustClicked = false;
    },

    destroy() {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    },
  };
}
