function CutePromise(executor) {
    this.value = null //记录成功的执行结果
    this.reason = null //记录失败的原因
    this.status = 'pending'

    this.onResolveQueue = []
    this.onRejectedQueue = []
    let self = this

    function resolve(value) {
        if(self.state !== 'pending') {
            return
        }
        self.value = value
        self.state = 'resolved'
        // setTimeout(function() {
        //     self.onResolveQueue.forEach(resolved => resolved(self.value))
        // })
        self.onResolvedQueue.forEach(resolved => resolved(self.value))
      }
    
    function reject(reason) {
        if(self.state !== 'pending') {
            return
        }
        self.reason = reason
        self.reason = 'rejected'
        // setTimeout(function() {
        //     self.onRejectedQueue.forEach(rejected => rejected(self.reason))
        // })
        self.onRejectedQueue.forEach(rejected => rejected(self.reason))
    }

    executor(resolve, reject)
}

CutePromise.prototype.then = function(onResolved, onRejected) {
  
    // 注意，onResolved 和 onRejected必须是函数；如果不是，我们此处用一个透传来兜底
    if (typeof onResolved !== 'function') {
        onResolved = function(x) {return x};
    }
    if (typeof onRejected !== 'function') {
        onRejected = function(e) {throw e};
    }
  
    // 依然是保存 this
    var self = this;
    // 这个变量用来存返回值 x
    let x
    
    // resolve态的处理函数
    function resolveByStatus(resolve, reject) {
        // 包装成异步任务，确保决议程序在 then 后执行
        setTimeout(function() {
            try { 
                // 返回值赋值给 x
                x = onResolved(self.value);
                // 进入决议程序
                resolutionProcedure(promise2, x, resolve, reject);
            } catch (e) {
                // 如果onResolved或者onRejected抛出异常error，则promise2必须被rejected，用error做reason
                reject(e);
            }
        });
    }
  
    // reject态的处理函数
    function rejectByStatus(resolve, reject) {
        // 包装成异步任务，确保决议程序在 then 后执行
        setTimeout(function() {
            try {
                // 返回值赋值给 x
                x = onRejected(self.reason);
                // 进入决议程序
                resolutionProcedure(promise2, x, resolve, reject);
            } catch (e) {
                reject(e);
            }
        });
    }

    
    // 注意，这里我们不能再简单粗暴 return this 了，需要 return 一个符合规范的 Promise 对象
    var promise2 = new CutePromise(function(resolve, reject) {
        // 判断状态，分配对应的处理函数
        if (self.status === 'resolved') {
            // resolve 处理函数
            resolveByStatus(resolve, reject);
        } else if (self.status === 'rejected') {
            // reject 处理函数
            rejectByStatus(resolve, reject);
        } else if (self.status === 'pending') {
            // 若是 pending ，则将任务推入对应队列
            self.onResolvedQueue.push(function() {
                 resolveByStatus(resolve, reject);
            });
            self.onRejectedQueue.push(function() {
                rejectByStatus(resolve, reject);
            });
        }
    });

    // 把包装好的 promise2 return 掉
    return promise2;
};
function resolutionProcedure(promise2, x, resolve, reject) {
    let hasCalled // 确保resolve、reject 不被重复执行
    if (x=== promise2) {
         // 决议程序规范：如果 resolve 结果和 promise2相同则reject，这是为了避免死循环
         return reject(new TypeError('为避免死循环 此处抛出错误'))
    } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        // 决议程序规范：如果x是一个对象或者函数，则需要额外处理下
        try {
            // 首先是看它有没有 then 方法（是不是 thenable 对象）
            let then = x.then
            if (typeof then === 'function') {
                then.call(x,y => {
                    if (hasCalled) return
                    hasCalled = true
                    resolutionProcedure(promise2, y, resolve, reject)
                }, err =>{
                    if (hasCalled) return;
                    hasCalled = true
                    reject(err)
                })
            } else {
                resolve(x)
            }
        } catch (e) {
            if (hasCalled) return;
            hasCalled = true
            reject(e)
        }
    } else {
        resolve(x)
    }
}