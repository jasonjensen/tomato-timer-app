// import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

const initialState = {
  time: 1500,
  running: false,
  starting: false,
  mode: 'work',
  startTime: 0,
  timeLeftAtStart: 0,
};

export const timer = (state, action) => {
  if (typeof state === 'undefined') {
    return initialState;
  }

  switch (action.type) {
    case 'START_ANIMATIONS':
      return { ...state, starting: true };

    case 'START_TIMER':
      const time = Math.max(0, state.time - 1);
      return { ...state, 
        running: true, 
        time: time, 
        timeLeftAtStart: time,
        startTime: Date.now(),
        starting: false 
      };

    case 'STOP_TIMER':
      return { ...state, running: false, starting: false };

    case 'DECREMENT_TIME':
      const expectedTime = state.timeLeftAtStart - Math.floor((Date.now() - state.startTime) / 1000);
      const newTime = (state.running) ? Math.max(0, expectedTime) : state.time;
      return { ...state, time: newTime };

    case 'SET_TIME':
      return { ...state, time: action.time };

    case 'SET_MODE':
      return { ...state, mode: action.mode };

    case 'SET_START_TIME':
      return { ...state, startTime: Date.now(), timeLeftAtStart: action.time };

    case 'SET_WORK_LENGTH': {
      if (state.mode === 'work' && !state.running) {
        return { ...state, time: action.value };
      } else {
        return { ...state };
      }
    }

    case 'SET_BREAK_LENGTH': {
      if (state.mode === 'break' && !state.running) {
        return { ...state, time: action.value };
      } else {
        return { ...state };
      }
    }

    // case 'RESTORE_STATE':
    //   return { ...action.newState.timer };

    default:
      return state;
  }
};

