# flux redux 前世今生

## 大纲
此文通过 React 实现一个三行计数器的四种写法

* 普通 写法
* MVC 写法
* Flux 写法
* Redux 写法

过程中分析各自对应的问题，以此梳理 MVC、Flux、Redux 脉络，附带

* [Flux 源码分析](https://github.com/Xaber20110202/FedSource/tree/master/2019.09.19%20flux)
* [Redux 源码分析](https://github.com/Xaber20110202/FedSource/tree/master/2019.09.21%20redux)

以此增强理解

![example.png](example.png)

## 普通写法

详见：[0.normal](./src/0.normal/)

```js
// counter
export default class extends React.Component {
  render() {
    return <li>
      <button onClick={() => this.props.onCounterUpdate('minus')}>-</button>
      <button onClick={() => this.props.onCounterUpdate('plus')}>+</button>
      {this.props.caption} Count: {this.props.value}
    </li>
  }
}

// controlpanel
export default class ControlPanel extends React.Component {
  state = {
    nums: [0, 0, 0],
  }
  onCounterUpdate = (type, index) => {
    const { nums } = this.state
    const newNums = [...nums]
    if (type === 'minus') {
      if (nums[index] > 0) {
        newNums[index] = newNums[index] - 1
      }
    } else {
      newNums[index] = newNums[index] + 1
    }

    this.setState({ nums: newNums })
  }
  render() {
    const { nums } = this.state
    return (
      <div>
        俺是普通写法：
        <ul>
          {
            nums.map((num, index) => {
              return <Counter value={num} caption={index} key={index} onCounterUpdate={(type) => this.onCounterUpdate(type, index)} />
            })
          }
        </ul>
        总计数：{nums.reduce((memo, n) => memo + n, 0)}
      </div>
    )
  }
}
```

可以看出，如果仅针对这样的计数组件，这么写其实很完美。

但是，

1. 如果其他地方（例如同级别组件，父级组件的父级组件的兄弟组件）也需要这部分 `nums`，也需要变动这个 `nums` 数据怎么办？
2. 基于问题一，只能层层嵌套，把这部分数据，一层层放到更上层 / 更更上层 / 更更更上层 ... 管理，然后一层层 **props down events up**
3. 问题二的场景，应该属于最大的问题，单身又一个人玩嘛，累就累点，关键以后维护就会比较难了，特别是更多的组件依赖这个 `nums` 数据的时候

然后想到了用 MVC / pubsub 来做，把数据放到单独的地方维护，每次数据更新通过 pubsub 形式，监听到数据变化，再 set 到组件内，进行 View 层渲染

## MVC 写法

详见：[1.mvc](./src/1.mvc/)

```js
// model
export default [0, 0, 0]

// controller
import nums from './model'
const eventStack = {}
const pubsub = {
  on(key, handler) {
    eventStack[key] = handler
  },
  emit(key) {
    eventStack[key](nums[key])
  }
}
export default {
  listen(...params) {
    pubsub.on(...params)
  },
  update(index, count) {
    nums[index] = count
    pubsub.emit(index)
    pubsub.emit('all')
  },
  getNum(index) {
    return nums[index]
  },
  getNums() {
    return nums
  }
}

// counter
export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      num: this.getNum()
    }
  }
  onCounterUpdate = (type) => {
    const { num } = this.state
    if (type === 'minus') {
      if (num > 0) {
        controller.update(this.props.caption, num - 1)
      }
    } else {
      controller.update(this.props.caption, num + 1)
    }
  }
  componentDidMount() {
    controller.listen(this.props.caption, () => {
      this.setState({ num: this.getNum() })
    })
  }
  getNum = () => {
    return controller.getNum(this.props.caption)
  }
  render() {
    return <li>
      <button onClick={() => this.onCounterUpdate('minus')}>-</button>
      <button onClick={() => this.onCounterUpdate('plus')}>+</button>
      {this.props.caption} Count: {this.state.num}
    </li>
  }
}

// total
export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      total: this.getTotal()
    }
  }
  componentDidMount() {
    controller.listen('all', () => {
      this.setState({ total: this.getTotal() })
    })
  }
  getTotal = () => {
    return controller.getNums().reduce((memo, n) => memo + n, 0)
  }
  render() {
    return <div>俺是 Counter 组件爷爷组件的兄弟组件，总计数：{this.state.total}</div>
  }
}

// controlpanel
export default class ControlPanel extends React.Component {
  render() {
    return (
      <div>
        俺是 MVC 写法：
        <div>
          <div>
            <ul>
              {
                [0, 1, 2].map((item) => {
                  return <Counter caption={item} key={item} />
                })
              }
            </ul>
          </div>
        </div>
        <Total />
      </div>
    )
  }
}
```

以上，可以看出，MVC pubsub 的模式，共用了数据源。现在数据是放在一个地方管理，这样，无论是爷爷的爷爷的组件，也不用层层传递 props

相对的带来了其他的问题：

1. pubsub、MVC 需要自己实现。而且每个人写法不一致，很容易出现上面类似的 `pubsub.emit('all')` 这样瞎写的东西，难以维护（因此团队还需要 有一个专门的 pubsub、MVC 实现，以及规范的定义）
2. 更关键的：为了配合视图更新，controlpanel 和 counter 都要在业务层进行手动监听更新、以及 state 需要单独设置（即：既是在 model 中，也要在组件内 state 做设置），在 flux 之前，倒是有人使用 Backbone 做trigger 数据更新，在 componentDidMount 进行事件监听的方式来做，和上面概念差不多
3. 如果需要更多的数据，就会变成这样奇葩的形式

    ```js
    controller.listen(a, () => {
      this.setState({ a: this.getA() })
    })
    controller.listen(b, () => {
      this.setState({ b: this.getB() })
    })
    controller.listen(c, () => {
      this.setState({ c: this.getC() })
    })
    controller.listen(d), () => {
      this.setState({ d: this.getD() })
    })
    ```

那有什么方式可以避免掉 1、2、3 的问题（有什么帮我们封装好了规范、封装好了数据绑定注入？）

于是来到了 Flux

## Flux 写法

详见：[2.flux](./src/1.flux/)

```js
// NumsActionTypes
const ActionTypes = {
  INCREASE_COUNT: 'INCREASE_COUNT',
  DECREASE_COUNT: 'DECREASE_COUNT',
};
export default ActionTypes;

// NumsAction
const Actions = {
  increaseCount(index) {
    NumsDispatcher.dispatch({
      type: NumsActionTypes.INCREASE_COUNT,
      index,
    });
  },
  decreaseCount(index) {
    NumsDispatcher.dispatch({
      type: NumsActionTypes.DECREASE_COUNT,
      index,
    });
  },
};

// NumsDispatcher
import { Dispatcher } from 'flux';
export default new Dispatcher(); 

// NumsStore
class NumsStore extends ReduceStore {
  constructor() {
    super(NumsDispatcher);
  }
  getInitialState() {
    return [0, 0, 0];
  }
  reduce(state, action) {
    switch (action.type) {
      case NumsActionTypes.INCREASE_COUNT: {
        const nums = [...state]
        nums[action.index] += 1
        return nums;
      }
      case NumsActionTypes.DECREASE_COUNT: {
        const nums = [...state]
        nums[action.index] = nums[action.index] > 0 ? nums[action.index] - 1 : 0
        return nums;
      }
      default:
        return state;
    }
  }
}
export default new NumsStore();

// counter
// 注意：此处只放此一种写法，其他写法可见 ./2.flux/counter.js
function getStores(...args) {
  return [
    NumsStore,
  ];
}
function getState(preState, props) {
  return {
    ...props,
    nums: NumsStore.getState(),
    increaseCount: NumsActions.increaseCount,
    decreaseCount: NumsActions.decreaseCount,
  };
}
const Counter = (props) => {
  return <li>
    <button onClick={() => props.decreaseCount(props.caption)}>-</button>
    <button onClick={() => props.increaseCount(props.caption)}>+</button>
    {props.caption} Count: {props.nums[props.caption]}
  </li>
}
// need set withProps true, so that can combile props
export default Container.createFunctional(Counter, getStores, getState, { withProps: true })


// total
import * as React from 'react'
import { Container } from 'flux/utils';
import NumsStore from './data/NumsStore';

function getStores() {
  return [ NumsStore ]
}

function getState() {
  return { nums: NumsStore.getState() }
}

const Total = (props) => {
  return <div>俺是 Counter 组件爷爷组件的兄弟组件，总计数：{props.nums.reduce((memo, n) => memo + n, 0)}</div>
}
export default Container.createFunctional(Total, getStores, getState)
```

先看下 Flux 介绍：

* 一种模式
* 单向数据流
* 老生常谈的四大部分
    * Dispatcher
    * Store
    * Action
    * View

简单从文字出发：

1. 数据的改变，只能通过 Action -> Dispatcher -> Store，Store 数据更新后，再 emit change 事件
2. View 层监听数据的变化，收到 emit 事件后，更新 View

其实也就覆盖了 上方 MVC 模式下 第 1、2 点问题，顺带解决了第 3 点问题

> 1. pubsub、MVC 需要自己实现。而且每个人写法不一致，很容易出现上面类似的 `pubsub.emit('all')` 这样瞎写的东西，难以维护（因此团队还需要 有一个专门的 pubsub、MVC 实现，以及规范的定义）
> 2. 更关键的：为了配合视图更新，controlpanel 和 counter 都要在业务层进行手动监听更新、以及 state 需要单独设置（即：既是在 model 中，也要在组件内 state 做设置），在 flux 之前，倒是有人使用 Backbone 做trigger 数据更新，在 componentDidMount 进行事件监听的方式来做，和上面概念差不多
> 3. 如果需要更多的数据，就会变成这样奇葩的形式

1. 因为 `Action -> Dispatcher -> Store` 定义，开发人员不再需要去实现 pubsub、MVC，此部分 Flux 已经定义并实现了，只要遵从规范写法即可
2. Flux 给原有的组件，做了一层包裹，将需要的 Store 的数据，监听、注入到组件内。组件也不再需要手动监听
3. 连带着 Store 数据的注入，依赖多数据的情况下，也就不需要手动编写各种 监听函数、callback，而只要进行相应代码范式，注入数据即可

即 Flux：

1. 定义了一种格式 / 规范，帮你实现了数据更新的方式，不需要手动实现 pubsub
2. 帮你实现了数据变化，响应到 View 的操作，不需要再进行 手动处理监听，再将数据重新set 到 View State 的处理

Flux 的处理，可以说，已经 90% 完美了

如果对于 Flux 如何实现此两步骤感兴趣，可以移步至 [Flux 源码分析 —— 2019.09.19](https://github.com/Xaber20110202/FedSource/tree/master/2019.09.19%20flux)

**但是**

> 1. 因为 `FluxStoreGroup` 限定了所有传入的 `store` 的 `dispatcher` 必须为同一个，这也就意味着，如果要把不同的 `store` 整合进一个 `component`，那就必须使用相同的 `dispatcher` 去初始化这些 `store`，其实也就意味着，基本上你只需要一个 `new Dispatcher` 出来
> 2. 多数据 store，可能存在数据间的依赖，尽管 flux 设计了 `waitFor`，也非常巧妙，但在使用者纬度上看起来，还是比较取巧（更希望的是，一次性把数据变更完）
> 3. `Container` 的包裹是以继承原 类型 的形式来做的，最终数据被集成在 `this.state` 内，而函数式组件，数据集成则需要通过 `props` 获取，详细可见：[counter.js - 2.flux](https://github.com/Xaber20110202/flux-redux-demo/blob/master/src/2.flux/counter.js)
> 4. 数据变更的 `log` 记录，需要手动 `xxStore.addListener` 的方式，或者注释掉 Flux 源码内的这行有趣的代码 [FluxContainerSubscriptions console.log](https://github.com/Xaber20110202/FedSource/blob/master/2019.09.19%20flux/7.FluxContainerSubscriptions.js#L79)
> 5. 因为 `getInitialState` 数据定义 和 `reduce` 数据更新方式，限定必须在 Store 的继承类上实现，因此只要一改动 `reduce` 代码，hotreload 进行之后，相应的原来网页上已经触发变化的 数据 状态，又会回到 `initialState`
> 6. 以及两外两个缺陷（引用摘自 [《看漫画，学 Redux》 —— A cartoon intro to Redux](https://github.com/jasonslyvia/a-cartoon-intro-to-redux-cn)）
>     1. 插件体系：不易于扩展，没有合适的位置实现第三方插件
>     2. 时间旅行（撤回 / 重做）功能：~~每次触发 action 时状态对象都被直接改写了~~，个人理解，因为 flux 定义多个 store，而且没有插件系统，难以实现 时间旅行 功能

于是，俺们就又来到了 Redux 门前

## Redux 写法

```js
// actionTypes.js
export const INCREMENT = 'INCREMENT'
export const DECREMENT = 'DECREMENT'

// action.js
import * as actionTypes from './actionTypes'
export const increment = (index) => {
  return {
    type: actionTypes.INCREMENT,
    index,
  }
}
export const decrement = (index) => {
  return {
    type: actionTypes.DECREMENT,
    index,
  }
}

// reducer.js
import * as ActionTypes from './actionTypes'
export default (state, action) => {
  const newState = [...state]
  switch (action.type) {
    case ActionTypes.INCREMENT: {
      newState[action.index] += 1
      return newState
    }
    case ActionTypes.DECREMENT:
      newState[action.index] -= 1
      return newState
    default:
      return state
  }
}

// store.js
import { createStore } from 'redux'
import reducer from './reducer'
const initValues = [0, 0, 0]
export default createStore(reducer, initValues)

// count.js
import * as React from 'react'
import { connect } from 'react-redux'
import * as ActionTypes from './data/actionTypes'
class Counter extends React.Component {
  render() {
    const { decreaseCount, increaseCount, num, caption } = this.props
    return <li>
      <button onClick={() => decreaseCount(caption, num)}>-</button>
      <button onClick={() => increaseCount(caption)}>+</button>
      {caption} Count: {num}
    </li>
  }
}
const mapStateToProps = (state, props) => {
  return {
    num: state[props.caption],
  }
}
const mapDispatchToProps = (dispatch, props) => {
  return {
    decreaseCount(caption, num) {
      if (num > 0) {
        dispatch({
          type: ActionTypes.DECREMENT,
          index: caption,
        })
      }
    },
    increaseCount(caption) {
      dispatch({
        type: ActionTypes.INCREMENT,
          index: caption,
      })
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Counter)

// total.js
import * as React from 'react'
import { connect } from 'react-redux'

const Total = (props) => {
  return <div>俺是 Counter 组件爷爷组件的兄弟组件，总计数：{props.total}</div>
}
const mapStateToProps = (state/* nums */, props) => {
  return {
    total: state.reduce((memo, n) => memo + n, 0)
  }
}
export default connect(mapStateToProps)(Total)

// controlpanel.js
export default class ControlPanelWrap extends React.Component {
  render() {
    return <Provider store={store}>
      <ControlPanel />
    </Provider>
  }
}
```

初看情况下，感觉上就是代码编写方式有一些差异。但实际其内部实现已经有了比较大的变化。

如果对于 Redux 如何实现感兴趣，可以移步至 [Redux 源码分析 —— 2019.09.21](https://github.com/Xaber20110202/FedSource/tree/master/2019.09.21%20redux)

以及上述 flux 缺陷是如何处理的，也就一目了然

1. 只有一个 dispatch 方法，在 store 上
2. 单一数据源： 一个 store
3. `Container` 的功能，单独放在 `react-redux` 上，将 `redux` 部分作为精确 / 精简 / 细分的模块，只负责数据更新、插件系统部分
4. 通过 `applyMiddleWare`、`enhancer` 和 `componse`，实现完整 / 完善 / 优美的 插件 / 增强 系统，当然也包括 `logger`、`thunk` 等等
5. 将 `reduce` 部分 和 `store` 部分分开，单独提供了一个 `replaceReducer`，用于实现 hotReload 但是将原来 `store.getState()` 已经变更的数据又重新初始化
6. 另外两个解决
    1. 插件系统，上方已提到
    2. 时间旅行（撤回 / 重做）的工具 [redux-devtools](https://github.com/reduxjs/redux-devtools)

## 其他
此文 部分参考 [揭秘 React 状态管理](https://github.com/happylindz/react-state-management-tutorial)，并做了相关精简。