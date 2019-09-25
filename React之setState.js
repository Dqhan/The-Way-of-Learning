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
        
        dirtyComponents.push(component);
    }
}