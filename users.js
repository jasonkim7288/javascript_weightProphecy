
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
    getUsers();

    let form = document.getElementById('newUser');
   

    let addUser=()=>{
        let user = {
            name: form.name.value,
              age: form.age.value,
              weightHistory:[]
        }
        console.log(user);
        axios.post('http://localhost:3000/users', user)
        .then((user) => console.log(user))
        .catch((err) => console.err(err));
    }
    
    form.addEventListener('submit', addUser);
    
    let updateUser=()=>{
        axios.put('http://localhost:3000/users/8', user)
        .then((user) => console.log(user))
        .catch((err) => console.err(err));
    }
    // updateUser();
    
    export {getUsers};