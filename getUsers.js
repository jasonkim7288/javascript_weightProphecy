import updateHistory from './updateHistory.js';
import weightChart from './weightChart.js';


    let getUsers=() => {
        axios.get(' http://localhost:3000/users')
            .then(res => {
                let x = document.getElementById("namesList");
                res.data.forEach((data) =>  { 
                    let option = document.createElement("option");
                    option.text= data.name;
                    console.log(option);
                    x.add(option);
                });
               }
               )
            .catch(err => console.err(err))
    }
    
    let form = document.getElementById('newUser');
    let updateForm = document.getElementById('updateUser');

    let addUser=()=>{
        let user = {
            name: form.name.value,
              age: form.age.value,
              weightHistory:[]
        }
        axios.post('http://localhost:3000/users', user)
        .then((user) => console.log(user))
        .catch((err) => console.err(err));
    }
    
    form.addEventListener('submit', addUser);
    
    var user={};

    document.getElementById('ok').addEventListener('click', ()=>{
    let input = document.getElementById('namesList').value;
        console.log(input)
        axios.get('http://localhost:3000/users')
                .then((res => {
                    user = res.data.filter((user) => { return user.name === input});
                    console.log(user[0])
                    updateHistory(user[0]);
                    weightChart(user[0].weightHistory);
                })
                )
            .catch(err => console.err(err))
    });


    document.getElementById('input-weight').addEventListener('click', (e)=>{
        e.preventDefault();
        console.log(user);
        console.log(updateForm.weight.value);
        console.log(updateForm.inputDate.value);

            let weightLog = {
                weight: parseInt(updateForm.weight.value),
                date: updateForm.inputDate.value,
            }
            console.log(user[0].weightHistory.push(weightLog));
            axios.patch(`http://localhost:3000/users/${user[0].id}`, user[0])
            .then((user) =>{ 
                updateHistory(user.data);
                weightChart(user.data.weightHistory);
            })
            .catch((err) => console.err(err));
        });


    export {getUsers};

    
    