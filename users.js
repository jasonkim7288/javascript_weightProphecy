
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
    
    let user = {
        name: document.getElementById('name').value,
          age: document.getElementById('age').value,
    }
    console.log(user);

    let addUser=()=>{
        axios.post('http://localhost:3000/users', user)
        .then((user) => console.log(user))
        .catch((err) => console.err(err));
    }
    
    // addUser();
    
    let updateUser=()=>{
        axios.put('http://localhost:3000/users/8', user)
        .then((user) => console.log(user))
        .catch((err) => console.err(err));
    }
    // updateUser();
    
    export {getUsers};