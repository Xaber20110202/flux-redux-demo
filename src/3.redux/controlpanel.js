import * as React from 'react'
import { Provider } from 'react-redux'
import store from './data/store'
import Counter from './counter'
import Total from './total'

class ControlPanel extends React.Component {
  render() {
    return (
      <div>
        俺是 Redux 写法：
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

export default class ControlPanelWrap extends React.Component {
  render() {
    return <Provider store={store}>
      <ControlPanel />
    </Provider>
  }
}