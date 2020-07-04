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