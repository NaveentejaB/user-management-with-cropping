var input_img = document.getElementById('profile_img')
var previw_img = document.getElementById('image_preview')
var form_submit = document.getElementById('user_form')
var view_user = document.getElementById('view_btn_details')
cropper = ''

//adding preview image and enabling cropping option
input_img.addEventListener('change',(e)=>{
    if(e.target.files.length){
        const reader = new FileReader()
        reader.onload = (e) => {
            var img = document.createElement('img')
            img.src = e.target.result
            img.alt = "preview image"
            previw_img.innerHTML = ''
            previw_img.appendChild(img)
            cropper = new Cropper(img)
        }
        reader.readAsDataURL(e.target.files[0]);
    }
})

// to upload the image to server and changing the visibility of the view button on success
form_submit.addEventListener('submit', async(e) => {
    e.preventDefault();
    var user_name = document.getElementById('user_name')
    try{
        const usertoken = localStorage.getItem('access_token')
        let url = cropper.getCroppedCanvas().toDataURL()
        const data = {
            profile_image : url,
            user_name : user_name.value
        }
        const response = await fetch('http://localhost:3000/user/',{
            method : 'POST',
            headers :{
                Authorization : usertoken,
                'Content-Type': 'application/json',
            },
            body : JSON.stringify(data)
        })
        const result = await response.json()
        if(result.error){
            console.error('Error processing data:', result.message);
            if(response.status === 403){
                window.location.replace('user_login.html')
            }
        }else{
            previw_img.innerHTML = ''
            cropper = ''
            view_user.style.visibility = 'visible'
        }
    }catch(err){
        console.error('Error processing data:', err);
        if(response.status === 403){
            window.location.replace('user_login.html')
        }
    }
})

view_user.addEventListener('click',async()=>{
    try{
        const usertoken = localStorage.getItem('access_token')
        const response = await fetch('http://localhost:3000/user/',{
            method : 'GET',
            headers :{
                Authorization : usertoken,
            }
        })
        const result = await response.json()
        if(result.error){
            console.error('Error processing data:', result.message);
            if(response.status === 403){
                window.location.replace('user_login.html')
            }
        }else{
            const user = result.user
            document.getElementById('tab_user_name_txt').textContent = user.user_name
            var img = document.createElement('img')
            img.src ="data:image/webp;base64,"+user.user_image.base64img
            img.alt = "user image"
            var img_container = document.getElementById('img_in_box')
            img_container.innerHTML = ''
            img_container.appendChild(img)
            var txt = document.getElementById('admin_msg')
            if(!user.update_status){
                txt.textContent = "Not Accepted by Admin"
                txt.style.color = 'red'
            }else{
                txt.textContent = "Accepted by Admin"
                txt.style.color = 'green'
            }
        }
    }catch(err){
        console.error('Error processing data:', err);
        if(response.status === 403){
            window.location.replace('user_login.html')
        }
    }
})
