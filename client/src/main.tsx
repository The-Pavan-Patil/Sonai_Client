import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './state/store.ts'

import DashboardWrapper from './components/DashboardWrapper.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <Provider store={store}>
    <StrictMode>
       
    <DashboardWrapper>
      <App/>
     </DashboardWrapper>
    
  </StrictMode>
  </Provider>
  </BrowserRouter>  
  
  
)
