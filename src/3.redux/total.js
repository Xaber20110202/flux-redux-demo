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