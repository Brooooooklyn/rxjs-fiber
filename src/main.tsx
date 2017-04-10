import * as React from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'

import store from './store'
import { CLICK_TO_ANIMATION } from './main.module'
import { GlobalState } from './reducers'

import './style.css'

const $app = document.querySelector('#app')

type AppDispatchProps = {
  click: typeof CLICK_TO_ANIMATION
}

export interface AppUIState {
  readonly animation: 'show' | null
}

type AppProps = AppDispatchProps & AppUIState

class App extends React.Component<AppProps, any> {

  private click = () => {
    this.props.click()
  }

  render() {
    return <div>
      <div className='button' onClick={ this.click }>点我</div>
      <div className={ `animation ${this.props.animation}` }/>
    </div>
  }
}

const mapStateToProps = (state: GlobalState): AppUIState => ({ ...state.ui.main })
const mapDispatchToProps: AppDispatchProps = { click: CLICK_TO_ANIMATION }

const AppComp: any = connect(mapStateToProps, mapDispatchToProps)(App)

render(
  <AppComp store={ store } ></AppComp>,
  $app
)
