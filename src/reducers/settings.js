import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

const initialState = {
  sound: {
    enabled: true,
    working: true,
    break: true,
    workEnd: true,
    breakEnd: true
  },
  transitions: true,
  animations: true,
  preventSleep: false,
  workLength: 1500,
  breakLength: 300,
  longBreakLength: 1500,
  showMediaControls: false,
};

export const settings = (state, action) => {
  if (typeof state === 'undefined') {
    return initialState;
  }

  switch (action.type) {
    case 'TOGGLE_SOUND':
      return { ...state,
        sound: { ...state.sound,
          enabled: !state.sound.enabled
        }
      };

    case 'TOGGLE_SOUND_WORKING':
      return { ...state,
        sound: { ...state.sound,
          working: !state.sound.working
        }
      };

    case 'TOGGLE_SOUND_BREAK':
      return { ...state,
        sound: { ...state.sound,
          break: !state.sound.break
        }
      };

    case 'TOGGLE_SOUND_WORK_END':
      return { ...state,
        sound: { ...state.sound,
          workEnd: !state.sound.workEnd
        }
      };

    case 'TOGGLE_SOUND_BREAK_END':
      return { ...state,
        sound: { ...state.sound,
          breakEnd: !state.sound.breakEnd
        }
      };

    case 'TOGGLE_TRANSITIONS':
      return { ...state,
        transitions: !state.transitions
      };

    case 'TOGGLE_ANIMATIONS':
      return { ...state,
        animations: !state.animations
      };

    case 'TOGGLE_SLEEP':
      return { ...state,
        preventSleep: !state.preventSleep
      };

    case 'TOGGLE_MEDIA_CONTROLS':
      return { ...state,
        showMediaControls: !state.showMediaControls
      };

    case 'SET_WORK_LENGTH':
      return { ...state,
        workLength: action.value
      };

    case 'SET_BREAK_LENGTH':
      return { ...state,
        breakLength: action.value
      };

    case 'SET_LONG_BREAK_LENGTH':
      return { ...state,
        longBreakLength: action.value
      };

    case 'RESTORE_STATE':
      if (!action.newState.settings) return { ...initialState };
      const s = { ...action.newState.settings };
      const newSettings = {
        sound: {
          enabled: (s.sound && typeof s.sound.enabled !== 'undefined') ? s.sound.enabled : initialState.sound.enabled,
          working: (s.sound && typeof s.sound.working !== 'undefined') ? s.sound.working : initialState.sound.working,
          break: (s.sound && typeof s.sound.break !== 'undefined') ? s.sound.break : initialState.sound.break,
          workEnd: (s.sound && typeof s.sound.workEnd !== 'undefined') ? s.sound.workEnd : initialState.sound.workEnd,
          breakEnd: (s.sound && typeof s.sound.breakEnd !== 'undefined') ? s.sound.breakEnd : initialState.sound.breakEnd,
        },
        transitions: (typeof s.transitions !== 'undefined') ? s.transitions : initialState.transitions,
        animations: (typeof s.animations !== 'undefined') ? s.animations : initialState.animations,
        preventSleep: (typeof s.preventSleep !== 'undefined') ? s.preventSleep : initialState.preventSleep,
        workLength: (typeof s.workLength !== 'undefined') ? s.workLength : initialState.workLength,
        breakLength: (typeof s.breakLength !== 'undefined') ? s.breakLength : initialState.breakLength,
        longBreakLength: (typeof s.longBreakLength !== 'undefined') ? s.longBreakLength : initialState.longBreakLength,
        showMediaControls: (typeof s.showMediaControls !== 'undefined') ? s.showMediaControls : initialState.showMediaControls,
      };
      return newSettings;

    case 'RESET_STATE':
      return { ...initialState };

    default:
      return state;
  }
};