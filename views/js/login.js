
$(document).ready(function() {
    // $(document).on('click', '#signOut, #changeAccount', function() {
    //     localStorage.removeItem('user');
    //     axios.get('/formLogin').then(res => {
    //         $('body').append('<div class="login"></div>');
    //         $('div.login').append(res.data);
    //     })
    // })
    

    $(document).on('click', "#login",function() {
        let user = $('table.login').find('input');
        let obj = {};
        for(let i = 0; i < user.length; i++) {
            if(user[i.toString()].name) {
                obj[user[i.toString()].name] = user[i.toString()].value;
            }
        }
        axios.post('/login',obj).then(res => {
            alert(JSON.stringify(res.data, null,4));
        }).catch(err => {

            if(err.response.status) {
                alert('response: ' +  JSON.stringify(err.response.data,null,4));
            }
            else {
                alert(err);
            }
        });

    })

    $('#logout').click(function() {
        axios.get('/logout').then(res => {
            alert(JSON.stringify(res.data, null,4));
        }).catch(err => {
            if(err.response.status) {
                alert('response: ' +  JSON.stringify(err.response.data,null,4));
            }
            else {
                alert(err);
            }
        });
    })

})
            