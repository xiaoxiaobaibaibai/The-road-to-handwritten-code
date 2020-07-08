[toc]
> 本系列在掘金同步更新：[我的掘金地址](https://juejin.im/post/5eff356be51d4534b208a501)


JS 中的数据类型分为两种，基本数据类型和引用数据类型，基本数据类型是保存在栈的数据结构中的,是按值访问，所以不存在深浅拷贝问题。

1. 浅拷贝的意思就是，你只是复制了对象数据的引用，并没有把内存里的值另外复制一份
2. 深拷贝就完整复制数据的值（而非引用），目的在于避免拷贝后数据对原数据产生影响。


``` 
let originArr = [1, 2, { x: 3 }]
let originObj = {
    a:1,
    b:[1,2,3],
    c:{
        "0":0
    },
    d: undefined,
    e: null,
    f: new Date()
}
// 循环调用
originObj.originObj = originObj
```
## 浅拷贝
###  1.数组浅拷贝 --slice
```javascript
function shallowCopy1(originArr) {
    return originArr.slice()
    // slice() 方法返回一个新的数组对象，这一对象是一个由 begin 和 end
    //决定的原数组的浅拷贝（包括 begin，不包括end）。原始数组不会被改变。
}
```
### 2.数组浅拷贝 -concat

```javascript
function shallowCopy2(originArr) {
    return originArr.concat()
    // concat() 方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。
    // 如果省略了valueN参数参数，则concat会返回一个它所调用的已存在的数组的浅拷贝
}
```
### 3.数组浅拷贝 -递归
```javascript
function shallowCopy3(originArr) {
    let result = []
    for (let i = 0; i < originArr.length; i++) {
        result.push(originArr[i])
    }
    console.log(result)
    return result
}
```
### 4. 对象浅拷贝 -assign
```javascript
function shallowCopy4(origin) {
    return Object.assign({}, origin)
    // Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。
    // 它将返回目标对象。
    // 如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖。
    // 后面的源对象的属性将类似地覆盖前面的源对象的属性。
    // Object.assign 的拷贝，假如源对象的属性值是一个指向对象的引用，它也只拷贝那个引用值.
}
```
### 5.对象浅拷贝 - ...
```javascript
function shallowCopy5(origin) {
    console.log({
        ...origin
    }) 
    return {
        ...origin
    }
}

```

## 深拷贝
### 1. 通过JSON转换
```javascript
function deepCopy1(origin) {
    return JSON.parse(JSON.stringify(origin))
    // JSON.stringify(value[, replacer [, space]])
    // JSON.stringify() 方法将一个 JavaScript 值（对象或者数组）转换为一个 JSON 字符串
    // 如果指定了 replacer 是一个函数，则可以选择性地替换值，或者如果指定了 replacer 是一个数组，则可选择性地仅包含数组指定的属性。
    // JSON.parse() 方法用来解析JSON字符串，构造由字符串描述的JavaScript值或对象。提供可选的 reviver 函数用以在返回之前对所得到的对象执行变换(操作)。
}

// 对于 function、undefined，会丢失这些属性。
// 对于 RegExp、Error 对象，只会得到空对象
// 对于 date 对象，得到的结果是 string，而不是 date 对象
// 对于 NaN、Infinity、-Infinity，会变成 null
// 无法处理循环引用
```
### 2.递归
```javascript
function deepCopy2(origin) {
    const result = origin.constructor === Array ? [] : {}
    for (let keys in origin) {
        // 不遍历原型链上的属性
        if (origin.hasOwnProperty(keys)) {
            //  if (origin[keys] && typeof origin[keys] === "object"){
            //     // 如果值是对象，就递归一下, 区分是一般对象还是数组对象
            //     result[keys] = origin[keys].constructor === Array ? [] : {}
            //     // 如果是引用数据类型，会递归调用
            //     result[keys] = deepCopy2(origin[keys]);
            // } else {
            //     result[keys] = origin[keys];
            // }
            result[keys] = typeof origin[keys] === 'object' ? deepCopy2(origin[keys]) : origin[keys]
        }
    }
   // console.log(result)
    return result
  }


```
### 3.对于循环引用的优化
```javascript
// function deepCopy3(origin, map = new Map()) {
    // 在node环境中可以运行，在浏览器对还是会报错（爆栈）。 Map只做到了让他没有报错，但是也并没有完美的解决循环引用的问题
    // 而 WeakMap 的键值是弱引用的。 什么是弱引用，即垃圾回收机制不考虑 WeakMap 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakMap 之中
function deepCopy3(origin, map = new WeakMap()) {
    if (typeof origin === 'object') {
       let result = Array.isArray(origin) ? [] : {};
       if(map.get(origin)){
          return origin;
       }
       map.set(origin,result);
       for(let keys in origin){
           if (origin.hasOwnProperty(keys)) {
               result[keys] = deepCopy3(origin[keys],map);
       }
           }
          
       return map.get(origin);
    }else{
      return origin;
    }
  };


```

## **Function.prototype.bind()**
> bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

#### 语法 **function.bind(thisArg[, arg1[, arg2[, ...]]])** 
- thisArg调用绑定函数时作为this参数传递给目标函数的值。
- - 如果使用new运算符构造绑定函数，则忽略该值。
- - 当使用 bind在setTimeout中创建一个函数（作为回调提供）时，作为 thisArg传递的任何原始值都将转换为 object。
- - 如果 bind函数的参数列表为空，或者thisArg是null或undefined，执行作用域的 this将被视为新函数的 thisArg。
- arg1, arg2, ...
当目标函数被调用时，被预置入绑定函数的参数列表中的参数。
- 返回值是一个原函数的拷贝，并拥有指定的 this 值和初始参数。

#### bind函数的实现
首先要了解this的绑定，this的绑定有4种原则：
- 默认绑定
- 隐式绑定
- 显式绑定
- new 绑定

四种绑定规则的优先级从上到下，依次递增，默认绑定优先级最低，new绑定最高。

其中显式绑定就是，运用apply(...)和call(...)方法，在调用函数时，绑定this，也即是可以指定调用函数中的 this 值

```javascript
// bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。


  Function.prototype.myBind = function (context) {
    if(typeof this !== 'function'){
        throw new TypeError('error')
    }
    let _this = this
    let args = [...arguments].slice[1]
    const F =  function() {  
        if (this instanceof F) {
            // instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
            return _this.apply(this, args.concat(...arguments))
        }else {
            return _this.apply(context, args.concat(...arguments))
        }
        
    }
    F.prototype = this.prototype
    return F
  }
//  F.prototype = this.prototype，直接修改 F.prototype 的时候，也会直接修改绑定函数的 prototype。可以通过一个空函数来进行中转：

  Function.prototype.myBind2 = function (context) {
    if(typeof this !== 'function'){
        throw new TypeError('error')
    }
    let _this = this
    let args = [...arguments].slice[1]
    let F2 = function() {}
    let F =  function() {  
        if (this instanceof F2) {
            // instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
            return _this.apply(this, args.concat(...arguments))
        }else {
            return _this.apply(context, args.concat(...arguments))
        }
        
    }
    F2.prototype = this.prototype
    F.prototype = new F2()
    return F
  }

```
## apply call
> apply() 方法调用一个具有给定this值的函数，以及作为一个数组（或类似数组对象）提供的参数。

> 注意：call()方法的作用和 apply() 方法类似，区别就是call()方法接受的是参数列表，而apply()方法接受的是一个参数数组。

```javascript
let a = {
    b: 2
}

function bar(name, age) {
    console.log(this.b);
    return {
        b: this.b,
        name: name,
        age: age
    }
}

Function.prototype.myApply = function(context) {
    if (typeof this !== 'function') {
        throw new TypeError('not a function')
    }

    context = context || window
    // 因为this参数可以传null，当为null时指向window
    context.fn = this
    let result // 函数可以有返回值
    if (arguments[1]) {
        result = context.fn(...arguments[1])
    } else {
        result = context.fn()
    }

    delete context.fn
    return result
}

console.log(bar.myApply(a, ['bai', 8])) 


 Function.prototype.myCall = function (context, ...args) {
    if( typeof this !== 'function') {
             throw new TypeError('not a function')
     }
    let fn = Symbol('temp')
    context = context || window
    context.fn = this
     let result = context.fn(...args)
     delete context.fn
     return result
   }

   console.log(bar.myCall(a, 'bai', 8)) 
```
## new
new操作符做了以下事情：
- 它创建了一个全新的对象。
- 它会被执行[[Prototype]]（也就是__proto__）链接。
- 它使this指向新创建的对象。。
- 通过new创建的每个对象将最终被[[Prototype]]链接到这个函数的prototype对象上。
- 如果函数没有返回对象类型Object(包含Functoin, Array, Date, RegExg, Error)，那么new表达式中的函数调用将返回该对象引用。

```javascript
function myNew() {
    // 创建一个空对象
    let emptyObj = {}
    // 取传入的第一个参数，即构造函数，并删除第一个参数。
    let constructor =  Array.prototype.shift.call(arguments);
    
    // 类型判断，错误处理
    if(typeof constructor !== "function") {
        throw("构造函数第一个参数应为函数");
    }
    
    // 绑定 constructor 属性
    emptyObj.constructor = constructor;
    
    // 关联 __proto__ 到 constructor.prototype
    emptyObj.__proto__ = constructor.prototype;
    
    // 将构造函数的 this 指向返回的对象
    let resultObj = constructor.apply(emptyObj, arguments);
    
    // 返回类型判断, 如果是对象，则返回构造函数返回的对象
    if ((typeof resultObj === "object" || typeof resultObj === "function") && resultObj !== null) {
    return resultObj
    }
    
    // 返回对象
    return emptyObj;
}
```







