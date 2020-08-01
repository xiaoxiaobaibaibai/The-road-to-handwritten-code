function changeName(person) {
    // let name = 'bai'
    with(person) {
      name = 'BigBear'
    }
  }
  
  var me = {
    name: 'xiuyan',
    career: 'coder',
    hobbies: ['coding', 'footbal']
  }
  
  var you = {
    career: 'product manager'
  }
  
  changeName(me)
  changeName(you)
  console.log(name) // 输出 'BigBear