import * as React from 'react'
import Counter from './counter'
import Total from './total'


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

/**
 * 可以看到，MVC pubsub 的模式，共用了数据源。
 * 现在数据是放在一个地方管理，这样，无论是爷爷的爷爷的组件，也不用层层传递 props
 * 
 * 相对的带来了其他的问题：
 * 1. pubsub、MVC 需要自己实现。而且每个人写法不一致，很容易出现上面类似的 `pubsub.emit('all')` 这样瞎写的东西，难以维护（因此团队还需要 有一个专门的 pubsub、MVC实现，以及规范的定义）
 * 2. 更关键的：为了配合视图更新，controlpanel 和 counter 都要在业务层进行手动监听更新、以及 state 需要单独设置（即：既是在 model 中，也要在组件内 state 做设置）
 * 如果需要更多的数据，就会变成
 * controller.listen(a, () => {
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
    难以维护
 */