import * as React from 'react'

export default class extends React.Component {
  render() {
    return <li>
      <button onClick={() => this.props.onCounterUpdate('minus')}>-</button>
      <button onClick={() => this.props.onCounterUpdate('plus')}>+</button>
      {this.props.caption} Count: {this.props.value}
    </li>
  }
}