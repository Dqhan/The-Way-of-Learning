function test(a, b) {
    console.log(a); //funciton a(){}
    console.log(c); //funciton c(){}
    var c = 1;  
    console.log(c) //1
    function a() { };
    console.log(b); //'n'
    function c() { }
    var b = function d() { }
    console.log(b); //function d(){}
}
test('m', 'n');

//预加载阶段不执行函数
第一步创建AO
AO{

}
第二步储存 形参以及变量声明到AO中 值为undefined
AO{
    a:undefined
    b:undefined
    c:undefined
}
第三步形参与变量声明统一 (没有形参不做处理)
AO{
    a:m
    b:n 
    c: undefined
}
第四步将函数声明 作为AO的key 函数体为value
AO{
    a:function a(){}
    b:n
    c:function c(){}
}

函数执行 (赋值阶段)