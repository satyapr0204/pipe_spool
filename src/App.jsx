import { useState } from 'react'
import Approuter from './Approuter'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
      <Approuter />
    </>
  )
}

export default App
