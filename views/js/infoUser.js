$(document).ready(function() {
    axios.get('/infoUser').then(res => {
        let user = res.data.user;
        let thead = document.createElement('thead');
        thead.className = 'thead-dark';
        thead.style = 'text-align: center;';
        let rowHead = document.createElement('tr');
        let tbody = document.createElement('tbody');
        let rowBody = document.createElement('tr');
        
        for(let head of Object.keys(user)) {
            let title = document.createElement('th');
            title.textContent = head;
            let content = document.createElement('td');
            content.textContent = user[head];
            rowHead.appendChild(title);
            rowBody.appendChild(content);
        }
        thead.appendChild(rowHead);
        tbody.appendChild(rowBody);
        $('#content').html(thead);
        $('#content').append(tbody);

    }).catch(err => {
        if(err.response)
            alert(JSON.stringify(err.response.data,null,4));
        else
            alert(err);
    })

    $('#submit').click(function() {
        let formData = new FormData();
        let i = 1;
        for(let file of $('#image')[0].files) {
            formData.append('image_' + i++,file);
        }
        formData.append('message', 'Success');
        console.log(formData);
        let files = $('#image')[0].files;
        axios.post('/download',formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            alert(res.data);
        }).catch(err => {
            let error = err.response.data.error;
            console.log(error);
            alert("status: " + error.status + "\nmessage server: " + error.message + "\nmessage client: " + err);
        })
    })

})
            