import * as types from './types';
export const setReport = (reports) => dispatch => {
   dispatch({
    type: types.SET_REPORT,
     reports
  });
}

export const getReport = (reportIndex) => dispatch => {
   dispatch({
    type: types.FIND_REPORT,
    reportIndex
  });
}


  



