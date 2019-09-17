import * as React from 'react'
import Counter from './counter'


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

/**
 * 如果仅针对这样的计数组件，这么写其实很完美
 * 问题：
 * 1. 如果其他地方（例如同级别组件，父级组件的父级组件的兄弟组件）也需要这部分 nums，也需要变动这个 nums 数据怎么办？
 * 2. 基于问题一，只能层层嵌套，把这部分数据，一层层放到更上层 / 更更上层 / 更更更上层 ... 管理，然后一层层 props down events up
 * 3. 问题二的场景，应该属于最大的问题，单身又一个人玩嘛，累就累点，关键以后维护就会比较难了，特别是更多的组件依赖这个 nums 数据的时候，
 */