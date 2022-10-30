const ARROW_KEYS_MAP = {
  up: 'ArrowUp',
  right: 'ArrowRight',
  down: 'ArrowDown',
  left: 'ArrowLeft',
};

const ROWS_LENGTH = 5;
const COLLUMNS_LENGTH = 10;

const app = () => {
  const initialState = {
    snakePosition: [3, 7],
    currentDirection: 'up',
    newDirection: null,
  };

  const getCellIndexByPosition = ([x, y]) => y * ROWS_LENGTH + x;

  const renderField = (position) => {
    const field = document.querySelector('#game-field');
    const cells = field.querySelectorAll('.cell');

    cells.forEach((cell) => cell.classList.remove('snake'));
    cells[getCellIndexByPosition(position)].classList.add('snake');
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
          throw new Error(
            `Invalid field update attempt. Trying to update ${prop}`
          );
      }

      return true;
    },
  });

  document.addEventListener('keydown', (e) => {
    e.preventDefault();

    // set new direction based on the key code
  });

  renderField(watchedState.position);
};

export default app;
