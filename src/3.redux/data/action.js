import * as actionTypes from './actionTypes'

export const increment = (index) => {
  return {
    type: actionTypes.INCREMENT,
    index,
  }
}

export const decrement = (index) => {
  return {
    type: actionTypes.DECREMENT,
    index,
  }
}