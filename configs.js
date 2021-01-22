'use strict';

const BLOCK_SIZE = 30;
const ROW = 15;
const COL = 12;

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
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    P: 80
};

const COLORS = [
    `black`, `#37474f`, `#303f9f`, `#c2185b`, `#0288d1`, `#00796b`, `#ffa000`, `#5d4037`
];

const POINTS = {
    SINGLE: 100,
    DOUBLE: 300,
    TRIPLE: 500,
    TETRIS: 1200,
    SOFT_DROP: 1,
    HARD_DROP: 2,
};

const pipe = (...args) => value => args.reduce((result, fn) => fn(result), value);
const getRandomInt = value => Math.floor(Math.random() * value) + 1;
const getCenterPos = () => {
    const y = Math.floor(ROW / 2);
    const x = Math.floor(COL / 2);
    return [x, y];
};

[SHAPES, KEY, COLORS, POINTS].forEach(v => Object.freeze(v));

export {
    BLOCK_SIZE, ROW, COL, SHAPES, KEY, COLORS, POINTS,
    pipe, getRandomInt, getCenterPos
};