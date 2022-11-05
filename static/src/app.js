import {
  checkPositionValid,
  getDirection,
  getNewHeadPosition,
  getNewApplePosition,
  isAppleEaten,
} from './utils.js';
import * as constants from './constants.js';
import { getHighScore, setHighScore } from './api.js'

const app = () => {
  const getInitialState = () => {
    return {
      snakePosition: constants.INITIAL_SNAKE_POSITION,
      currentDirection: constants.INITIAL_DIRECTION,
      requestedDirections: [],
      applePosition: getNewApplePosition(constants.INITIAL_SNAKE_POSITION),
      gameState: 'INITIAL',
      score: 0,
      highScore: null,
    };
  }

  getHighScore().then((highScore) => watchedState.highScore = highScore);

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

  const renderHighScore = (highScore) => {
    const span = document.querySelector("#high-score");
    span.innerHTML = highScore;
  }

  const renderScore = (score) => {
    const span = document.querySelector("#score");
    span.innerHTML = score;
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
        case 'highScore':
          renderHighScore(value);
          break;
        case 'score':
          renderScore(value);
          break;
        default:
      }

      return true;
    },
  });

  const updateHighScore = () => {
    if (watchedState.score > watchedState.highScore) {
      setHighScore(watchedState.score)
        .then((highScore) => watchedState.highScore = highScore)
    }
  }

  const move = () => {
    const {
      snakePosition,
      currentDirection,
      requestedDirections,
      applePosition
    } = watchedState;
    const newDirection = requestedDirections[0] || currentDirection;
    if (newDirection !== currentDirection) {
      watchedState.currentDirection = newDirection;
      watchedState.requestedDirections.shift();
    }

    const newHeadPosition = getNewHeadPosition(snakePosition[0], newDirection);

    const appleEaten = isAppleEaten(newHeadPosition, applePosition);
    const newBodyPosition = appleEaten ? snakePosition : snakePosition.slice(0, -1);
    const newSnakePosition = [newHeadPosition, ...newBodyPosition];
    if (checkPositionValid(newSnakePosition)) {
      watchedState.snakePosition = newSnakePosition;
      if (
        newSnakePosition.length ===
        constants.GRID_WIDTH * constants.GRID_HEIGHT
      ) {
        updateHighScore();
        watchedState.gameState = 'GAME_WON';
        return;
      }
    } else {
      updateHighScore();
      watchedState.gameState = 'GAME_OVER';
    }
    if (appleEaten) {
      watchedState.applePosition = getNewApplePosition(newSnakePosition);
      watchedState.score += 1;
    }
  };

  document.addEventListener('keydown', (e) => {
    const keyCode = e.code;
    const isArrowKey = Object.keys(constants.ARROW_KEYS_MAP).includes(keyCode);

    if (isArrowKey) {
      const requestedDirection = constants.ARROW_KEYS_MAP[keyCode]
      const directionList = [
        watchedState.currentDirection,
        ...watchedState.requestedDirections
      ]
      const newDirection = getDirection(directionList.at(-1), requestedDirection);
      if (directionList.at(-1) !== newDirection) {
        e.preventDefault();
        watchedState.requestedDirections.push(constants.ARROW_KEYS_MAP[keyCode]);
      }
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
        case "GAME_WON":
          resetGame({ gameState: "PLAY", highScore: watchedState.highScore });
          return;
      }
    }
  });

  renderGameState(watchedState.gameState);
  renderField(watchedState.snakePosition);
  renderApple(watchedState.applePosition);
  renderScore(watchedState.score)
  setInterval(() => {
    if (watchedState.gameState === "PLAY") {
      move();
    }
  }, constants.INTERVAL_LENGTH);
};

export default app;
