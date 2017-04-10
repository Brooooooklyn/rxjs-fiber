import { combineEpics } from 'redux-observable'
import { epics as MainEpics } from './main.module'

export default combineEpics(
  MainEpics
)
