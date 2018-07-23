// import createReducer from '../lib/createReducer';
import * as types from '../actions/types';

const _generateDates = () => {
  let times = [];
  let now = Date.now();
  let dayLength = 60*60*24*1000;
  for (var i = 0; i<40;i++ ) {
    if (Math.random() > 0.7) continue;
    var numberForDay = Math.round(Math.random() * 8);
    // var newDay = new Date(now - dayLength * i);
    // if (newDay.getDay() > 5 || newDay.getDay() === 0) numberForDay = 0;
    for (var j = 0; j < numberForDay; j++) {
      times.push(now - dayLength * i - j * 60000);
    }
  }
  return times;
};

const initialState = {
  previous: [],
  today: 0,
  todayStart: 0,
  includeEmptyDays: false,
  includeWeekends: true,
};

export const logs = (state, action) => {
  if (typeof state === 'undefined') {
    return initialState;
  }

  switch (action.type) {
    case 'SET_DAY_START':
      const completed = (state.todayStart !== action.time) ? 0 : state.today;
      return { ...state, todayStart: action.time, today: completed };

    case 'ADD_TO_LOGS':
      return { ...state, previous: state.previous.concat([Date.now()]) };

    case 'SET_LOGS':
      return { ...state, previous: actions.logs };

    case 'INCREMENT_TODAY':
      return { ...state, today: state.today + 1 };

    case 'TOGGLE_EMPTY_DAYS':
      return { ...state, includeEmptyDays: !state.includeEmptyDays};

    case 'TOGGLE_WEEKENDS':
      return { ...state, includeWeekends: !state.includeWeekends}

    case 'RESTORE_STATE':
      if (!action.newState.logs) return { ...initialState };
      const r = { ...action.newState.logs };
      const newLogs = {
        previous: (typeof r.previous !== 'undefined') ? r.previous : initialState.previous,
        today: (typeof r.today !== 'undefined') ? r.today : initialState.today,
        todayStart: (typeof r.todayStart !== 'undefined') ? r.todayStart : initialState.todayStart,
        includeEmptyDays: (typeof r.includeEmptyDays !== 'undefined') ? r.includeEmptyDays : initialState.includeEmptyDays,
        includeWeekends: (typeof r.includeWeekends !== 'undefined') ? r.includeWeekends : initialState.includeWeekends,
      };
      return newLogs;

    case 'RESET_STATE':
      return { ...initialState };

    default:
      return state;
  }
};

