import constants from '/src/constants.js';

const directionMapping = {
    up: 0,
    right: 1,
    down: 2,
    left: 3
}

const getNewHeadPosition = (headPosition, direction) => {
    switch (direction) {
        case "up":
            return [headPosition[0], headPosition[1] - 1];
        case "right":
            return [headPosition[0] + 1, headPosition[1]];
        case "down":
            return [headPosition[0], headPosition[1] + 1];
        case "left":
            return [headPosition[0] - 1, headPosition[1]];
    }
}

const getDirection = (currentDirection, newDirection) => {
    const currentDirectionIndex = directionMapping[currentDirection];
    const newDirectionIndex = directionMapping[newDirection];
    if ((currentDirectionIndex + newDirectionIndex) % 2 === 0) {
        return currentDirection;
    }
    return newDirection;
}

const positionEqual = (a, b) => {
    return a[0] === b[0] && a[1] === b[1]
}

const checkPositionValid = (snakePosition) => {
    const headPosition = snakePosition[0];
    const isHeadIntersectsWithBody = snakePosition.slice(1)
        .some((bodyPosition) => positionEqual(bodyPosition, headPosition))
    if (isHeadIntersectsWithBody) {
        return false;
    }
    // head escapes horizontal span of grid
    if ((headPosition[0] < 0 || headPosition[0] > constants.GRID_WIDTH)) {
        return false;
    }
    // head escapes vertical span of grid
    if ((headPosition[1] < 0 || headPosition[1] > constants.GRID_HEIGHT)) {
        return false;
    }
    return true;
}

const isAppleEaten = (newHeadPosition, applePosition) =>
    positionEqual(newHeadPosition, applePosition)

const getNewApplePosition = (snakePosition) => {
    while (true) {
        const newPositionIndex = Math.floor(
            Math.random() * constants.GRID_WIDTH * constants.GRID_HEIGHT
        )
        const newApplePosition = [
            newPositionIndex % constants.GRID_WIDTH,
            Math.floor(newPositionIndex / constants.GRID_WIDTH)
        ]
        const isAppleIntersectsWithSnake = snakePosition
            .some((bodyPosition) => positionEqual(bodyPosition, newApplePosition))
        if (!isAppleIntersectsWithSnake) {
            return newApplePosition;
        }
    }
}

export {
    checkPositionValid,
    getDirection,
    getNewHeadPosition,
    getNewApplePosition,
    isAppleEaten,
}
