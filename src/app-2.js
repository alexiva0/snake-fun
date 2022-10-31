import {
  checkPositionValid,
  getDirection,
  getNewHeadPosition,
  getNewApplePosition,
  isAppleEaten,
} from '/src/utils.js';
import * as constants from './constants.js';

const app = () => {
  const initialState = {
    snakePosition: constants.INITIAL_SNAKE_POSITION,
    currentDirection: constants.INITIAL_DIRECTION,
    requestedDirection: null,
    applePosition: getNewApplePosition(constants.INITIAL_SNAKE_POSITION),
    gameState: 'IDLE',
  };

  const getCellIndexByPosition = ([x, y]) => y * constants.GRID_WIDTH + x;

  const renderField = (snakePosition) => {
    const field = document.querySelector('#game-field');
    const cells = field.querySelectorAll('.cell');

    cells.forEach((cell) => cell.classList.remove('snake'));
    snakePosition.forEach((snakeSegmentPosition) =>
      cells[getCellIndexByPosition(snakeSegmentPosition)].classList.add('snake')
    );
  };

  const watchedState = new Proxy(initialState, {
    set(state, prop, value) {
      state[prop] = value;

      switch (prop) {
        case 'snakePosition':
          console.log(`new position ${value}`);
          renderField(value);
          break;

        default:
          console.log(state);
      }

      return true;
    },
  });

  const move = () => {
    const {
      snakePosition,
      currentDirection,
      requestedDirection,
      // applePosition
    } = watchedState;
    const newDirection = getDirection(currentDirection, requestedDirection);

    if (newDirection !== currentDirection) {
      watchedState.currentDirection = newDirection;
      watchedState.requestedDirection = null;
    }

    const newHeadPosition = getNewHeadPosition(snakePosition[0], newDirection);

    // const appleEaten = isAppleEaten(newHeadPosition, applePosition)
    // let newBodyPosition;
    // if (appleEaten) {
    //   newBodyPosition = snakePosition
    // } else {
    //   newBodyPosition = snakePosition.slice(0, -1)
    // }
    const newBodyPosition = snakePosition.slice(0, -1);
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
      // state.applePosition = getNewApplePosition(snakePosition)
    } else {
      watchedState.gameState = 'GAME_OVER';
    }
  };

  document.addEventListener('keydown', (e) => {
    const keyCode = e.code;
    const isArrowKey = Object.keys(constants.ARROW_KEYS_MAP).includes(keyCode);

    if (keyCode === "Space") {
      if (watchedState.gameState === "IDLE") {
        watchedState.gameState = "PLAY";
        return;
      } else if (watchedState.gameState === "PLAY") {
        watchedState.gameState = "IDLE";
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
  setInterval(() => {
    if (watchedState.gameState === "PLAY") {
      move();
    }
  }, 500);
};

export default app;
