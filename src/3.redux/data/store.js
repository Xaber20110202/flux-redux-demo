import { createStore } from 'redux'
import reducer from './reducer'

const initValues = [0, 0, 0]
export default createStore(reducer, initValues)

