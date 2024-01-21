

//handle back to admin home
document.getElementById('back_btn').addEventListener('click',()=>{
    window.location.replace('admin_home.html')
})


const modfiy_user = async(user_id,type) => {
    try{ 
        const admin_token = localStorage.getItem('access_token')
        const response = await fetch("http://localhost:3000/admin/"+type,{
            method : 'POST',
            headers :{
                Authorization : admin_token,
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({user_id : user_id})
        })
        const result = await response.json()
        if(result.error){
            console.error('Error processing operation:', result.message);
            if(response.status === 403){
                window.location.replace('admin_login.html')
            }
        }else{
            console.log(result.message);
            location.reload()
        }
    }catch(err){
        console.error('Error processing data:', err);
        if(response.status === 403){
            window.location.replace('admin_login.html')
        }
    }
}


const addButtonFunctionalities = async() => {
    try{
        const done_btns_bg = document.querySelectorAll('.done_bg')
        done_btns_bg.forEach((button) => {
            button.addEventListener('click',(e)=>{
                const row = e.target.closest('tr')
                const user_id = row.querySelector('#user_id').textContent
                modfiy_user(user_id,"approve")
            })
        })
        const deny_btns_bg = document.querySelectorAll('.deny_bg')
        deny_btns_bg.forEach((button)=>{
            button.addEventListener('click',(e)=>{
                const row = e.target.closest('tr')
                const user_id = row.querySelector('#user_id').textContent
                modfiy_user(user_id,"deny")
            })
        })
        const del_btns_bg = document.querySelectorAll('.del_bg')
        del_btns_bg.forEach((button)=>{
            button.addEventListener('click',(e)=>{
                const row = e.target.closest('tr')
                const user_id = row.querySelector('#user_id').textContent
                modfiy_user(user_id,"delete")
            })
        })
        if(window.innerWidth <= 576){
            const done_btns_sm = document.querySelectorAll('.done_sm')
            done_btns_sm.forEach((button) => {
                button.addEventListener('click',(e)=>{
                    const row = e.target.closest('#some_id_shit')
                    const user_id = row.querySelector('#sm_user_id').textContent
                    modfiy_user(user_id,"approve")
                })
            })
            const deny_btns_sm = document.querySelectorAll('.deny_sm')
            deny_btns_sm.forEach((button)=>{
                button.addEventListener('click',(e)=>{
                    const row = e.target.closest('#some_id_shit')
                    const user_id = row.querySelector('#sm_user_id').textContent
                    modfiy_user(user_id,"deny")
                })
            })
            const del_btns_sm = document.querySelectorAll('.del_sm')
            del_btns_sm.forEach((button)=>{
                button.addEventListener('click',(e)=>{
                    const row = e.target.closest('#some_id_shit')
                    const user_id = row.querySelector('#sm_user_id').textContent
                    modfiy_user(user_id,"delete")
                })
            })
        }
    }catch(err){
        console.error('Error processing data:', err);
    }
}


//handle rendering the table content
const render_table = async() => {
    try{
        const admin_token = localStorage.getItem('access_token')
        const response = await fetch('http://localhost:3000/admin/users',{
            method : 'GET',
            headers :{
                Authorization : admin_token,
            }
        })
        const result = await response.json()
        if(result.error){
            console.log('Error processing data :',result.message);
            if(response.status === 403){
                window.location.replace('admin_login.html')
            }
        }
        //large
        var row_container = document.getElementById('table_body')
        var each_row = document.getElementById('each_row')
        //small
        var sm_row_container = document.getElementById('small_scrn_container')
        var sm_row = sm_row_container.querySelector('.ss_main_div')
        sm_row.style.display = 'flex'
        const users = result.users
        users.forEach((user)=>{
            var clone_each_row = each_row.cloneNode(true)
            each_row.style.display = 'table-row'
            clone_each_row.querySelector('#user_id').textContent = user.user_id
            clone_each_row.querySelector('#user_name').textContent = user.user_name
            var img = document.createElement('img')
            img.src ="data:image/webp;base64,"+user.user_image.base64img
            img.alt = "user image"
            clone_each_row.querySelector('#profile_image').innerHTML = ''
            clone_each_row.querySelector('#profile_image').appendChild(img)
            if(user.update_req === false){
                clone_each_row.querySelector("#one_opt").style.display = 'flex'
                clone_each_row.querySelector("#two_opts").style.display = 'none'
            }else{
                clone_each_row.querySelector("#two_opts").style.display = 'flex'
                clone_each_row.querySelector("#one_opt").style.display = 'none'
            }
            clone_each_row.style.display = 'table-row'
            row_container.appendChild(clone_each_row)
            if(window.innerWidth <= 576){
                // console.log('jjjjjjjjjjjj');
                var row_clone = sm_row.cloneNode(true)
                row_clone.querySelector('#sm_user_id').textContent = user.user_id
                row_clone.querySelector('#sm_user_name').textContent = user.user_name
                var img_sm = document.createElement('img')
                img_sm.src ="data:image/webp;base64,"+user.user_image.base64img
                img_sm.alt = "user image"
                row_clone.querySelector('#sm_profile_img').appendChild(img_sm)
                if(user.update_req === false){
                    row_clone.querySelector("#sm_one_opt").style.display = 'flex'
                    row_clone.querySelector("#sm_two_opt").style.display = 'none'
                }else{
                    row_clone.querySelector("#sm_two_opt").style.display = 'flex'
                    row_clone.querySelector("#sm_one_opt").style.display = 'none'
                }
                row_clone.style.display = 'flex'
                sm_row_container.appendChild(row_clone)
            }
            // sm_row_container.style.display = 'flex'
        })
        each_row.style.display ='none'
        sm_row.style.display = 'none'
    addButtonFunctionalities()
    }catch(err){
        console.error('Error processing data:', err);
    }
}

document.addEventListener('DOMContentLoaded', render_table())




