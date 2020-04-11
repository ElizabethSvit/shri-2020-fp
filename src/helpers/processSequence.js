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

/**
 * Я – пример, удали меня
 */
const wait = time => new Promise(resolve => {
    setTimeout(resolve, time);
});

const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    const decimal = /^[+-]?\d+(\.\d+)?$/;
    const biggerThanTwo = () => value.length > 2;
    const smallerThanTen = () => value.length < 10;
    const isPositiveNum = () => value.length > 0;

    const valueCheck = R.ifElse(
        R.allPass([smallerThanTen, biggerThanTwo, isPositiveNum]),
        () => {
            return writeLog(R.prop('value', {value: value}));
        },
        () => {
            return handleError('ValidationError');
        },
    );

    const numberCheck = R.ifElse(
        () => R.test(decimal, value),
        valueCheck,
        () => {
            return handleError('ValidationError');
        },
    );
    numberCheck();

    api.get('https://api.tech/numbers/base', {from: 2, to: 10, number: '01011010101'}).then(({result}) => {
        writeLog(result);
    });

    wait(2500).then(() => {
        writeLog('SecondLog');

        return wait(1500);
    }).then(() => {
        writeLog('ThirdLog');

        return wait(400);
    }).then(() => {
        handleSuccess('Done');
    });
};

export default processSequence;
