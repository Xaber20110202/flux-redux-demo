import { ReduceStore } from 'flux/utils'

import NumsActionTypes from './NumsActionTypes'
import NumsDispatcher from './NumsDispatcher';

class NumsStore extends ReduceStore {
  constructor() {
    super(NumsDispatcher);
  }

  getInitialState() {
    return [0, 0, 0];
  }

  reduce(state, action) {
    switch (action.type) {
      case NumsActionTypes.INCREASE_COUNT: {
        const nums = [...state]
        nums[action.index] += 1
        return nums;
      }

      case NumsActionTypes.DECREASE_COUNT: {
        const nums = [...state]
        nums[action.index] = nums[action.index] > 0 ? nums[action.index] - 1 : 0
        return nums;
      }

      default:
        return state;
    }
  }
}

export default new NumsStore();
