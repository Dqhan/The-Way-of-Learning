// callback回调函数{
// 思想：通过参数传入回调函数，未来调用回调函数是让函数的条用着判断了发生了什么

// 优点：容易实现，容易部署
// 缺点：可读性变差
// }


// 事件发布订阅{
// 思想：回调函数的事件化，任务执行不取决于代码执行顺序，取决于某个事件是否发生

// 优点：容易理解，可以绑定多个事件，每个事件可以指定多个回调函数
// 缺点：整个程序变成了事件驱动，运行流程混乱变差
// }


// （jQuery提出的设计思想）Deferred延迟函数{
// 思想：通过deferred对象对异步操作进行状态绑定，deferred对象统一提供API，对各种异步操作的状态进行操作（成功、失败、进行中）

// 优点：避免了层层嵌套的回调函数， deferred对象统一提供接口，是的控制异步操作更加容易
// 缺点：状态不可逆，从待定状态切换到另一个状态后，再次调用resolve或者reject对原状态讲不起任何作用
// }

// （继承了Deferred的设计思想）Promise{
// ES提供的异步标准，原生提供了Promise对象
// Promise设计思想: 一个容器，里面保存着一个异步操作的结果。从语法上来看，Promise是一个对象，提供了统一的API，各种异步操作都可以及使用同样的方法处理
// }


// 异步操作的状态管理

// 状态：{
//     成功
//     失败
//     进行中
// }

// 管理{
//     成功的回调函数
//     失败的回调函数
// }


// container容器{
//     注册
//     触发
// }

// 成功
// resolve();
// container{

// }

// 失败
// reject();
// container{

// }

// 进行中

// container{

// }


(funciton(global){
    //container
    function container(){
        var list = [];
        var fire = funciton(data){
            var len = list.length;
            var index = 0;
            for(;index<len;index++){
                list[index].apply(data[0],data[1]);
            }
        }
        var self = {
            register:funciton(){
                var args = Array.prototype.slice.call(arguments);
                args.forEach(function(fn){
                    if(toString.call(fn) === "[object Function]"){
                        list.push(fn);
                    }
                })
            },
            //自定义函数 上下文绑定  resolve() reject()
            fire:function(){
                self.fireWith(this,arguments);
            }

            fireWith:function(context,args){
                var ret = [context, args];
                fire(ret);
            }
        }

        return self;
    }

    global.container = container;


    function Promise(){
        var tuples = [
            ["resolve","done", container(), "resolved"],
            ["reject", "fail",container(), "rejected"],
            ["notify", "progress", container()]
        ];

        var stateS = "pedding";

        //权限分配
        var RULES = {
            state: funciton(){
                return stateS;
            },
            then:function(){

            },
            promise:function(obj){

            }
        };

        var state={};
        tuples.forEach(function(tuple,i){
           var holder = tuple[2];
           var state = tuple[3];

         //权限分配done fail progress  => self.add   语法糖封装
           RULES[tuple[1]] = holder.add;

           if(state){
               holder.add(function(){
                   stateS = state;
               })
           }
                   //权限分配
           state[tuple[0]] = function(){
              state[tuple[0]+"With"](this===state? RULES: state , this.arguments);
           }
           state[tuple[0]+"With"] = holder.fireWith;
        })
        
        RULES.promise(state);
        return state;
    }

//工具
    function when(result){
        result.promise();
    }

    global.Promise = Promise;
})(this);


var container = container();
container.register(funciton(name){
        consoleo.log('hello container' + name )'
});
container.fire('test');


new Promise();

