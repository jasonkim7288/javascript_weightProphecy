import {getUsers} from './getUsers.js';
import setColor from './input.js';
import prediction from './prediction.js';

getUsers();
setInterval(setColor, 2000);
// setTimeout(() => {  window .location.reload() }, 3000);

