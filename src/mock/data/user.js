import Mock from 'mockjs';
import axios from 'axios';
import { userInfo } from 'os';

const LoginUsers = [{
    id: 1,
    username: 'xiaojian',
    password: '17621376429',
    avatar: 'https://www.bitauto.com/zhuanti/adtopic/js/share_logo.jpg',
    name: '李某某'
}, {
    id: 2,
    username: 'wen88888888',
    password: '20188888',
    avatar: 'https://www.bitauto.com/zhuanti/adtopic/js/share_logo.jpg',
    name: '李某人'
}];

let Users = []

export{
    LoginUsers,
    Users
};

export function cube(x) {
    return x * x * x;
}
    
// 模拟数据
// for (let i = 0; i < 86; i++) {
//   Users.push(Mock.mock({
//     id: Mock.Random.guid(),
//     name: Mock.Random.cname(),
//     dateout: Mock.Random.date('yyyy-MM-dd'),
//     'serial|0-10000': 1,
//     date: Mock.Random.date('yyyy-MM-dd'),
//     state: Mock.Random.integer(0, 1),
//     // addr: Mock.mock('@county(true)')
//   }));
// }