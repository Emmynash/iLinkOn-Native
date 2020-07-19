import * as types from '../actions/types';

const initialState = {
    allReports:[],
    report:{}
}
export default function ReportReducer(state = initialState, action) {
    switch(action.type){
        case types.SET_REPORT: 
            return Object.assign({}, state, {
                allReports:action.reports,      
            });
        case types.FIND_REPORT: 
            return Object.assign({}, state, {
                report:state.allReports[action.reportIndex],      
            });
         default:
            return state;

    }
}
