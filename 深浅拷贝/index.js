// 浅拷贝
// 1.数组浅拷贝 --slice
let originArr = [1, 2, { x: 3 }]
let originObj = {
    x: 1,
    y:
    {
        z: {
            a: "hello"
        }
    },
    z: originArr

}
function shallowCopy1(originArr) {
    console.log(originArr.slice())
    return originArr.slice()
    // slice() 方法返回一个新的数组对象，这一对象是一个由 begin 和 end 决定的原数组的浅拷贝（包括 begin，不包括end）。原始数组不会被改变。
}

// 2.数组浅拷贝 -concat
function shallowCopy2(originArr) {
    console.log(originArr.concat())
    return originArr.concat()
    // concat() 方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。
    // 如果省略了valueN参数参数，则concat会返回一个它所调用的已存在的数组的浅拷贝
}
// 3.数组浅拷贝 -递归
function shallowCopy3(originArr) {
    let result = []
    for (let i = 0; i < originArr.length; i++) {
        result.push(originArr[i])
    }
    console.log(result)
    return result
}

// 4. 对象浅拷贝 -assign
function shallowCopy4(origin) {
    console.log(Object.assign({}, origin)) 
    return Object.assign({}, origin)
    // Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
    // 如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖。后面的源对象的属性将类似地覆盖前面的源对象的属性。
    // Object.assign 的拷贝，假如源对象的属性值是一个指向对象的引用，它也只拷贝那个引用值。MDN 有相应的实例和解释。
}

// 对象浅拷贝 - ...
function shallowCopy5(origin) {
    console.log({
        ...origin
    }) 
    return {
        ...origin
    }
}



// 深拷贝
// 1. 通过JSON转换

function deepCopy1(origin) {
    return JSON.parse(JSON.stringify(origin))
    // JSON.stringify(value[, replacer [, space]])
    // JSON.stringify() 方法将一个 JavaScript 值（对象或者数组）转换为一个 JSON 字符串，如果指定了 replacer 是一个函数，则可以选择性地替换值，或者如果指定了 replacer 是一个数组，则可选择性地仅包含数组指定的属性。
    // JSON.parse() 方法用来解析JSON字符串，构造由字符串描述的JavaScript值或对象。提供可选的 reviver 函数用以在返回之前对所得到的对象执行变换(操作)。
}

// 对于 function、undefined，会丢失这些属性。
// 对于 RegExp、Error 对象，只会得到空对象
// 对于 date 对象，得到的结果是 string，而不是 date 对象
// 对于 NaN、Infinity、-Infinity，会变成 null
// 无法处理循环引用

// 2.递归
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

console.log(deepCopy2(originObj))

originObj.y.z.a = "hello world"


