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