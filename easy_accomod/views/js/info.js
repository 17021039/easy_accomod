$(document).ready(function() {
    let socket = io();
    

    function show(arr = [], continue_ = false) {
        if(arr.length === 0 || typeof(arr[0]) !== 'object') {
            let div = document.createElement('div');
            let message = document.createElement('h1');
            message.appendChild(document.createTextNode('Not found info'));
            div.appendChild(message);
            $('#div-content').html(div);
        }
        else {

            let table = document.createElement('table');
            table.className = 'table table-striped table-bordered';
            
            let hasObject = false;
            let tbody = document.createElement('tbody');
            for(let body of arr) {
                let row = document.createElement('tr');
                for(let content of Object.values(body)) {
                    if(content === null)
                        content = 'null';
                    if(content === undefined)
                        content = 'undefined';
                    if(typeof(content) === 'object') {
                        hasObject = true;
                        for(let val of Object.values(content)) {
                            let td = document.createElement('td');
                            if(val === null)
                                val = 'null';
                            if(val === undefined)
                                val = 'undefined';
                            td.appendChild(document.createTextNode(val));
                            row.appendChild(td);
                        }
                    } else {
                        let col = document.createElement('td');
                        if(typeof(content) === 'string' && content.indexOf('http://localhost:6660/image/') !== -1) {
                            col.style = 'display: flex; justify-content: center;flex-direction:column;';
                            for(let image of JSON.parse(content)) {
                                let img = document.createElement('img');
                                img.style = 'max-width: 500px; max-height: 500px;margin: 10px;';
                                img.src = image;
                                col.appendChild(img);
                            }
                        }
                        else
                            col.appendChild(document.createTextNode(content));
                        row.appendChild(col);
                    } 
                }
                tbody.appendChild(row);
            }
            

            let thead = document.createElement('thead');
            thead.className = 'thead-dark';
            thead.style = 'text-align: center;';

            if(hasObject) {
                let rowHead = document.createElement('tr');
                let rowSub = document.createElement('tr');
                for(let head of Object.keys(arr[0])) {
                    let col = document.createElement('th');
                    if(typeof(arr[0][head]) === 'object' && arr[0][head] !== null) {
                        col.colSpan = Object.keys(arr[0][head]).length;
                        for(let key of Object.keys(arr[0][head])) {
                            let th = document.createElement('th');
                            th.appendChild(document.createTextNode(key));
                            rowSub.appendChild(th);
                        }
                    }
                    else
                        col.rowSpan = '2';
                    col.appendChild(document.createTextNode(head));
                    rowHead.appendChild(col);
                }
                thead.appendChild(rowHead);
                thead.appendChild(rowSub);
            } else {
                let rowHead = document.createElement('tr');
                for(let head of Object.keys(arr[0])) {
                    let col = document.createElement('th');
                    col.appendChild(document.createTextNode(head));
                    rowHead.appendChild(col);
                }
                thead.appendChild(rowHead);
            }

            table.appendChild(thead);
            table.appendChild(tbody);

            if(!continue_)
                $('#div-content').html(table);  
            else
                $('#div-content').append(table);  
            
        }
    }

    function showObject(obj = {}, continue_ = false) {
        let table = document.createElement('table');
        table.className = 'table table-striped table-bordered';
        
        let hasObject = false;
        let tbody = document.createElement('tbody');

        let row = document.createElement('tr');
        for(let content of Object.values(obj)) {
            if(content === null)
                content = 'null';
            if(content === undefined)
                content = 'undefined';
            if(typeof(content) === 'object') {
                hasObject = true;
                for(let val of Object.values(content)) {
                    let td = document.createElement('td');
                    if(val === null)
                        val = 'null';
                    if(val === undefined)
                        val = 'undefined';
                    td.appendChild(document.createTextNode(val));
                    row.appendChild(td);
                }
            } else {
                let col = document.createElement('td');
                if(typeof(content) === 'string' && content.indexOf('http://localhost:6660/image/') !== -1) {
                    col.style = 'display: flex; justify-content: center;flex-direction:column;';
                    for(let image of JSON.parse(content)) {
                        let img = document.createElement('img');
                        img.style = 'max-width: 500px; max-height: 500px;margin: 10px;';
                        img.src = image;
                        col.appendChild(img);
                    }
                }
                else
                    col.appendChild(document.createTextNode(content));
                row.appendChild(col);
            } 
        }
        tbody.appendChild(row);
        
        

        let thead = document.createElement('thead');
        thead.className = 'thead-dark';
        thead.style = 'text-align: center;';

        if(hasObject) {
            let rowHead = document.createElement('tr');
            let rowSub = document.createElement('tr');
            for(let head of Object.keys(arr[0])) {
                let col = document.createElement('th');
                if(typeof(arr[0][head]) === 'object' && arr[0][head] !== null) {
                    col.colSpan = Object.keys(arr[0][head]).length;
                    for(let key of Object.keys(arr[0][head])) {
                        let th = document.createElement('th');
                        th.appendChild(document.createTextNode(key));
                        rowSub.appendChild(th);
                    }
                }
                else
                    col.rowSpan = '2';
                col.appendChild(document.createTextNode(head));
                rowHead.appendChild(col);
            }
            thead.appendChild(rowHead);
            thead.appendChild(rowSub);
        } else {
            let rowHead = document.createElement('tr');
            for(let head of Object.keys(arr[0])) {
                let col = document.createElement('th');
                col.appendChild(document.createTextNode(head));
                rowHead.appendChild(col);
            }
            thead.appendChild(rowHead);
        }

        table.appendChild(thead);
        table.appendChild(tbody);
        if(!continue_)
            $('#div-content').html(table);
        else
            $('#div-content').append(table);
    }

    function buttons(arr = []) {
        let get = document.createElement('div');
        get.dataset.method = 'GET';
        let post = document.createElement('div');
        post.dataset.method = 'POST';
        let put = document.createElement('div');
        put.dataset.method = 'PUT';
        for(let name of arr) {
            let button = document.createElement('button');
            button.className = 'btn btn-success mr-2';
            button.type = 'button';
            button.dataset.name = name;
            button.dataset.toggle = 'modal';
            button.dataset.target = '#modal-form';
            let h5 = document.createElement('h5');
            h5.appendChild(document.createTextNode(name.toUpperCase()));
            button.appendChild(h5);

            get.append(button);
        }

        for(let name of arr) {
            let button = document.createElement('button');
            button.className = 'btn btn-success mr-2';
            button.type = 'button';
            button.dataset.name = name;
            button.dataset.toggle = 'modal';
            button.dataset.target = '#modal-form';  
            let h5 = document.createElement('h5');
            h5.appendChild(document.createTextNode(name.toUpperCase()));
            button.appendChild(h5);

            post.append(button);
        }

        for(let name of arr) {
            let button = document.createElement('button');
            button.className = 'btn btn-success mr-2';
            button.type = 'button';
            button.dataset.name = name; 
            button.dataset.toggle = 'modal';
            button.dataset.target = '#modal-form';
            let h5 = document.createElement('h5');
            h5.appendChild(document.createTextNode(name.toUpperCase()));
            button.appendChild(h5);

            put.append(button);
        }

        document.getElementById('button-show').appendChild(document.createTextNode('GET'));
        document.getElementById('button-show').appendChild(get);
        document.getElementById('button-show').appendChild(document.createTextNode('POST'));
        document.getElementById('button-show').appendChild(post);
        document.getElementById('button-show').appendChild(document.createTextNode('PUT'));
        document.getElementById('button-show').appendChild(put);
    }

    function form(arr = []) {
        let tbody = document.createElement('tbody');
        for(let row of arr) {
            let tr = document.createElement('tr');
            let th = document.createElement('th');
            th.appendChild(document.createTextNode(row.name[0].toUpperCase() + row.name.slice(1)));

            let td = document.createElement('td');
            let input = document.createElement('input');
            if(row.type === 'textarea') {
                input = document.createElement('textarea');
                input.rows = '4';
            }
            else
                input.type = row.type;
            if(row.type === 'file') {
                input.multiple = true;
                input.accept = 'image/*';
            }
            input.className = 'form-control';
            input.name = row.name;
            td.appendChild(input);
            if(row.type === 'checkbox') {
                td.style = 'display: flex; justify-content: space-evenly;'
                let sent = document.createElement('input');
                sent.type = row.type;
                sent.className = 'form-control';
                td.appendChild(sent);
            } 
            
            tr.appendChild(th);
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
        $('#form').html(tbody);
    }

    function ioCookie() {
        let cookies = document.cookie.split(';');
        let index = cookies.findIndex(value => value.indexOf('io=') !== -1);
        if(index === -1)
            return null;
        else
            return cookies[index].split('=')[1];
    }

    socket.on('notReaded:notices', function(notice){
        if(ioCookie() === notice.io)
            $('#notice').text(notice.msg);
    });

    socket.on('new:notices', function(notice){
        if(ioCookie() === notice.io)
            $('#notice').text(notice.msg);
    });

    $('#notice').click(function() {
        axios.get('/notices', {
            params: {
                readed: false
            }
        }).then(res => {
            $('#notice').text('Thông báo');
            show(res.data.notices);
            let formData = new FormData();
            formData.append('readed', true);
            axios({
                method: 'put',
                url: '/notices',
                data: formData
            }).then(res => {
                console.log(res.data);
            }).catch(err => {
                console.log(err);
                if(err.response)
                    alert(JSON.stringify(err.response.data,null,4));
                else
                    alert(err);
            })
        }).catch(err => {
            console.log(err);
            if(err.response)
                alert(JSON.stringify(err.response.data,null,4));
            else
                alert(err);
        })
    })

    let buttonList = ['roles','typeUsers','typeTimes','typeRooms','users','admins','owners','renters','rooms','comments', 'notices'];
    buttons(buttonList);

    let formList = {
        roles: [
            {name: 'roleId', type: 'number'},
            {name: 'permission', type: 'text'},
        ],
        typeUsers: [
            {name: 'typeId', type: 'number'},
            {name: 'name', type: 'text'},
        ],
        typeTimes: [
            {name: 'typeId', type: 'number'},
            {name: 'name', type: 'text'},
        ],
        typeRooms: [
            {name: 'typeId', type: 'number'},
            {name: 'name', type: 'text'},
        ],
        users: [
            {name: 'userId', type: 'number'},
            {name: 'typeId', type: 'text'},
            {name: 'roleId', type: 'text'},
            {name: 'username', type: 'text'},
            {name: 'password', type: 'text'},
        ],
        admins: [
            {name: 'adminId', type: 'number'},
            {name: 'userId', type: 'number'},
            {name: 'code', type: 'text'},
            {name: 'name', type: 'text'},
            {name: 'username', type: 'text'},
            {name: 'password', type: 'text'},
        ],
        owners: [
            {name: 'ownerId', type: 'number'},
            {name: 'userId', type: 'number'},
            {name: 'code', type: 'text'},
            {name: 'name', type: 'text'},
            {name: 'residentId', type: 'text'},
            {name: 'phone', type: 'text'},
            {name: 'address', type: 'text'},
            {name: 'email', type: 'text'},
            {name: 'confirm', type: 'checkbox'},
            {name: 'username', type: 'text'},
            {name: 'password', type: 'text'},
        ],
        renters: [
            {name: 'renterId', type: 'number'},
            {name: 'userId', type: 'number'},
            {name: 'code', type: 'text'},
            {name: 'name', type: 'text'},
            {name: 'phone', type: 'text'},
            {name: 'email', type: 'text'},
            {name: 'username', type: 'text'},
            {name: 'password', type: 'text'},
            {name: 'roomId', type: 'number'},
            {name: 'follow', type: 'checkbox'},
        ],
        rooms: [
            {name: 'roomId', type: 'number'},
            {name: 'ownerId', type: 'number'},
            {name: 'code', type: 'text'},
            {name: 'address', type: 'text'},
            {name: 'nearAddress', type: 'text'},
            {name: 'typeId', type: 'number'},
            {name: 'amount', type: 'number'},
            {name: 'price', type: 'number'},
            {name: 'area', type: 'number'},
            {name: 'general', type: 'checkbox'},
            {name: 'image', type: 'file'},
            {name: 'typeTimeId', type: 'number'},
            {name: 'shownTime', type: 'number'},
            {name: 'bathroom', type: 'text'},
            {name: 'heater', type: 'checkbox'},
            {name: 'kitchen', type: 'text'},
            {name: 'airConditioner', type: 'checkbox'},
            {name: 'balcony', type: 'checkbox'},
            {name: 'electricityPrice', type: 'number'},
            {name: 'waterPrice', type: 'number'},
            {name: 'otherUtility', type: 'text'},
            {name: 'confirm', type: 'checkbox'},
            {name: 'now', type: 'checkbox'},
            {name: 'startDate', type: 'date'},
            {name: 'endDate', type: 'date'},
            {name: 'maxFollow', type: 'checkbox'},
            {name: 'maxComment', type: 'checkbox'},
            {name: 'maxStar', type: 'checkbox'},
        ],
        comments: [
            {name: 'commentId', type: 'number'},
            {name: 'renterId', type: 'number'},
            {name: 'roomId', type: 'number'},
            {name: 'comment', type: 'textarea'},
            {name: 'star', type: 'number'},
        ],
        notices: [
            {name: 'noticesId', type: 'number'},
            {name: 'ownerId', type: 'number'},
            {name: 'notification', type: 'number'},
            {name: 'readed', type: 'checkbox'},
        ],
    }

    $(document).on('click', '#button-show button', function() {
        form(formList[this.dataset.name])
        document.getElementById('Ok').dataset.method = this.parentNode.dataset.method;
        document.getElementById('Ok').dataset.url = 'http://localhost:6660/' + this.dataset.name;
        document.getElementById('Ok').dataset.name = this.dataset.name;
       
    })

    $('#Ok').click(function() {
        let params = {};
        let formData = new FormData();

        $('#form [name]').each(function() {
            switch (this.type) {
                case 'checkbox':
                    if(this.nextElementSibling.checked)
                        params[this.name] = this.checked;
                        formData.append(this.name, this.checked);
                    break;
                case 'file':
                    let i = 1;
                    for(let file of this.files) {
                        formData.append('image(' + (i++) + ')', file);
                    }
                    break;
                default:
                    if(this.value) {
                        params[this.name] = this.value;
                        formData.append(this.name, this.value);
                    }
                    break;
            }
            
        })
        
        if(this.dataset.method === 'GET') {
            axios.get(this.dataset.url, {
                params: params
            }).then(res => {
                let info = res.data[this.dataset.name];
                
                if(Object.keys(info)[0].toString() !== '0') {
                    let continue_ = false;
                    console.log(info)
                    for(let value of Object.values(info)) {
                        show(value, continue_);
                        continue_ = true;
                    }
                }
                else
                    show(info);
        
            }).catch(err => {
                console.log(err);
                if(err.response)
                    alert(JSON.stringify(err.response.data,null,4));
                else
                    alert(err);
            })
        }
        else {
            axios({
                method: this.dataset.method.toLowerCase(),
                url: this.dataset.url,
                data: formData
            }).then(res => {
                alert('Tạo/cập nhật thành công');
        
            }).catch(err => {
                if(err.response)
                    alert(JSON.stringify(err.response.data,null,4));
                else
                    alert(err);
            })
        }
        
        

   /*      switch (this.dataset.method) {
            case 'GET':
                axios.get(this.dataset.url, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    data: formData,
                }).then(res => {
                    let info = res.data[this.dataset.name];
                    show(info);
            
                }).catch(err => {
                    if(err.response)
                        alert(JSON.stringify(err.response.data,null,4));
                    else
                        alert(err);
                })
                break;
            case 'POST':
                axios.post(this.dataset.url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res => {
                    alert(JSON.stringify(res.data,null,4));
            
                }).catch(err => {
                    if(err.response)
                        alert(JSON.stringify(err.response.data,null,4));
                    else
                        alert(err);
                })
                break;
            case 'PUT':
                axios.put(this.dataset.url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res => {
                    alert(JSON.stringify(res.data,null,4));
            
                }).catch(err => {
                    if(err.response)
                        alert(JSON.stringify(err.response.data,null,4));
                    else
                        alert(err);
                })
                break;
            default:
                break;
        } */
    })

    

})
            