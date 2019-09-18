import * as React from 'react'
import {Container} from 'flux/utils';

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


export default Container.createFunctional(Counter, getStores, getState, { withProps: true })