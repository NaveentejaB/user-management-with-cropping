const login_form = document.getElementById('login-form')
const user_id = document.getElementById('user_id')
const user_password = document.getElementById('user_password')

login_form.addEventListener('submit',async(e) => {
    e.preventDefault()
    try{
        const data = {
            user_id : user_id.value,
            user_password : user_password.value
        }
        const response = await fetch('http://localhost:3000/user/login',{
            method : 'POST',
            headers :{
                'Content-Type': 'application/json',
            },
            body : JSON.stringify(data)
        })
        const result = await response.json()
        console.log(result);
        if(result.error === true){
            window.location.replace('user_login.html')
        } else {
            window.location.replace('user_home.html')
            localStorage.setItem('access_token',result.accessToken)
        }
    }catch(err){
        console.error('Error processing data:', err);
        // Redirect to error.html or handle the error
        window.location.href = 'user_login.html';
    }

})