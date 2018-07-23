import * as types from './types';

export function toggleSound() {
  return {
    type: types.TOGGLE_SOUND,
  }
}

export function toggleSoundWorking() {
  return {
    type: types.TOGGLE_SOUND_WORKING,
  }
}

export function toggleSoundBreak() {
  return {
    type: types.TOGGLE_SOUND_BREAK,
  }
}

export function toggleSoundWorkEnd() {
  return {
    type: types.TOGGLE_SOUND_WORK_END,
  }
}

export function toggleSoundBreakEnd() {
  return {
    type: types.TOGGLE_SOUND_BREAK_END,
  }
}

export function toggleTransitions() {
  return {
    type: types.TOGGLE_TRANSITIONS,
  }
}

export function toggleAnimations() {
  return {
    type: types.TOGGLE_ANIMATIONS,
  }
}

export function toggleSleepSetting() {
  return {
    type: types.TOGGLE_SLEEP,
  }
}

export function toggleMediaControls() {
  return {
    type: types.TOGGLE_MEDIA_CONTROLS,
  }
}

export function setWorkLength(val) {
  return {
    type: types.SET_WORK_LENGTH,
    value: val,
  }
}

export function setBreakLength(val) {
  return {
    type: types.SET_BREAK_LENGTH,
    value: val,
  }
}

export function setLongBreakLength(val) {
  return {
    type: types.SET_LONG_BREAK_LENGTH,
    value: val,
  }
}

export const restoreState = (newState) => {
  return {
    type: 'RESTORE_STATE',
    newState
  };
}

export const resetState = (newState) => {
  return {
    type: 'RESET_STATE',
    newState
  };
}