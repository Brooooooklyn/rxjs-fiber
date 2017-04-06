import 'rxjs/add/observable/fromEvent'
import 'rxjs/add/observable/empty'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/merge'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/delayWhen'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/mapTo'
import 'rxjs/add/operator/publish'
import { animationFrame } from 'rxjs/scheduler/animationFrame'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { Subject } from 'rxjs/Subject'

import './style.css'

const Actions: {
  [index: string]: string
} = {
  CLICK_TO_ANIMATION: 'CLICK_TO_ANIMATION',
  START_COMPUTE: 'START_COMPUTE',
  COMPUTE_END: 'COMPUTE_END'
}

interface Action<T> {
  type: string
  payload?: T
}

const $animationElement = document.querySelector('.animation')!

const mainThread$ = new Subject<Action<any>>()
const ux$ = Observable.of(true)
  .merge(
    Observable.fromEvent($animationElement, 'animationend')
      .mapTo(true),
    Observable.fromEvent($animationElement, 'animationstart')
      .mapTo(false)
  )
  .publish()
  .refCount()

const click$ = Observable.fromEvent(document.querySelector('.button')!, 'click')
  .do(() => {
    mainThread$.next({
      type: Actions.CLICK_TO_ANIMATION
    })
  })

const compute$ = Observable.create((observer: Observer<Action<Object>>) => {
  let result: {
    [index: number]: number
  } = { }
  const id = setTimeout(() => {
    for (let i = 0; i < 20000000; i ++) {
      result[i] = (result[i - 1] ? result[i - 1] : 1 + i) / (i - 0.3)
    }
    observer.next({ type: Actions.COMPUTE_END, payload: {} })
  }, 400)
  return () => clearTimeout(id)
})

const dispatch$ = Observable.empty()
  .merge(click$)

mainThread$
  .filter(action => !!(action && action.type && Actions[action.type]))
  .delayWhen(() => ux$.filter(v => v))
  .switchMap(action => {
    console.log(action)
    switch (action.type) {
      case Actions.CLICK_TO_ANIMATION:
        return Observable.of({ type: Actions.START_COMPUTE })
          .do(() => {
            $animationElement.classList.add('show')
          })
      case Actions.START_COMPUTE:
        return compute$
      case Actions.COMPUTE_END:
        return Observable.of({ type: 'IGNORE' }, animationFrame)
          .do(() => {
            $animationElement.classList.remove('show')
          })
      default:
        return Observable.of({ type: 'IGNORE' })
    }
  })
  .merge(dispatch$)
  .subscribe(<any>mainThread$)
