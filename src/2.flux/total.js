import * as React from 'react'
import {Container} from 'flux/utils';

import NumsStore from './data/NumsStore';

function getStores() {
  return [
    NumsStore,
  ];
}

function getState() {
  return {
    nums: NumsStore.getState(),
  };
}

const Total = (props) => {
  return <div>俺是 Counter 组件爷爷组件的兄弟组件，总计数：{props.nums.reduce((memo, n) => memo + n, 0)}</div>
}

export default Container.createFunctional(Total, getStores, getState)