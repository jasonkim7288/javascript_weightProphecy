import { convertDateToString, getScaledValue, getActualWeight, getEightyDate } from './libs/utilities.js';
import runCountAnimation from './resultAnimation.js';
import * as Constants from './libs/constants.js';
import { user } from './getUsers.js';

// when 'Predict weight' button is clicked, it is time to start predicting
//
// I MUST change user later
//
document.getElementById('predict-weight').addEventListener('click', (e) => {
    e.target.disabled = true;
    const predictionDateStr = document.getElementById('prediction-date').value;
    const predictionDate = new Date(predictionDateStr);
    const resultElement = document.getElementById('result-weight');
    const resultEmpty = document.getElementById('result-empty');
    const resultWrapper = document.getElementById('result-wrapper');
    const predictionDateError = document.getElementById('prediction-date-error');
    // check if weightHistory is empty
    if (user.weightHistory.length === 0) {
        predictionDateError.textContent = 'Please input the weight data';
    // check if the date is empty
    } else if (predictionDateStr) {
        const firstHistoryDate = new Date(user.weightHistory[0].date);
        const lastHistoryDate = new Date(user.weightHistory[user.weightHistory.length - 1].date);
        const eightyDate = getEightyDate (firstHistoryDate, user.age);

        // Check if the date is within the range
        if ((predictionDate.getTime() <= lastHistoryDate.getTime()) || (predictionDate.getTime() >= eightyDate.getTime())) {
            lastHistoryDate.setDate(lastHistoryDate.getDate() + 1);
            eightyDate.setDate(eightyDate.getDate() - 1);
            predictionDateError.textContent = `The date must be between ${convertDateToString(lastHistoryDate)} and ${convertDateToString(eightyDate)}`;
        } else {
            predictionDateError.classList.add('d-none');
            resultEmpty.classList.add('d-none');
            resultWrapper.classList.remove('d-none');

            const resultDate = document.getElementById('result-date');
            resultDate.textContent = `${predictionDate.getDate()} ${Constants.monthNames[predictionDate.getMonth()]} ${predictionDate.getFullYear()}`;

            predict(user, predictionDateStr)
            .then(res => {
                console.log('res:', res, getActualWeight(40, 100, res));
                resultElement.classList.remove('text-danger');
                runCountAnimation(resultElement, getActualWeight(40, 100, res), resultDate.textContent);
                e.target.removeAttribute('disabled');
            });
            return;
        }
    } else {
        predictionDateError.textContent = 'Invalide date';
    }

    resultEmpty.classList.remove('d-none');
    resultWrapper.classList.add('d-none')

    predictionDateError.classList.add('text-danger');
    predictionDateError.classList.remove('d-none');
    e.target.removeAttribute('disabled');
})

function predict({ age, weightHistory }, inputDate) {
    let clonedWeightHistory = JSON.parse(JSON.stringify(weightHistory));
    let yourEightyDate = new Date(clonedWeightHistory[0].date);

    yourEightyDate.setFullYear(yourEightyDate.getFullYear() + 80 - age);
    clonedWeightHistory.push({
        date: convertDateToString(yourEightyDate),
        weight: clonedWeightHistory[0].weight * 0.9
    })

    yourEightyDate.setDate(yourEightyDate.getDate() + 30);
    clonedWeightHistory.push({
        date: convertDateToString(yourEightyDate),
        weight: clonedWeightHistory[0].weight * 0.9
    })

    console.log(clonedWeightHistory);

    var x_vals = [];
    var y_vals = [];

    x_vals = clonedWeightHistory.map(weight => getScaledValue(
        (new Date(clonedWeightHistory[0].date)).getTime(),
        yourEightyDate.getTime(),
        (new Date(weight.date)).getTime()
    ));

    y_vals = clonedWeightHistory.map(weight => getScaledValue(40, 100, weight.weight));

    console.log(x_vals, y_vals);

    return getResult(x_vals, y_vals, getScaledValue(
        (new Date(clonedWeightHistory[0].date)).getTime(),
        yourEightyDate.getTime(),
        (new Date(inputDate)).getTime()));

    async function getResult(x_vals, y_vals, x_input) {
        var orderPoly = 5;
        var operands = [];

        initOperands();

        function initOperands() {
            operands = [];
            for (let i = 0; i <= orderPoly; i++) {
                operands.push(tf.variable(tf.scalar(Math.random())));
            }
        }

        var optimizer = tf.train.adam(0.2);

        var resultY = [];
        for (let j = 0; j < 20; j++) {
            await new Promise(r => setTimeout(r, 10));
            train(x_vals, y_vals);

            var output = [];
            for (let i = 0; i <= orderPoly; i++) {
                const coef = operands[i].dataSync()[0].toFixed(2);
                if (i === 1) {
                    output.push(`${coef}x`);
                } else if (i === 0) {
                    output.push(`${coef}`);
                } else {
                    output.push(`${coef}x<sup>${i}</sup>`);
                }
            }
            console.log('output:', output.reverse().join(" + "));
            // document.getElementById('output-txt').innerHTML = output.reverse().reduce((acc, element) => acc + `${element.includes('-') ? element : '+' + element}`);

            var resultX = [x_input];
            const ys = tf.tidy(() => predict(resultX));
            resultY = ys.dataSync();
            ys.dispose();
        }

        return resultY[0]

        function loss(pred, labels) {
            return pred.sub(labels).square().mean();
        }

        function train(input, target) {
            tf.tidy(() => {
                if (input.length > 0) {
                    const ys = tf.tensor1d(target);
                    optimizer.minimize(() => loss(predict(input), ys));
                }
            });
        }

        function predict(x) {
            const xs = tf.tensor1d(x);
            let ys = tf.variable(tf.zerosLike(xs));
            for (let i = 0; i <= orderPoly; i++) {
                const coef = operands[i];
                const pow_ts = tf.fill(xs.shape, i);
                const sum = tf.add(ys, operands[i].mul(xs.pow(pow_ts)));
                ys.dispose();
                ys = sum.clone();
            }
            return ys;
        }
    }
}

export default predict;