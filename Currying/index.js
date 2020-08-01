// 参数复用 本质上是降低通用性，提高实用性
const curry = function (fn) {
    let args = [].slice.call(arguments, 1)
    return function() {
        let newArgs = args.concat([].slice.call(arguments))
        return fn.apply(this, newArgs)
    }
}
var curry2 = fn =>
    judge = (...args) =>
        args.length === fn.length
            ? fn(...args)
            :(arg) => judge(...args,arg)