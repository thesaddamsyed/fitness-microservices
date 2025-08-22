import React from 'react'
import ReactDOM from 'react-dom/client'

import { Provider } from 'react-redux'
import store from './store/store'

import { AuthProvider } from "react-oauth2-code-pkce";
import { authConfig } from './store/authConfig'

import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <AuthProvider authConfig={authConfig} loadingComponent={<div>Loading...</div>}>
      <Provider store={store}>
        <App />
      </Provider>
  </AuthProvider>
)