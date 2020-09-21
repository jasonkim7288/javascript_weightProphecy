import { convertDateToString, getScaledValue, getActualWeight } from './libs/utilities.js';
import user from './input.js';
import runCountAnimation from './resultAnimation.js'

// when 'Predict weight' button is clicked, it is time to start predicting
document.getElementById('predict-weight').addEventListener('click', () => {
    const predictionDateStr = document.getElementById('prediction-date').value;
    const resultElement = document.querySelector('.display-4')
    if(predictionDateStr) {
        predict(user[1], "2030-01-01")
        .then(res => {
            console.log('res:', res, getActualWeight(40, 100, res));
            // document.querySelector('.display-4').textContent = `${getActualWeight(40, 100, res)} kg`
            resultElement.classList.remove('text-danger');
            runCountAnimation(resultElement, getActualWeight(40, 100, res));
        });
    } else {
        resultElement.textContent = 'Please input the date correctly';
        resultElement.classList.add('text-danger');
    }
    console.log('predictionDateStr:', )
})

function predict({ age, weightHistory }, inputDate) {
    let yourEightyDate = new Date(weightHistory[0].date);

    yourEightyDate.setFullYear(yourEightyDate.getFullYear() + 80 - age);
    weightHistory.push({
        date: convertDateToString(yourEightyDate),
        weight: weightHistory[0].weight * 0.9
    })

    yourEightyDate.setDate(yourEightyDate.getDate() + 30);
    weightHistory.push({
        date: convertDateToString(yourEightyDate),
        weight: weightHistory[0].weight * 0.9
    })

    console.log(weightHistory);

    var x_vals = [];
    var y_vals = [];

    x_vals = weightHistory.map(weight => getScaledValue(
        (new Date(weightHistory[0].date)).getTime(),
        yourEightyDate.getTime(),
        (new Date(weight.date)).getTime()
    ));

    y_vals = weightHistory.map(weight => getScaledValue(40, 100, weight.weight));

    console.log(x_vals, y_vals);

    return getResult(x_vals, y_vals, getScaledValue(
        (new Date(weightHistory[0].date)).getTime(),
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