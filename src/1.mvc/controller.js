import nums from './model'

const eventStack = {}

const pubsub = {
  on(key, handler) {
    eventStack[key] = handler
  },
  emit(key) {
    eventStack[key](nums[key])
  }
}

export default {
  listen(...params) {
    pubsub.on(...params)
  },
  update(index, count) {
    nums[index] = count
    pubsub.emit(index)
    pubsub.emit('all')
  },
  getNum(index) {
    return nums[index]
  },
  getNums() {
    return nums
  }
}