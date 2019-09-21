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