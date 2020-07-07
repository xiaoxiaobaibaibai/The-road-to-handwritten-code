// new 操作符做了这些事情
// 它创建了一个全新的对象。
// 它会被执行[[Prototype]]（也就是__proto__）链接。
// 它使this指向新创建的对象。。
// 通过new创建的每个对象将最终被[[Prototype]]链接到这个函数的prototype对象上。
// 如果函数没有返回对象类型Object(包含Functoin, Array, Date, RegExg, Error)，那么new表达式中的函数调用将返回该对象引用。
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