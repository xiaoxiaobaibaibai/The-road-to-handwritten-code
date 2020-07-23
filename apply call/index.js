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

// console.log(bar.myApply(a, ['bai', 8])) 


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

    // console.log(bar.myCall(a, 'bai', 8)) 