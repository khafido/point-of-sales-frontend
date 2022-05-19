import '@styles/globals.css'
import 'antd/dist/antd.css';
import '../styles/custom.css';
import Layout from '@components/Layout';

import { Provider } from 'react-redux'
import { store } from '../redux/index'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'


const persistor = persistStore(store);
function MyApp({ Component, pageProps }) {

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  )
}

export default MyApp
