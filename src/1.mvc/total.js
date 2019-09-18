import * as React from 'react'
import controller from './controller'

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