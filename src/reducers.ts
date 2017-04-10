import { combineReducers } from 'redux'
import { mainReducer } from './main.module'
import { AppUIState } from './main'

export default combineReducers({
  ui: combineReducers({
    main: mainReducer
  })
})

export interface GlobalUIState {
  main: AppUIState
}

export interface GlobalState {
  ui: GlobalUIState
}
