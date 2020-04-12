/**
 * @file Домашка по FP ч. 2
 * 
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 * 
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 * 
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import * as R from "ramda";

const api = new Api();

const promisesPipeline = ({value, writeLog, handleSuccess}) => {
    const writeLogAndReturn = (value) => { writeLog(value); return value; };

    // convert to rounded number
    const convertToRoundNumber = R.pipe(
        () => Math.round(Number(value)),
        writeLogAndReturn,
    );

    // convert to decimal base
    const convertToDecimalBase = (value) => api.get('https://api.tech/numbers/base', {from: 2, to: 10, number: value});
    const getValueFromResult = R.prop('result');

    // some random math calculations
    const getNumberLength = R.pipe(
        (value) => value.toString().length,
        writeLogAndReturn,
    );

    const powOfTwo = R.pipe(
        (value) => Math.pow(value, 2),
        writeLogAndReturn,
    );

    const moduloThree = R.pipe(
        (value) => R.modulo(value, 3),
        writeLogAndReturn,
    );

    // get random animal
    const getRandomAnimal = (value) => api.get('https://animals.tech', {id: value});

    // converge might be useful here
    return R.pipe(
        convertToRoundNumber,
        convertToDecimalBase,
        R.andThen(getValueFromResult),
        R.andThen(writeLogAndReturn),
        R.andThen(getNumberLength),
        R.andThen(powOfTwo),
        R.andThen(moduloThree),
        R.andThen(getRandomAnimal),
        R.andThen(getValueFromResult),
        R.andThen(handleSuccess),
    );
};

const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    // input value check
    const decimal = /^[+-]?\d+(\.\d+)?$/;
    const biggerThanTwo = () => value.length > 2;
    const smallerThanTen = () => value.length < 10;
    const isPositiveNum = () => value.length > 0;

    const valueCheck = R.allPass([smallerThanTen, biggerThanTwo, isPositiveNum]);
    const numberCheck = () => R.test(decimal, value);

    const calculateTillTheEnd = R.ifElse(
        R.and(numberCheck, valueCheck),
        promisesPipeline({value, writeLog, handleSuccess}),
        () => {
            handleError('ValidationError');
        },
    );

    calculateTillTheEnd(value);
};

export default processSequence;
