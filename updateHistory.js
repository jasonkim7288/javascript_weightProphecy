export default function updateHistory(user) {
    let table = document.querySelector('table');
    table.classList.add('table');
    table.innerHTML = '';

    user.weightHistory.forEach((weightInfo, index) => {
        let tableRow = document.createElement('tr');
        table.appendChild(tableRow);

        let date = document.createElement('td');
        date.textContent = weightInfo.date;
        tableRow.appendChild(date);

        let weight = document.createElement('td');
        weight.textContent = weightInfo.weight + ' kg'
        tableRow.appendChild(weight);

        let iconDiv = document.createElement('div');
        iconDiv.style.fontSize = '1.5em';
        iconDiv.classList.add ('text-danger');
        tableRow.appendChild(iconDiv);

        let icon = document.createElement('i');
        icon.classList.add('far', 'fa-trash-alt');
        iconDiv.appendChild(icon);

        icon.addEventListener('click', () => {
            user.weightHistory.splice(index, 1);
            updateHistory(user);
        })
    })
}