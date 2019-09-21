import * as ActionTypes from './actionTypes'
export default (state, action) => {
  const newState = [...state]
  switch (action.type) {
    case ActionTypes.INCREMENT: {
      newState[action.index] += 1
      return newState
    }
    case ActionTypes.DECREMENT:
      newState[action.index] -= 1
      return newState
    default:
      return state
  }
}