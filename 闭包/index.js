for (var i = 0;i < 5;i++) {
    setTimeout(function() {
        console.log(new Date, i)
    }, 1000)
}

console.log(new Date, i)


//5 -> 0,1,2,3,4  闭包
for (var i = 0;i < 5;i++) {

    (function(j) {
        setTimeout(function() {
        console.log(new Date, i)
    }, 1000)
    })(i)    
}

console.log(new Date, i)


//5 -> 0,1,2,3,4  api
for (var i = 0;i < 5;i++) {
    setTimeout(function() {
        console.log(new Date, i)
    }, 1000,i)
}

//0 -> 1 -> 2 -> 3 -> 4 -> 5
for (var i = 0;i<5;i++) {
    (function (j) {
        setTimeout(function(){
            console.log(new Date,j)
        }, 1000*j)
      })(i)
}

setTimeout(function() { // 这里增加定时器，超时设置为 5 秒
    console.log(new Date, i);
}, 1000 * i);

// 0 -> 1 -> 2 -> 3 -> 4 -> 5 ES6
const tasks= []
for(var i = 0;i<5;i++){
    ((j) => {
        tasks.push(new Promise((resolve) => {
            setTimeout(() => {
                console.log(new Date,j)
                resolve()
            }, 1000*j)
        }))
    })(i)
}

Promise.all(tasks).then(() => {
    setTimeout(() => {
        console.log(new Date,i)
    },1000)
})

// 粒度
const task = []
const output = (i) => new Promise((resolve =>{
    setTimeout(() => {
        console.log(new Date,i)
        resolve()
    }, 1000*i)
}))

for (var i = 0;i<5; i++) {
    task.push(output(i))
}

Promise.all(task).then(() =>{
    setTimeout(() => {
        console.log(new Date,i)
    },1000)
})


// es7
const sleep = (timeoutMS) => new Promise((resolve) => {
    setTimeout(resolve, timeoutMS);
});

(async () => {  // 声明即执行的 async 函数表达式
    for (var i = 0; i < 5; i++) {
        if (i > 0) {
            await sleep(1000);
        }
        console.log(new Date, i);
    }

    await sleep(1000);
    console.log(new Date, i);
})();

'use strict'
class Student{
    constructor(name){
        this.name = name;
    }
    doSth(){
        console.log(this.name);
    }
}
let s1 = new Student('若川');
s1.doSth();


function Foo() {
    getName = function () { alert (1); };
    return this;
}
Foo.getName = function () { alert (2);};
Foo.prototype.getName = function () { alert (3);};
var getName = function () { alert (4);};
function getName() { alert (5);}

//请写出以下输出结果：
Foo.getName();
getName();
Foo().getName();
getName();
new Foo.getName();
new Foo().getName();
new new Foo().getName();



function Foo() {
    getName = function () { alert (1); };
    return this;
}

console.log(new Foo()) 