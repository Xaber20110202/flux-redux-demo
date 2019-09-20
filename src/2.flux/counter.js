import * as React from 'react'
import { Container, Mixin } from 'flux/utils';
import * as createClass from 'create-react-class'

import NumsActions from './data/NumsActions';
import NumsStore from './data/NumsStore';

function getStores(...args) {
  console.log('args', ...args)
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
// export default Container.createFunctional(Counter, getStores, getState, { withProps: true })


// 不能用 class 写法，会报错
function Counter2 () {
  React.Component.call(this)
  this.render = function () {
    // 注意 这里是 state
    const { decreaseCount, increaseCount, nums, caption } = this.state
    return <li>
      <button onClick={() => decreaseCount(caption)}>-</button>
      <button onClick={() => increaseCount(caption)}>+</button>
      {caption} Count: {nums[caption]}
    </li>
  }
}

Counter2.prototype = Object.create(React.Component.prototype)
Counter2.getStores = getStores
Counter2.calculateState = getState

// export default Container.create(Counter2, { withProps: true })


// using Mixin
var Counter3 = createClass({
  mixins: [
    Mixin([NumsStore], { withProps: true })
  ],
  statics: {
    calculateState: getState,
  },
  render() {
    // 注意 这里是 state
    const { decreaseCount, increaseCount, nums, caption } = this.state
    return <li>
      <button onClick={() => decreaseCount(caption)}>-</button>
      <button onClick={() => increaseCount(caption)}>+</button>
      {caption} Count: {nums[caption]}
    </li>
  }
});

export default Counter3