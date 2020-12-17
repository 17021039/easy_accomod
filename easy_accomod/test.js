require('dotenv').config();
const connect = require('./connect/connection.js');
const set = require('./controllers/set.js')


async function run() {
    try {
        // let result = await set.owners('owner.2', 'Nguyễn Văn Hùng', '124453267', '0906878018', '4 Đường Số 24 Bình Phú p11 Q6', 'hungQ6@gmail.com', 'hungnv','12345678');
        let result = await set.rooms(2, 'phong_tro.3',
        '8 Đường Số 6 Bình Phú p4 Q4', 'Metro Bình Phú Q4', 1, 4, 3000000, 22, false, JSON.stringify(['3(1).jpg', '3(2).jpg', '3(3).jpg']),
        new Date(2020,10,15), 3, 2,
        'khép kín', true, 'không nấu ăn', false, true, 3500, 20000, 'Miễn phí internet , wifi + cáp tivi svtv');
        console.log(JSON.stringify(result,null,4));
    } catch (error) {
        console.log(error);
    }
    
}

run();

// console.log(Date.now());
// console.log(typeof((new Date(2016,4,25)).valueOf()));
// console.log(new Date('2016/13/2').toJSON());
// if(new Date('2016/13/2').toJSON())
//     console.log(true);
// else
//     console.log(false);


// console.log(JSON.stringify({userId: 12, renterId: 1},null,4));
