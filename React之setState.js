/**
 * React思想
 * React作为View层，通过data改变从而引发UI更新
 * React不想Vue这种MVVM库，修改data并不能直接使UI发生变化，需要调用setState对state进行变化，从而达到UI变化
 */

/**
 * setState函数签名
 * setState(partialState,callback)
 */

/**
 * 例子
 */
class Dome extends React.Component() {
    constructor(props) {
        super(props);
        this.state = {
            value: 1
        }
    }

    _btnClickHandler() {
        /**
         * 方法1
         * 结果value增加1次
         */
        this.setState({
            value: this.state.value + 1
        })
        this.setState({
            value: this.state.value + 1
        })

        /**
         * 方法2
         * 结果value增加2次
         */
        this.setState((preState, props) => {
            return {
                value: preState.value + 1
            }
        })
        this.setState((preState, props) => {
            return {
                value: preState.value + 1
            }
        })

        /**
         * 方法2
         * 结果value增加2次
         */

        setTimeout(() => {
            this.setState({
                value: this.state.value + 1
            })
            this.setState({
                value: this.state.value + 1
            })
        })
    }

    render() {
        return <div>
            <div>{this.state.value}</div>
            <button onClick={: :this._btnClickHandler}>Click</button>
        </div >
    }
}
/**
 * React通过setState()来设置state，但是不能保证this.state会立即被更新
 * 因此我们不能说setState是同步也不能说setState是异步的，因为state可能批量更新
 * 正确的用法应该是采用回调函数
 * 那么问题来了，怎么时候才能同步更新，什么时候又异步更新呢
 */

/**
 * React组件的继承来自于React.Component,setState来自于React.Component，因此对于组件来讲，setState是React.Component的原型方法
 * 那么setState的定义是啥样的呢
 */

function ReactComponent(props, context, updater) {
    this.props = props;
    this.context = context;
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
}

ReactComponent.prototype.setState = function (partialState, callback) {
    this.updater.enqueueSetState(this, partialState);
    if (callback) {
        this.updater.enqueueCallback(this, callback);
    }
};

/**
 * updater
 * 每个Component都有一个updater，用来驱动state更新的对象
 * ReactNoopUpdateQueue没有实际意义，知识当做一个初始化的过程
 * 真正的updater是在render时注入的
 * 所以这就是为啥构造函数中调用setState会发出警告，原因就是因为updater，当然也也没有实际意义
 * 总结就是在未渲染或者已卸载的Component中是不可以使用setState的
 */

var updater = {
    enqueueSetState: function (partialState) {
        //在非生产环境中起到了警告作用
    },
    enqueueCallback: function () {

    }
}

/**
 * 真正updater的注册过程中
 * inst.updater = ReactUpdateQueue;
 */

var ReactUpdateQueue = {
    enqueueSetState: function (publicInstance, partialState) {
        var internalInstance = getInterInstanceReadyForUpdate(publicInstance, 'setState');
        if (!internalInstance) return;
        var queue = internalInstance._pendingStateQueue || (internaleInstance._pendingStateQueue = []);
        queue.push(partialState);
        enqueueUpdate(internalInstance);
    }
}

/**
 * internalInstance 实力就是组件实力的React内部表达式其中包含 _pendingStateQueue 和 _pendingCallbacks
 * _pendingStateQueue   待更新队列
 * _pendingCallbacks    回调队列
 */

//获取queue 
var queue = internalInstance._pendingStateQueue || [];
//将partialState加入待更新state队列
queue.push(partialState);
//更新队列
enqueueUpdate(internalInstance);

/**
 * enqueueUpdate干了什么事儿
 */
function enqueueUpdate(internalInstance) {
    ReactUpdates.enqueueUpdate(internalInstance);
}

var ReactUpdates = {
    enqueueUpdate: function enqueueUpdate(component) {
        ensureInjected();
        if (!batchingStrategy.isBatchingUpdates) {
            batchingStrategy.batchedUpdates(enqueueUpdate, component);
            return;
        }

        dirtyComponents.push(component);   //component 就是internalInstance  即 component在react内部的实例表达
    }
}

/**
 * 如果batchingStrategy.isBatchingUpdates的值是true，表示当前正在处于批量更新中，直接讲component加入队列，
 * 否则执行 batchingStrategy.batchedUpdates
 * 那么 batchingStrategy.batchedUpdates 干了什么呢
 */

var ReactDefaultBatchingStrategy = {
    isBatchingUpdates: false,
    batchedUpdates: function (callback, a, b, c, d, e) {
        var alreadyBatchUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;
        ReactDefaultBatchingStrategy.isBatchingUpdates = true;
        if (alreadyBatchUpdates) {
            callback(a, b, c, d, e);
        } else {
            transaction.perform(callback, null, a, b, c, d, e);
        }
    }
}

/**
 * isBatchingUpdates 表示是否处于批量更新中
 */

/**
 * transaction 事务
 */

/**
* <pre>
*                       wrappers (injected at creation time)
*                                      +        +
*                                      |        |
*                    +-----------------|--------|--------------+
*                    |                 v        |              |
*                    |      +---------------+   |              |
*                    |   +--|    wrapper1   |---|----+         |
*                    |   |  +---------------+   v    |         |
*                    |   |          +-------------+  |         |
*                    |   |     +----|   wrapper2  |--------+   |
*                    |   |     |    +-------------+  |     |   |
*                    |   |     |                     |     |   |
*                    |   v     v                     v     v   | wrapper
*                    | +---+ +---+   +---------+   +---+ +---+ | invariants
* perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
* +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
*                    | |   | |   |   |         |   |   | |   | |
*                    | |   | |   |   |         |   |   | |   | |
*                    | |   | |   |   |         |   |   | |   | |
*                    | +---+ +---+   +---------+   +---+ +---+ |
*                    |  initialize                    close    |
*                    +-----------------------------------------+
* </pre>
* 
* React transaction会把方法封装成一个一个的wrapper， 每个wrapper都有两个方法，initialize 与 close
* 当方法执行的时候 首先需要执行以下transaction 的perform 然后执行wrapper.initialize 然后执行方法本身，然后执行wrapper.close
* 过程： transaction.proform  =>   wrapper.initialize  => fn => wrapper.close 
*/

var RESET_BATCHED_UPDATES = {
    initialize: emptyFunction,
    colse: function () {
        ReactDefaultBatchingStrategy.isBatchingUpdates = false;
    }
}

var FLUSH_BATCHED_UPDATES = {
    initialize: emptyFunction,
    close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates), //flushBatchedUpdates   virtual dom 与 真实dom的映射
}

var TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];


function ReactDefaultBatchingStrategyTransaction() {
    this.reinitializeTransaction();
}

Object.assign(
    ReactDefaultBatchingStrategyTransaction.prototype,
    Transaction.Mixin,
    {
        getTransactionWrappers: function () {
            return TRANSACTION_WRAPPERS;
        },
    }
);

var transaction = new ReactDefaultBatchingStrategyTransaction();

/**
 * 一个transaction 包含一个wrapper数组，这个wrapper数组包含两个wrapper，RESET_BATHED_UPDATES跟FLUSH_BATCHED_UPDATES
 * transaction => wrapper =>{
 *                                 1,RESET_BATCHED_UPDATES
 *                                 2,FLUSH_BATCHED_UPDATES
 *                          }
 */

/**
 *  回顾 setState 更新过程
 *  如果处于批量跟新过程中（isBatchingUpdates == true）直接将component 加入dirtyComponents队列中
 *  如果不是，开启批量更新 => enqueueUpdata
 *  开启批量更新的过程 transaction.perform => wrapper.initialize => enqueueUpdata => wrapper.close  => (isBatchingUpdates == false)
 *  component 加入 dirtyComponents 之后发生了什么呢
 */

/**
 * batchedUpdates内执行了一个事务，该事务处于close阶段做了两件事
 * 1  ReactDefaultBatchingStrategy.isBatchingUpdates 设置成false 表示关闭批量更新
 * 2  调用ReactUpdates.flushBatchedUpdates   ， flushBatchedUpdates中涉及virtual dom 与真实dom的映射
 */

var flushBatchedUpdates = function () {
    while (dirtyComponents.length) {
        if (dirtyComponents.length) {
            var transaction = ReactUpdatesFlushTransaction.getPooled();
            transaction.perform(runBatchedUpdates, null, transaction);
            ReactUpdatesFlushTransaction.release(transaction);
        }
        //......
    }
};

/**
 * ReactUpdatesFlushTransaction中的wrapper定义
 */

var UPDATE_QUEUEING = {
    initialize: function() {
      this.callbackQueue.reset();
    },
    close: function() {
      this.callbackQueue.notifyAll();
    },
  };

/**
 * 会发现flushBatchedUpdates中运行了一个事务，函数主体runBatchedUpdates
 * runBatchedUpdates做了什么事儿
 */

function runBatchedUpdates(transaction) {
    var len = transaction.dirtyComponentsLength;
    dirtyComponents.sort(mountOrderComparator);

    for (var i = 0; i < len; i++) {
        var component = dirtyComponents[i];
        var callbacks = component._pendingCallbacks;
        component._pendingCallbacks = null;
        //.....
        ReactReconciler.performUpdateIfNecessary(component, transaction.reconcileTransaction);
        //.......
        if (callbacks) {
            for (var j = 0; j < callbacks.length; j++) {
                transaction.callbackQueue.enqueue(
                    callbacks[j],
                    component.getPublicInstance()
                );
            }
        }
    }
}

/**
 * 执行setState的回调函数，执行ReactReconciler.performUpdateIfNecessary
 * ReactReconciler.performUpdateIfNecessary 干了什么
 */

function performUpdateIfNecessary(internalInstance, transaction) {
    internalInstance.performUpdateIfNecessary(transaction);
}
var ReactCompositeComponentMixin = {
    performUpdateIfNecessary: function (transaction) {
        //......
        if (this._pendingStateQueue !== null || this._pendingForceUpdate) {
            this.updateComponent(
                transaction,
                this._currentElement,
                this._currentElement,
                this._context,
                this._context
            );
        }
    }
}
/**
 * 上面代码是perfromUpdateIfNecessary的省略版本，主要调用的其中的this.updateComponent方法:
 */
function updateComponent(
    transaction,
    prevParentElement,
    nextParentElement,
    prevUnmaskedContext,
    nextUnmaskedContext
) {
    var inst = this._instance;
    var willReceive = false;
    var nextContext;
    var nextProps;

    // 验证组件context是否改变
    // ......

    // 验证是否是props更新还是组件state更新
    if (prevParentElement === nextParentElement) {
        nextProps = nextParentElement.props;
    } else {
        //存在props的更新  
        nextProps = this._processProps(nextParentElement.props);
        willReceive = true;
    }
    //根据条件判断是否调用钩子函数componentWillReceiveProps
    if (willReceive && inst.componentWillReceiveProps) {
        inst.componentWillReceiveProps(nextProps, nextContext);
    }
    //计算新的state
    var nextState = this._processPendingState(nextProps, nextContext);

    var shouldUpdate =
        this._pendingForceUpdate ||
        !inst.shouldComponentUpdate ||
        inst.shouldComponentUpdate(nextProps, nextState, nextContext);

    if (shouldUpdate) {
        this._pendingForceUpdate = false;
        this._performComponentUpdate(
            nextParentElement,
            nextProps,
            nextState,
            nextContext,
            transaction,
            nextUnmaskedContext
        );
    } else {
        this._currentElement = nextParentElement;
        this._context = nextUnmaskedContext;
        inst.props = nextProps;
        inst.state = nextState;
        inst.context = nextContext;
    }
}

/**
 * 计算state
 */

function _processPendingState(props, context) {
    var inst = this._instance;
    var queue = this._pendingStateQueue;
    var replace = this._pendingReplaceState;
    this._pendingReplaceState = false;
    this._pendingStateQueue = null;

    if (!queue) {
      return inst.state;
    }

    if (replace && queue.length === 1) {
      return queue[0];
    }

    var nextState = Object.assign({}, replace ? queue[0] : inst.state);
    for (var i = replace ? 1 : 0; i < queue.length; i++) {
      var partial = queue[i];
      Object.assign(
        nextState,
        typeof partial === 'function' ?
          partial.call(inst, nextState, props, context) :
          partial
      );
    }

    return nextState;
  }
}

//如果我们传入对象是
this.setState({
    value: this.state.value + 1
})

this.setState({
    value:this.state.value +1 
})

function _performComponentUpdate(
    nextElement,
    nextProps,
    nextState,
    nextContext,
    transaction,
    unmaskedContext
  ) {
    var inst = this._instance;

    var hasComponentDidUpdate = Boolean(inst.componentDidUpdate);
    var prevProps;
    var prevState;
    var prevContext;
    if (hasComponentDidUpdate) {
      prevProps = inst.props;
      prevState = inst.state;
      prevContext = inst.context;
    }

    if (inst.componentWillUpdate) {
      inst.componentWillUpdate(nextProps, nextState, nextContext);
    }

    this._currentElement = nextElement;
    this._context = unmaskedContext;
    inst.props = nextProps;
    inst.state = nextState;
    inst.context = nextContext;

    this._updateRenderedComponent(transaction, unmaskedContext);

    if (hasComponentDidUpdate) {
      transaction.getReactMountReady().enqueue(
        inst.componentDidUpdate.bind(inst, prevProps, prevState, prevContext),
        inst
      );
    }
}


