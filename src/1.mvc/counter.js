import * as React from 'react'
import controller from './controller'

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