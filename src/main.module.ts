import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/merge'
import 'rxjs/add/operator/mergeMap'
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
}, {})

const clickEpic = (action$: ActionsObservable<Action<any>>) => {
  return action$
    .ofType(CLICK_TO_ANIMATION.toString())
    .map(() => START_COMPUTE({ animation: 'show' }))
}

const ux$ = ($animationElement: Element) => {
  console.log($animationElement)
  return Observable.of(true)
    .merge(
      Observable.fromEvent($animationElement, 'animationend')
        .do(v => {
          console.log(v)
        })
        .mapTo(true),
      Observable.fromEvent($animationElement, 'animationstart')
        .do(v => {
          console.log(v)
        })
        .mapTo(false)
    )
    .publish()
    .refCount()
    .do(v => {
      console.log(v)
    })
}

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
    .delayWhen(() => ux$(document.querySelector('.animation')!).filter(v => v))
    .flatMap(() => compute$)
    .map(() => COMPUTE_END({ animation: 'hide' }))
}

export const epics = combineEpics(
  clickEpic,
  startComputeEpic
)
