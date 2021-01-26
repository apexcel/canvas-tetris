'use strict';

const BLOCK_SIZE = 30;
const ROW = 25;
const COL = 11;

const SHAPES = [
    [],
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0],
    ],
    [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0],
    ],
    [
        [4, 4],
        [4, 4]
    ],
    [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0],
    ],
    [
        [6, 6, 0],
        [0, 6, 6],
        [0, 0, 0],
    ],
    [
        [0, 7, 0],
        [7, 7, 7],
        [0, 0, 0],
    ]
];

const KEY = {
    ESC: 'Escape',
    SPACE: 'Space',
    LEFT: 'ArrowLeft',
    UP: 'ArrowUp',
    RIGHT: 'ArrowRight',
    DOWN: 'ArrowDown',
    P: 'KeyP'
};

const COLORS = [
    `black`, 
    `#546e7a`, 
    `#ba68c8`, 
    `#9c786c`, 
    `#1565c0`, 
    `#00796b`, 
    `#ef9a9a`, 
    `#fb8c00`
];

const POINTS = {
    SINGLE: 100,
    DOUBLE: 300,
    TRIPLE: 500,
    TETRIS: 1200,
    SOFT_DROP: 1,
    HARD_DROP: 2,
};

const LEVEL = [
    950,
    800,
    750,
    700,
    650,
    600,
    500,
    400,
    300,
    200
];

const LINE_FOR_NEXT_LEVEL = 5;

const pipe = (...args) => value => args.reduce((result, fn) => fn(result), value);
const getRandomInt = value => Math.floor(Math.random() * value) + 1;
const getCenterPos = () => {
    const y = Math.floor(ROW / 2);
    const x = Math.floor(COL / 2);
    return [x, y];
};

[SHAPES, KEY, COLORS, POINTS, LEVEL].forEach(v => Object.freeze(v));

export {
    BLOCK_SIZE, ROW, COL, SHAPES, KEY, COLORS, POINTS, LINE_FOR_NEXT_LEVEL, LEVEL,
    pipe, getRandomInt, getCenterPos
};