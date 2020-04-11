/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */


const R = require('ramda');

const STAR = 'star';
const SQUARE = 'square';
const TRIANGLE = 'triangle';
const CIRCLE = 'circle';

const COLORS = ['red', 'green', 'blue', 'orange'];

const equalsColor = (color) => R.equals(color);
const getFigureColor = (fig) => R.prop(fig);
const getFigureEqualsColor = (color, fig) => R.compose(
    equalsColor(color),
    getFigureColor(fig),
);

const getFiguresSameColor = (figures, color) => {
    return (params) => {
        const getFigureCondition = (figure) => {
            return R.propEq(figure, color, params);
        };
        return R.all(getFigureCondition)(figures);
    }
};

const getFigureNotEqualsColor = (color, figure) => R.complement(getFigureEqualsColor(color, figure));

const getFiguresSameColorWithParams = (params, figures, color) => {
    const getFigureCondition = (figure) => { return R.propEq(figure, color, params); };
    return R.all(getFigureCondition)(figures);
};

const getSeveralFiguresSameColor = (figures) => {
    return (params) => {
        const getFiguresSameColorCurried = R.curry(getFiguresSameColorWithParams);
        return R.any(getFiguresSameColorCurried(params, figures))(COLORS);
    }
};

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (params) => {
    const getStarEqualsRed = getFigureEqualsColor('red', STAR);
    const getSquareEqualsGreen = getFigureEqualsColor('green', SQUARE);
    const getTriangleEqualsWhite = getFigureEqualsColor('white', TRIANGLE);
    const getCircleEqualsWhite = getFigureEqualsColor('white', CIRCLE);

    return R.allPass([getStarEqualsRed, getSquareEqualsGreen, getTriangleEqualsWhite, getCircleEqualsWhite])(params);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (params) => {
    return R.anyPass([
        getFiguresSameColor([STAR, SQUARE], 'green'),
        getFiguresSameColor([STAR, TRIANGLE], 'green'),
        getFiguresSameColor([STAR, CIRCLE], 'green'),
        getFiguresSameColor([SQUARE, TRIANGLE], 'green'),
        getFiguresSameColor([SQUARE, CIRCLE], 'green'),
        getFiguresSameColor([CIRCLE, TRIANGLE], 'green'),
    ])(params);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (params) => {
    // TODO: брать рандомные 1 или 2 фигуры, проходиться по возможным парам
    return false;
};

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = (params) => {
   return R.allPass([getFigureEqualsColor('blue', CIRCLE),
       getFigureEqualsColor('red', STAR),
       getFigureEqualsColor('orange', SQUARE)])(params);
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (params) => {
    return R.anyPass([getSeveralFiguresSameColor([STAR, CIRCLE, TRIANGLE]),
        getSeveralFiguresSameColor([STAR, CIRCLE, SQUARE]),
        getSeveralFiguresSameColor([STAR, TRIANGLE, SQUARE]),
        getSeveralFiguresSameColor([CIRCLE, TRIANGLE, SQUARE]),
        getSeveralFiguresSameColor([CIRCLE, TRIANGLE, SQUARE, STAR]),
    ])(params);
};

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = (params) => {
    return R.anyPass([
        R.allPass([getFiguresSameColor([STAR, TRIANGLE], 'green'),
            getFigureEqualsColor('red', CIRCLE), getFigureNotEqualsColor('green', SQUARE)]),
        R.allPass([getFiguresSameColor([STAR, TRIANGLE], 'green'),
            getFigureEqualsColor('red', SQUARE), getFigureNotEqualsColor('green', CIRCLE)]),
        R.allPass([getFiguresSameColor([SQUARE, TRIANGLE], 'green'),
            getFigureEqualsColor('red', CIRCLE), getFigureNotEqualsColor('green', STAR)]),
        R.allPass([getFiguresSameColor([SQUARE, TRIANGLE], 'green'),
            getFigureEqualsColor('red', STAR), getFigureNotEqualsColor('green', CIRCLE)]),
        R.allPass([getFiguresSameColor([CIRCLE, TRIANGLE], 'green'),
            getFigureEqualsColor('red', STAR), getFigureNotEqualsColor('green', SQUARE)]),
        R.allPass([getFiguresSameColor([CIRCLE, TRIANGLE], 'green'),
            getFigureEqualsColor('red', SQUARE), getFigureNotEqualsColor('green', STAR)]),
    ])(params)
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (params) => {
    return getFiguresSameColor([STAR, TRIANGLE, CIRCLE, SQUARE], 'orange')(params);
};

// 8. Не красная и не белая звезда.
export const validateFieldN8 = (params) => {
    return R.allPass([getFigureNotEqualsColor('red', STAR), getFigureNotEqualsColor('white', STAR)])(params);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = (params) => {
    return getFiguresSameColor([STAR, TRIANGLE, CIRCLE, SQUARE], 'green')(params);
};

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = (params) => {
    return R.allPass([getSeveralFiguresSameColor([SQUARE, TRIANGLE], COLORS)])(params);
};
