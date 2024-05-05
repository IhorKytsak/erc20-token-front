import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Box } from '@mui/material'

import { useProvider } from './hooks/useProvider'
import Layout from './components/Layout'
import Home from './pages/home'
import NFTs from './pages/nft'
import Marketplace from './pages/marketplace'

function App() {
  const isConnectedToMetaMask = window.ethereum.isConnected()

  const { provider, connectToMetaMask, network, signer, isLoading, balance } =
    useProvider()

  return (
    <Box>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route
            index
            element={
              <Home
                isConnectedToMetaMask={isConnectedToMetaMask}
                provider={provider}
                connectToMetaMask={connectToMetaMask}
                network={network}
                signer={signer}
                isLoading={isLoading}
                balance={balance}
              />
            }
          />
          <Route
            path='nft'
            element={
              <NFTs
                signer={signer}
                network={network}
                balance={balance}
                isLoading={isLoading}
              />
            }
          />
          <Route
            path='marketplace'
            element={
              <Marketplace
                signer={signer}
                network={network}
                balance={balance}
                isLoading={isLoading}
              />
            }
          />

          <Route path='*' element={<p>Page not found!</p>} />
        </Route>
      </Routes>
      <ToastContainer
        position='bottom-center'
        autoClose={3000}
        closeOnClick
        pauseOnHover={false}
        draggable={false}
        theme='colored'
      />
    </Box>
  )
}

export default App
