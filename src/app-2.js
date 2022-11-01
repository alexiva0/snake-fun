import {
  checkPositionValid,
  getDirection,
  getNewHeadPosition,
  getNewApplePosition,
  isAppleEaten,
} from '/src/utils.js';
import * as constants from './constants.js';

const app = () => {
  const getInitialState = () => {
    return {
      snakePosition: constants.INITIAL_SNAKE_POSITION,
      currentDirection: constants.INITIAL_DIRECTION,
      requestedDirection: null,
      applePosition: getNewApplePosition(constants.INITIAL_SNAKE_POSITION),
      gameState: 'INITIAL',
    };
  }

  const resetGame = (overrides) => {
    const newState = getInitialState()
    Object.keys(watchedState).forEach(
      (key) => watchedState[key] = overrides[key] || newState[key]
    );
  }

  const getCellIndexByPosition = ([x, y]) => y * constants.GRID_WIDTH + x;

  const renderField = (snakePosition) => {
    const field = document.querySelector('#game-field');
    const cells = field.querySelectorAll('.cell');

    cells.forEach((cell) => cell.classList.remove('snake'));
    snakePosition.forEach((snakeSegmentPosition) =>
      cells[getCellIndexByPosition(snakeSegmentPosition)].classList.add('snake')
    );
  };

  const renderApple = (applePosition) => {
    const field = document.querySelector('#game-field');
    const cells = field.querySelectorAll('.cell');

    cells.forEach((cell) => cell.classList.remove('apple'));
    cells[getCellIndexByPosition(applePosition)].classList.add('apple')
  };

  const renderPauseMenu = () => {
    const pauseMenu = document.querySelector('#pause-menu');
    pauseMenu.classList.remove('hidden');
    pauseMenu.classList.add('visible');
  }

  const renderGameOver = () => {
    const gameOver = document.querySelector('#game-over');
    gameOver.classList.remove('hidden');
    gameOver.classList.add('visible');
  }

  const renderGameWon = () => {

  }

  const hidePopups = () => {
    const popups = document.querySelectorAll('.popup');
    popups.forEach((popup) => {
      popup.classList.remove('visible')
      popup.classList.add('hidden');
    });
  }

  const renderGameState = (gameState) => {
    hidePopups();
    switch (gameState) {
      case "INITIAL":
        renderWelcomeMenu();
        break;
      case "PAUSED":
        renderPauseMenu();
        break;
      case "GAME_OVER":
        renderGameOver();
        break;
      case "GAME_WON":
        renderGameWon();
        break;
    }
  }

  const watchedState = new Proxy(getInitialState(), {
    set(state, prop, value) {
      state[prop] = value;

      switch (prop) {
        case 'snakePosition':
          console.log(`new position ${value}`);
          renderField(value);
          break;
        case 'applePosition':
          renderApple(value);
          break;
        case 'gameState':
          renderGameState(value);
          break;
        default:
      }

      return true;
    },
  });

  const move = () => {
    const {
      snakePosition,
      currentDirection,
      requestedDirection,
      applePosition
    } = watchedState;
    const newDirection = getDirection(currentDirection, requestedDirection);

    if (newDirection !== currentDirection) {
      watchedState.currentDirection = newDirection;
      watchedState.requestedDirection = null;
    }

    const newHeadPosition = getNewHeadPosition(snakePosition[0], newDirection);

    const appleEaten = isAppleEaten(newHeadPosition, applePosition)
    let newBodyPosition;
    if (appleEaten) {
      watchedState.applePosition = getNewApplePosition(snakePosition)
      newBodyPosition = snakePosition
    } else {
      newBodyPosition = snakePosition.slice(0, -1)
    }
    const newSnakePosition = [newHeadPosition, ...newBodyPosition];
    if (checkPositionValid(newSnakePosition)) {
      if (
        newSnakePosition.length ===
        constants.GRID_WIDTH * constants.GRID_HEIGHT
      ) {
        watchedState.gameState = 'GAME_WON';
        return;
      }
      watchedState.snakePosition = newSnakePosition;
    } else {
      watchedState.gameState = 'GAME_OVER';
    }
  };

  document.addEventListener('keydown', (e) => {
    const keyCode = e.code;
    const isArrowKey = Object.keys(constants.ARROW_KEYS_MAP).includes(keyCode);

    if (keyCode === "Space") {
      switch (watchedState.gameState) {
        case "INITIAL":
          watchedState.gameState = "PLAY";
          return;
        case "PAUSED":
          watchedState.gameState = "PLAY";
          return;
        case "PLAY":
          watchedState.gameState = "PAUSED";
          return;
        case "GAME_OVER":
          resetGame({gameState: "PLAY"});
          return;
      }
    }

    if (!isArrowKey) {
      return;
    }

    e.preventDefault();
    watchedState.requestedDirection = constants.ARROW_KEYS_MAP[keyCode];
  });

  renderField(watchedState.snakePosition);
  renderApple(watchedState.applePosition);
  setInterval(() => {
    if (watchedState.gameState === "PLAY") {
      move();
    }
  }, 500);
};

export default app;
