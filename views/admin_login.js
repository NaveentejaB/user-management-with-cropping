const login_form = document.getElementById('login-form')
const user_id = document.getElementById('user_id')
const user_password = document.getElementById('user_password')

login_form.addEventListener('submit',async(e) => {
    e.preventDefault()
    try{
        const data = {
            admin_id : user_id.value,
            admin_password : user_password.value
        }
        const response = await fetch('http://localhost:3000/admin/login',{
            method : 'POST',
            headers :{
                'Content-Type': 'application/json',
            },
            body : JSON.stringify(data)
        })
        const result = await response.json()
        console.log(result);
        if(result.error === true){
            window.location.href = 'admin_Login.html'
        } else {
            window.location.href = 'admin_home.html'
            localStorage.setItem('access_token',result.accessToken)
            console.log(result.accessToken);
            const token = localStorage.getItem('access_token')
            console.log(token);
        }
    }catch(err){
        console.error('Error processing data:', err);
        // Redirect to error.html or handle the error
        window.location.href = 'admin_Login.html';
    }

})