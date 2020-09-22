import weightChart from './weightChart.js';

export default function updateHistory(user) {
    let table = document.querySelector('table');
    table.innerHTML = '';

    user.weightHistory.sort(function (a, b) {
        if (a.date > b.date) return 1;
        if (a.date< b.date) return -1;
        return 0;
      });
      
    user.weightHistory.forEach((weightInfo, index) => {
        let tableRow = document.createElement('tr');
        table.appendChild(tableRow);

        let date = document.createElement('td');
        date.textContent = weightInfo.date;
        tableRow.appendChild(date);

        let weight = document.createElement('td');
        weight.textContent = weightInfo.weight + ' kg'
        tableRow.appendChild(weight);

        let iconDiv = document.createElement('td');
        iconDiv.classList.add ('text-danger');
        tableRow.appendChild(iconDiv);

        let icon = document.createElement('i');
        icon.classList.add('far', 'fa-trash-alt');
        iconDiv.appendChild(icon);

        icon.addEventListener('click', () => {
            if(confirm('Are you sure?')){
                user.weightHistory.splice(index, 1);
                axios.patch(`https://myrestapi01.herokuapp.com/users/${user.id}`, user)
                .then((response) =>{ 
                    user=response.data;
                    updateHistory(user);
                })
                .catch((err) => console.log(err));
            }
        })
    })
    weightChart(user.weightHistory);
}