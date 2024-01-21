document.addEventListener('DOMContentLoaded', async() => {
    console.log("DOM fully loaded and parsed");
    try{
        const admin_token = localStorage.getItem('access_token')
        const response = await fetch('http://localhost:3000/admin/',{
            method : 'GET',
            headers :{
                'Authorization' : admin_token,
                'Content-Type': 'application/json',
            }
        })
        const result = await response.json()
        if(result.error){
            console.log(result.message);
            if(response.status === 403){
                window.location.replace('admin_login.html')
            }
        }else{
            var user_ids = result.user_ids
            console.log(user_ids);
            if( user_ids.length > 0){
                var user_ids_container = document.getElementById('only_user_ids')
                var user_id_div = document.getElementById('user_ol')
                user_ids.forEach((id,i)=>{
                    if(i > 0){
                        var clone_user_id_div = user_id_div.cloneNode(true)
                        var temp = clone_user_id_div.querySelector('#only_user_id')
                        temp.textContent = id
                        user_ids_container.append(clone_user_id_div) 
                    }
                })
                var temp = user_id_div.querySelector('#only_user_id')
                temp.textContent = user_ids[0]
                user_ids_container.style.display = 'flex'
            }
        }
    }catch(err){
        console.error('Error processing data:', err);
        if(response.status === 403){
            window.location.replace('admin_login.html')
        }
    }
})

const user_add = document.getElementById('user_add')
const user_id = document.getElementById('user_id')
const user_password = document.getElementById('user_password')

user_add.addEventListener('submit',async(e) => {
    e.preventDefault()
    try{
        const data = {
            user_id : user_id.value,
            user_password : user_password.value
        }
        const admin_token = localStorage.getItem('access_token')
        const response = await fetch('http://localhost:3000/admin/',{
            method : 'POST',
            headers :{
                'Authorization' : admin_token,
                'Content-Type': 'application/json',
            },
            body : JSON.stringify(data)
        })
        const result = await response.json()
        var alert = document.getElementById('md_alert')
        if(result.error === true){ 
            console.log('Error processing data:',result.message);
            alert.style.display = 'block'
            alert.classList.add('alert-danger')
            alert.textContent = 'failed to add user! : ' + result.message
            setTimeout(function() {
                alert.textContent=""
                alert.style.display = 'none'
                alert.classList.remove('alert-danger')
              }, 5000);
            if(response.status === 403){
                window.location.replace('admin_login.html')
            }
        } else {
            alert.style.display = 'block'
            alert.classList.add('alert-success')
            alert.textContent = 'User added successfully.'
            setTimeout(function() {
                alert.textContent=""
                alert.style.display = 'none'
                alert.classList.remove('alert-success')
              }, 5000);
            setTimeout(function(){
                location.reload()
            },6000)
        }
        user_id.value = ''
        user_password.value = ''
    }catch(err){
        console.error('Error processing data:', err);
        // Redirect to error.html or handle the error
        alert.style.display = 'block'
        alert.textContent = err
        alert.classList.add('alert-danger')
        setTimeout(function() {
            alert.textContent="failed to add user!"
            alert.style.display = 'none'
            alert.classList.remove('alert-danger')
          }, 5000);
        if(response.status === 403){
            window.location.replace('admin_login.html')
        }
    }

})

document.getElementById('view_btn').addEventListener('click',async()=>{
    window.location.replace('users_table.html')
})
