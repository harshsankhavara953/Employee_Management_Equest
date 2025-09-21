import React from 'react'
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <>
      <AppRoutes />
      <Toaster position='top-center' />
    </>
  )
}

export default App;