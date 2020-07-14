// let const
// 1, 块级作用域
for (var i = 0;i < 10;i++) {
    // for循环分为3部分，第一部分包含一个变量声明，第二部分包含一个循环的退出条件，第三部分包含每次循环最后要执行的表达式，第一部分在这个for循环中只会执行一次var i = 0，而后面的两个部分在每次循环的时候都会执行一遍
    console.log(i)
}

for (let i = 0;i < 10; i++){
    //而使用使用let/const关键字声明变量的for循环，除了会创建块级作用域，let/const还会将它绑定到每个循环中，确保对上个循环结束时候的值进行重新赋值
    // 可以理解为给每次循环创建一个块级作用域
    // do sth
}

//

let arr = [1,2,3]
let iterator = arr[Symbol.iterator]() // 需要使用键值的形式访问
iterator.next() // {value: 1,done: false}
iterator.next() // {value: 2,done: false}
iterator.next() // {value: 3,done: false}
iterator.next() // {value: undefined,done: true}

function createIterator(items) {
    var i = 0;
    return {
        next: function() {
            var done = i >= items.length
            var value = !done ? items[i++] : undefined
            return {
                done,
                value
            }
        }
    }
}

let [first, ...arr] = [1,2,3,4,5]
first //1
let [...arr, last] = [1,2,3,4,5] // Uncaught SyntaxError

const curry = (fn) => {
    if (fn.length <= 1) return fn;
    const generator = (args) => (args.length === fn.length ? fn(...args) : arg => generator([...args, arg]) )

    return generator([])
}

let arr1 = [1,2,3,4,5]
let iterator1 = arr1[Symbol.iterator]()
for (let value, res; (res = iterator.next()) && !res.done;) {
    value = res.value
}

ajax("http://localhost:3000", () =》 {
    console.log("我扣了1000￥")
})


function bar (func = () => foo) {
    let foo = 'inner'
    console.log(func())
}

bar() //ReferenceError : foo is not defined

function func({x = 10} = {}, {y} = {y:10}) {
    console.log(x, y)
}

func({},{}) //10, undefined
func(undefined, {}) // 10 undefined
func(undefined, undefined) // 10,10
func() //10,10
func({x:1},{y:2}) //1,2

let obj = {}
obj = new Proxy(obj, {
    set(target, key, val) {
        console.log('oops')
        return Reflect.set(target, key, val)
    }
})

obj.foo = 'bar' //'oops

const proxy = (func, time) => {
    let previous = new Date(0).getTime()

    let handler = {
        apply(target, context, args) {
            let now = new Date().getTime()
            if (now - previous > time) {
                previous = now
                Reflect.apply(func, context, args)
            }
        }
    }

    return new Proxy(func, handler)
}


function proxy(func) {
    let instance
    let handler = {
        construct(target, args) {
            if (!instance) {
                // 没有实例就创建一个
                instance = Reflect.construct(func, args)
            }

            return instance
        }
    }

    return new Proxy(func, handler)
}

function Person(name, age) {
    this.name = name
    this.age = age
}

const SingletonPerson = proxy(Person)

let person1 = new SingletonPerson('bai', 22)
let person2 = new SingletonPerson('qiao', 22) //这个实例不会生成，会返回person1

console.log(person1 === person2)  //true

function onChange(obj, callback) {
    const handler = {
        get(target, key) {
            try {
                return new Proxy(target[key], handler)
            } catch (e) {
                Reflect.get(target, key)
            }
        },
        defineProperty(target, key, descriptor) {
            callback()
            return Reflect.defineProperty(target, key, descriptor)
        }
    }
    return new Proxy(obj, handler)
}

let obj = onChange({}, () => {
    console.log('oops')
})

obj.a = {} //oops
obj.a.b = 1 //oops