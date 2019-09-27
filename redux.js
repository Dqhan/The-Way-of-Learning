/**
 * 什么是redux，redux简单的将就是状态管理器，redux与react是完全不相干的两个东西
 */
/**
 * 什么是状态，数据就是状态啊
 */
let state = {
    value: 1
}

console.log(state.value); //1

/**
 * 咱们改下状态
 */

state.value = 2;

console.log(state.value) //2

/**
 * 用发布订阅的方式来维护一套状态呢~
 */

let state = {
    count: 1
}

let listeners = [];

function subscribe(listener) {
    listeners.push(listener);
}

function changeCount(count) {
    state.count = count;
    for (let i = 0; i < listeners.length; i++) {
        if (toString.call(listeners[i]) !== "[object Function]") {
            listeners[i]();
        }
    }
}

subscribe(() => {
    console.log(state.count);
})

changeCount(2);
changeCount(3);
changeCount(4);

/**涉及了三个定义
 * state
 * subscribe
 * changeCount
 */

/**
 * 我们要创建一个容器，这个容器叫store
 * 我们要兼容上面三个含义
 * 我们对store进行封装
 */

function createStore(initState) {
    let state = initState || {};
    let listeners = [];

    function subscribe(listener) {
        listeners.push(listener);
    };

    function changeState(newState) {
        state = newState;
        for (let i = 0; i < listeners.length; i++) {
            if (toString.call(listeners[i]) === '[object Function]') {
                listeners[i]();
            }
        }
    }

    function getState() {
        return state;
    }

    return {
        getState,
        subscribe,
        changeState
    }
}

/**
 * 使用下
 */

let state = {

};

let store = createStore(state);

store.subscribe(() => {
    let state = store.getState();
    console.log(state);
})

store.changeState({
    ...store.getState(),
    info: {
        name: 'dqhan'
    }
});

/**
 * 给store定制个规则rule
 * 告诉changeState 按照我们的规则执行
 */

function rule(state, action) {
    switch (action.type) {
        case "demo1":
            return {
                ...state,
                info: {
                    name: 'demo1'
                }
            }
        case "demo2":
            return {
                ...state,
                info: {
                    name: 'demo2'
                }
            }
        default:
            return state;
    }
}

/**
 * 我们告诉store 你要按照这个rule来
 */

function createStore(rule, initState) {
    let state = initState || {};
    let listeners = [];

    function subscribe(listener) {
        listeners.push(listener);
    };

    function changeState(action) {
        state = rule(state, action);
        for (let i = 0; i < listeners.length; i++) {
            if (toString.call(listeners[i]) === '[object Function]') {
                listeners[i]();
            }
        }
    }

    function getState() {
        return state;
    }

    return {
        getState,
        subscribe,
        changeState
    }
}

let state = {

}

function rule(state, action) {
    switch (action.type) {
        case "demo1":
            return {
                ...state,
                info: {
                    name: 'demo1'
                }
            }
        case "demo2":
            return {
                ...state,
                info: {
                    name: 'demo2'
                }
            }
        default:
            return state;
    }
}
let store = createStore(rule, state);

store.subscribe(() => {
    let state = store.getState();
    console.log('ssss');
});

store.changeState({
    type:'demo1'
});

store.changeState({
    type:'demo2'
});

/**
 * 我们把rule 跟 changeState 换个名好不好
 * rule => reducer
 * changeState => dispatch
 */

function reducer(state, action) {
    switch (action.type) {
        case "demo1":
            return {
                ...state,
                info: {
                    name: 'demo1'
                }
            }
        case "demo2":
            return {
                ...state,
                info: {
                    name: 'demo2'
                }
            }
        default:
            return state;
    }
}

let store = createStore(reducer, state);

store.subscribe(() => {
    let state = store.getState();
    console.log('ssss');
});

store.dispatch({
    type:'demo1'
});

store.dispatch({
    type:'demo2'
});



