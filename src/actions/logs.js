import * as types from './types';

export function incrementTodayCount() {
  return {
    type: types.INCREMENT_TODAY,
  }
}

export function logCompletedSession() {
  return {
    type: types.ADD_TO_LOGS,
  }
}

export function setLogs() {
  return {
    type: types.SET_LOGS,
  }
}

export function toggleEmptyDaysInclusion() {
  return {
    type: types.TOGGLE_EMPTY_DAYS,
  }
}

export function toggleWeekendInclusion() {
  return {
    type: types.TOGGLE_WEEKENDS,
  }
}

export function setTodayStart() {
  const d = new Date();
  d.setHours(4,0,0,0);
  return {
    type: types.SET_DAY_START,
    time: d.getTime()
  }
}