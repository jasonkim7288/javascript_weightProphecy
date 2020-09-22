import updateHistory from './updateHistory.js';
import showAvatar from './showAvatar.js';

let apiUrl='https://myrestapi01.herokuapp.com/users'
// get all users to show in users dropdown
    let getUsers=() => {
        axios.get(apiUrl)
            .then(res => {
                let x = document.getElementById("namesList");
                res.data.forEach((data) =>  {
                    let option = document.createElement("option");
                    option.text= data.name;
                    option.className="dropdown-item";
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
        axios.post(apiUrl, user)
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
        axios.get(apiUrl)
                .then((res => {
                    console.log(res)
                    let found = res.data.filter((user) => { return user.name === input});
                    user= found[0];
                    console.log(user);
                    showAvatar();
                    updateHistory(user);
                })
                )
            .catch(err => console.err(err))
    });


    // add new weight to the history
    document.getElementById('input-weight').addEventListener('click', (e)=>{
        e.preventDefault();
        if(updateForm.weight.value && updateForm.inputDate.value)
            {
                let weightLog = {
                    weight: parseInt(updateForm.weight.value),
                    date: updateForm.inputDate.value,
                }
                user.weightHistory.push(weightLog)
            }
            else
                {
                    document.getElementById('message').textContent="Enter valid values";

                }
            axios.patch(`https://myrestapi01.herokuapp.com/users/${user.id}`, user)
                .then((user) =>{
                    updateHistory(user.data);
                })
                .catch((err) => console.err(err));

        });


    export {getUsers, user};


