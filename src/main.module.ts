import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/observable/of'
import 'rxjs/add/observable/merge'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/merge'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/concatMap'
import 'rxjs/add/operator/delay'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/delayWhen'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/publish'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { handleActions, createAction, Action } from 'redux-actions'
import { ActionsObservable, combineEpics } from 'redux-observable'

export const CLICK_TO_ANIMATION = createAction('CLICK_TO_ANIMATION')
export const START_COMPUTE = createAction('START_COMPUTE')
export const COMPUTE_END = createAction('COMPUTE_END')

export const mainReducer = handleActions({
  [START_COMPUTE.toString()]: (state, props) => {
    return { ...state, ...props.payload }
  },
  [COMPUTE_END.toString()]: (state, props) => {
    return { ...state, ...props.payload }
  }
}, null)

const clickEpic = (action$: ActionsObservable<Action<any>>) => {
  return action$
    .ofType(CLICK_TO_ANIMATION.toString())
    .map(() => START_COMPUTE({ animation: 'show' }))
}

const ux$ = Observable.of(true)
  .delay(10)
  .concatMap(() => {
    const $animationElement = document.querySelector('.animation')
    return Observable.merge(
      Observable.fromEvent($animationElement!, 'animationstart')
        .mapTo(false),
      Observable.fromEvent($animationElement!, 'animationend')
        .mapTo(true),
    )
  })
  .publish()
  .refCount()

const compute$ = Observable.create((observer: Observer<null>) => {
  let result = Object.create(null)
  const id = setTimeout(() => {
    for (let i = 0; i < 20000000; i ++) {
      result[i] = (result[i - 1] ? result[i - 1] : 1 + i) / (i - 0.3)
    }
    observer.next(null)
    observer.complete()
  }, 300)
  return () => clearTimeout(id)
})

const startComputeEpic = (action$: ActionsObservable<Action<any>>) => {
  return action$
    .ofType(START_COMPUTE.toString())
    .flatMap(() => compute$)
    .map(() => COMPUTE_END({ animation: 'hide' }))
}

export const epics = combineEpics(
  clickEpic,
  startComputeEpic
)
