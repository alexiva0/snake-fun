const GRID_WIDTH = 5
const GRID_HEIGHT = 10
const INITIAL_DIRECTION = "up"
// const INITIAL_SNAKE_POSITION = [[3, 5], [3, 6], [3, 7]];
const INITIAL_SNAKE_POSITION = [];
for (let y = 1; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH - 1; x++) {
        INITIAL_SNAKE_POSITION.push([x, y])
    }
}

const ARROW_KEYS_MAP = {
    ArrowUp: 'up',
    ArrowRight: 'right',
    ArrowDown: 'down',
    ArrowLeft: 'left',
};

export {
    GRID_WIDTH,
    GRID_HEIGHT,
    INITIAL_DIRECTION,
    INITIAL_SNAKE_POSITION,
    ARROW_KEYS_MAP,
}
