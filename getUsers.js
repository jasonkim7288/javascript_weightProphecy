import updateHistory from './updateHistory.js';
import showAvatar from './showAvatar.js';
import {sortWeightHistory, sortNames} from './sortData.js';


let apiUrl = 'https://myrestapi01.herokuapp.com/users';
// get form id
let form = document.getElementById('newUser');
let updateForm = document.getElementById('updateUser');
let message = document.getElementById('message');
let page1 = document.getElementById('page-1');
let page2 = document.getElementById('page-2');
let utterance = new SpeechSynthesisUtterance();
utterance.rate = 0.7;

// get all users to show in users dropdown
let getUsers = () => {
    axios.get(apiUrl)
        .then(res => {
            let x = document.getElementById("namesList");
            sortNames(res.data);
            res.data.forEach((data) => {
                let option = document.createElement("option");
                option.text = data.name;
                option.className = "dropdown-item";
                x.add(option);
            });
            page2.classList.add('d-none');
            page1.classList.remove('d-none');
        })
        .catch(err => console.error(err))
}

// add new user method
let addUser = (event) => {
    event.preventDefault();
    let userInput = {
        name: form.name.value,
        age: form.age.value,
        weightHistory: []
    }
    axios.post(apiUrl, userInput)
        .then((res) => {
            user = JSON.parse(JSON.stringify(res.data));
            page1.classList.add('d-none');
            page2.classList.remove('d-none');
            showAvatar();
            updateHistory(user);
        })
        .catch((err) => console.error(err));
}

// call addUser function upon form submit
form.addEventListener('submit', addUser);

var user = {};

// show weight history, weight chart for an existing user
document.getElementById('ok').addEventListener('click', () => {
    // document.getElementById('newUser').style.visibility = "hidden";
    page1.classList.add('d-none');
    page2.classList.remove('d-none');

    let input = document.getElementById('namesList').value;
    axios.get(apiUrl)
        .then(res => {
            console.log(res)
            let found = res.data.filter((user) => {
                return user.name === input
            });
            user = found[0];
            console.log(user);
            showAvatar();
            updateHistory(user);
        })
        .catch(err => console.error(err))
});

// add new weight to the history
document.getElementById('input-weight').addEventListener('click', (e) => {
    e.preventDefault();
    if (updateForm.weight.value && updateForm.inputDate.value) {
        let weightLog = {
            weight: parseInt(updateForm.weight.value),
            date: updateForm.inputDate.value,
        }

        if (user.weightHistory.find(({ date }) => date === weightLog.date)) {
            
            utterance.text = 'Entry is already created for date ' + weightLog.date;
            speechSynthesis.speak(utterance);
            message.style.color= 'red';
            message.textContent = 'Entry is already created for date ' + weightLog.date;

        } else {
            user.weightHistory.push(weightLog);
            sortWeightHistory(user);
            message.style.color= 'green';
            message.textContent = "Weight Logged Successfully";
        }
            updateForm.reset();

    } else {
        message.style.color= 'red';
        message.textContent = "Enter valid values";
    }
    axios.patch(`https://myrestapi01.herokuapp.com/users/${user.id}`, user)
        .then((user) => {
            updateHistory(user.data);
        })
        .catch((err) => console.error(err));
        setTimeout(() =>{
            message.innerHTML = '';
        }, 7000);
});


export {
    getUsers,
    user
};