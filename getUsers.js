import updateHistory from './updateHistory.js';
import weightChart from './weightChart.js';

// get all users to show in users dropdown
    let getUsers=() => {
        axios.get(' http://localhost:3000/users')
            .then(res => {
                let x = document.getElementById("namesList");
                res.data.forEach((data) =>  {
                    let option = document.createElement("option");
                    option.text= data.name;
                    console.log(option);
                    x.add(option);
                    document.getElementById('page-2').style.visibility = "hidden";
                    document.getElementById('page-1').style.visibility = "visible";
                });
               }
               )
            .catch(err => console.err(err))
    }

    // get form id
    let form = document.getElementById('newUser');
    let updateForm = document.getElementById('updateUser');

    // add new user method
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

    // call addUser function upon form submit
    form.addEventListener('submit', addUser);

    var user={};

    // show weight history, weight chart for an existing user
    document.getElementById('ok').addEventListener('click', ()=>{
        document.getElementById('newUser').style.visibility = "hidden";
        document.getElementById('page-2').style.visibility = "visible";

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


    // add new weight to the history
    document.getElementById('input-weight').addEventListener('click', (e)=>{
        e.preventDefault();
        // console.log(user);
        // console.log(updateForm.weight.value);
        // console.log(updateForm.inputDate.value);
        if(updateForm.weight.value && updateForm.inputDate.value)
            {
                let weightLog = {
                    weight: parseInt(updateForm.weight.value),
                    date: updateForm.inputDate.value,
                }
                console.log(user[0].weightHistory.push(weightLog));

            }
            else
                {
                    document.getElementById('message').textContent="Enter valid values";

                }
            axios.patch(`http://localhost:3000/users/${user[0].id}`, user[0])
                .then((user) =>{
                    updateHistory(user.data);
                    weightChart(user.data.weightHistory);
                })
                .catch((err) => console.err(err));

        });


    export {getUsers, user};


