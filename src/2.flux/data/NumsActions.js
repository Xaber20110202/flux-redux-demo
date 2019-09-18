import NumsActionTypes from './NumsActionTypes';
import NumsDispatcher from './NumsDispatcher';

const Actions = {
  increaseCount(index) {
    NumsDispatcher.dispatch({
      type: NumsActionTypes.INCREASE_COUNT,
      index,
    });
  },
  decreaseCount(index) {
    NumsDispatcher.dispatch({
      type: NumsActionTypes.DECREASE_COUNT,
      index,
    });
  },
};

export default Actions;
