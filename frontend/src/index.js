import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './index.css'
import './assets/fonts/UthmanicHafs_v2-1.ttf'
import './i18n'
import Spinner from './components/Spinner'
import Modal from 'react-modal'

Modal.setAppElement('#root')
const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <Suspense fallback={<Spinner />}>
      <Provider store={store}>
        <App />
      </Provider>
    </Suspense>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
