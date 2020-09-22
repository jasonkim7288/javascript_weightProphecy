export default async function weightChart(weightHistory){
    let data = await getData(weightHistory);
    const ctx = document.getElementById('chart').getContext('2d');
    if(data.xlabels.length > 0){
    const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: data.xlabels,
        datasets: [{
            label: 'Weight Chart',
            data: data.yweight,
            fill: false,
            backgroundColor: 
                'rgba(54, 162, 235, 0.2)'
            ,
            borderColor: 
                'rgba(255, 99, 132, 1)'
            ,
            borderWidth: 1
        }]
    },
    options: {
    scales: {
        yAxes: [{
            ticks: {
                // Include a units in the ticks
                callback: function(value, index, values) {
                    return  value + 'kg';
                }
            }
        }]
    }
}
    });
    }
}

function getData(weightHistory){
let xlabels=[];
let yweight=[];
weightHistory.forEach((record) => {
    xlabels.push(record.date);
    yweight.push(record.weight);
})
// console.log(xlabels, yweight);
return {xlabels, yweight};
}