import { Observable } from 'rxjs/Observable'
import { ActionsObservable } from 'redux-observable'

export default <T>(ux$: Observable<T>) => {
  return (input$: ActionsObservable<any>) => input$
    .delayWhen(() => ux$)
}
