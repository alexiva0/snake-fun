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

    cells.forEach((cell) => {
      cell.classList.remove('snake');
      cell.classList.remove('snake-head');
    });

    snakePosition.forEach((snakeSegmentPosition, index) => {
      if (index === 0) {
        cells[getCellIndexByPosition(snakeSegmentPosition)].classList.add(
          'snake-head'
        );
      }

      cells[getCellIndexByPosition(snakeSegmentPosition)].classList.add(
        'snake'
      );
    });
  };

  const renderApple = (applePosition) => {
    const field = document.querySelector('#game-field');
    const cells = field.querySelectorAll('.cell');

    cells.forEach((cell) => cell.classList.remove('apple'));
    cells[getCellIndexByPosition(applePosition)].classList.add('apple')
  };

  const renderPopup = (querySelector) => {
    const welcomeMenu = document.querySelector(querySelector);
    welcomeMenu.classList.remove('hidden');
    welcomeMenu.classList.add('visible');
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
        renderPopup("#welcome");
        break;
      case "PAUSED":
        renderPopup("#pause");
        break;
      case "GAME_OVER":
        renderPopup("#game-over");
        break;
      case "GAME_WON":
        renderPopup("#game-won");
        break;
    }
  }

  const watchedState = new Proxy(getInitialState(), {
    set(state, prop, value) {
      state[prop] = value;
      switch (prop) {
        case 'snakePosition':
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

    const appleEaten = isAppleEaten(newHeadPosition, applePosition);
    if (appleEaten) console.log('omnom')
    const newBodyPosition = appleEaten ? snakePosition : snakePosition.slice(0, -1);
    const newSnakePosition = [newHeadPosition, ...newBodyPosition];
    if (checkPositionValid(newSnakePosition)) {
      watchedState.snakePosition = newSnakePosition;
      if (
        newSnakePosition.length ===
        constants.GRID_WIDTH * constants.GRID_HEIGHT
      ) {
        watchedState.gameState = 'GAME_WON';
        return;
      }
    } else {
      watchedState.gameState = 'GAME_OVER';
    }
    if (appleEaten) {
      watchedState.applePosition = getNewApplePosition(newSnakePosition);
    }
  };

  document.addEventListener('keydown', (e) => {
    const keyCode = e.code;
    const isArrowKey = Object.keys(constants.ARROW_KEYS_MAP).includes(keyCode);

    if (isArrowKey) {
      e.preventDefault();
      watchedState.requestedDirection = constants.ARROW_KEYS_MAP[keyCode];
      return;
    }

    if (keyCode === "Space") {
      e.preventDefault();
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
          resetGame({ gameState: "PLAY" });
          return;
      }
    }
  });

  renderGameState(watchedState.gameState);
  renderField(watchedState.snakePosition);
  renderApple(watchedState.applePosition);
  setInterval(() => {
    if (watchedState.gameState === "PLAY") {
      move();
    }
  }, 300);
};

export default app;
