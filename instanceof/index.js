// typeof一般被用于判断一个变量的类型，我们可以利用typeof来判断number、string、object、boolean、function、undefined、symbol这七种类型。当判断不是object时其它都好说。

// 下面的例子令人迷惑，非常危险，没有用处。避免使用它们。
typeof new Boolean(true) === 'object';
typeof new Number(1) === 'object';
typeof new String('abc') === 'object';

// 函数
typeof function() {} === 'function';
typeof class C {} === 'function'
typeof Math.sin === 'function';

// typeof 原理：
// js在底层存储变量的时候，会在变量的机器码的低位1-3位存储其类型信息
// 000：对象
// 010：浮点数
// 100： 字符串
// 110：布尔值
// 1： 整数
// 但是，对于undefined和null来说，这两个的信息存储比较特殊。
// null所有机器码均为0，undefined为-2^30整数，所以typeof判断时null均为0，因此被当做对象。
// 所以一般用typeof判断基本数据类型。
// 还可以通过Object.prototype.toString来判断


//instanceof主要作用就是判断一个实例是否属于某种类型

function new_instance_of(leftVaule, rightVaule) { 
    let rightProto = rightVaule.prototype; // 取右表达式的 prototype 值
    leftVaule = leftVaule.__proto__; // 取左表达式的__proto__值
    while (true) {
    	if (leftVaule === null) {
            return false;	
        }
        if (leftVaule === rightProto) {
            return true;	
        } 
        leftVaule = leftVaule.__proto__ 
    }
}

//实现原理就是只要右边变量的 prototype 在左边变量的原型链上即可。因此，instanceof 在查找的过程中会遍历左边变量的原型链，直到找到右边变量的 prototype，如果查找失败，则会返回 false，告诉我们左边变量并非是右边变量的实例。

// 几个有趣的地方
// 1. Object instanceof Object // true
// 2. Foo instanceof Foo // false
// 3. Foo instanceof Object //true
// 4. Foo instanceof Function //true