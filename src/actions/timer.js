import * as types from './types';

export function startAnimations() {
  return {
    type: types.START_ANIMATIONS,
  }
}

export function startTimer() {
  return {
    type: types.START_TIMER,
  }
}

export function stopTimer() {
  return {
    type: types.STOP_TIMER,
  }
}

export function decrement() {
  return {
    type: types.DECREMENT_TIME,
  }
}

export function setTime(time) {
  return {
    type: types.SET_TIME,
    time: time
  }
}

export function startWork() {
  return {
    type: types.SET_MODE,
    mode: 'work'
  }
}

export function startBreak() {
  return {
    type: types.SET_MODE,
    mode: 'break'
  }
}

export function transitionToWork() {
  return {
    type: types.SET_MODE,
    mode: 'toWork'
  }
}

export function transitionToBreak() {
  return {
    type: types.SET_MODE,
    mode: 'toBreak'
  }
}

export function setStartTime(time) {
  return {
    type: types.SET_START_TIME,
    time: time
  }
}

export const restoreState = (newState) => {
  return {
    type: 'RESTORE_STATE',
    newState
  };
}