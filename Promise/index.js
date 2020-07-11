const promise = new Promise((resolve, reject) => {
        try {
            resolve('123')
        } catch(err) {
            reject('error')
        }
})

promise.then((msg) => {
    console.log(msg)
})



class myPromise1 {
    // 构造方法接受一个function
    constructor(callback) {
        callback(this.resolve, this.reject)
    }

    resolve = (value) => {}
    reject = (reason) => {}
}

// 三种状态
const  stateArr = ['pending', 'fulfilled', 'rejected']

class myPromise2 {
    constructor(callback) {
        this.state = stateArr[0]
        this.value = null
        this.reason = null

        callback(this.resolve, this.reject)
    }

    resolve = (value) => {
        //
        if(this.state === stateArr[0])
        this.state = stateArr[1]
        this.value = value
    }

    reject = (reason) => {
        //
        if (this.state === stateArr[0]) {
            this.state = stateArr[2]
            this.reason = reason
        }
    }
}

// then
// const  stateArr = ['pending', 'fulfilled', 'rejected']

class myPromise3 {
    constructor(callback) {
        this.state = stateArr[0]
        this.value = null
        this.reason = null

        callback(this.resolve, this.reject)
    }

    resolve = (value) => {
        //
        if(this.state === stateArr[0])
        this.state = stateArr[1]
        this.value = value
    }

    reject = (reason) => {
        //
        if (this.state === stateArr[0]) {
            this.state = stateArr[2]
            this.reason = reason
        }
    }

    then = (onFulfilled, onRejected) => {
        // 判断 onFulfilled, onRejected是不是函数，不是则忽略
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
        onRejected = typeof onRejected === 'function' ? onRejected : 
        (reason) => reason

        // fulFilled
        if(this.state === stateArr[1]) {
            return new myPromise3((resolve, reject) => {
                try{
                    const result = onFulfilled(this.value)
                    // onFulfilled 返回Promise，则调用then
                    if (result instanceof myPromise3) {
                        result.then(resolve, reject)
                    } else{
                        resolve(result)
                    }
                } catch(err) {
                    reject(err)
                }
            })
        }

        // rejected
        if (this.state === stateArr[2]) {

            // then 的返回必须是一个promise
            return new myPromise3((resolve, reject) => {
                try {
                    const result = onRejected(this.reject)
                    //
                    if (result instanceof myPromise3) {
                        result.then(resolve, reject)
                    } else {
                        resolve(result)
                    }
                } catch(err) {
                    reject(err)
                }
            })
        }

    }
}

// 目前遇到异步的请求 resolve不能按上下文执行，这会导致then失败
//  //将then中的方法保存起来，等待resolve或reject执行后再调用刚刚保存的then中的方法
//  // 由于在这期间可能会有多个then方法会被执行，所以需要用一个数据来保存这些方法



class myPromise4 {
    constructor(callback) {
        this.state = stateArr[0]
        this.value = null
        this.reason = null
        // 新增resolve reject 方法数组
        this.resolveArr = []
        this.rejectArr = []

        callback(this.resolve, this.reject)
    }

    resolve = (value) => {
        //判断状态是否需要是pending
        if(this.state === stateArr[0])
        this.state = stateArr[1]
        this.value = value

        this.resolveArr.forEach(fun => fun(value))
    }

    reject = (reason) => {
        //
        if (this.state === stateArr[0]) {
            this.state = stateArr[2]
            this.reason = reason

            this.rejectArr.forEach(fun => fun(reason))
        }
    }

    // then方法中需要添加捕捉pending状态的逻辑
    then = (onFulfilled, onRejected) => {
        // 判断 onFulfilled, onRejected是不是函数，不是则忽略
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
        onRejected = typeof onRejected === 'function' ? onRejected : 
        (reason) => reason


        if (this.state === stateArr[0]) {
            return new myPromise4((resolve, reject) => {
                // 插入成功时
                this.resolveArr.push((value) => {
                    try {
                        const result = onFulfilled(value)
                        if (result instanceof myPromise4) {
                            result.then(resolve, reject);
                        } else {
                            resolve(result);
                        }
                    } catch(err) {
                        reject(err)
                    }
                })

                // 插入失败时
                this.rejectArr.push((value) => {
                    try {
                        const result = onRejected(value);
                        if (result instanceof myPromise4) {
                            result.then(resolve, reject);
                        } else {
                            resolve(result);
                        }
                    } catch(err) {
                        reject(err)
                    }
                })
            })
        }
        // fulFilled
        if(this.state === stateArr[1]) {
            return new myPromise3((resolve, reject) => {
                try{
                    const result = onFulfilled(this.value)
                    // onFulfilled 返回Promise，则调用then
                    if (result instanceof myPromise3) {
                        result.then(resolve, reject)
                    } else{
                        resolve(result)
                    }
                } catch(err) {
                    reject(err)
                }
            })
        }

        // rejected
        if (this.state === stateArr[2]) {

            // then 的返回必须是一个promise
            return new myPromise3((resolve, reject) => {
                try {
                    const result = onRejected(this.reject)
                    //
                    if (result instanceof myPromise3) {
                        result.then(resolve, reject)
                    } else {
                        resolve(result)
                    }
                } catch(err) {
                    reject(err)
                }
            })
        }

    }
}


// 测试
new myPromise4((resolve, reject) => {
    setTimeout(() => {
        resolve(123);
    }, 2000)
})
.then(msg => {
    console.log(msg);
    return new myPromise4((resolve, reject) => {
        setTimeout(()=> {
            resolve(456)
        }, 2000);
    })
})
.then(msg => {
    console.log(msg);
})
