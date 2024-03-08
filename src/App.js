import React from 'react'
import { ToastContainer } from 'react-toastify'
import {
  Button,
  Box,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material'
import 'react-toastify/dist/ReactToastify.css'
import { useProvider } from './hooks/useProvider'
import { useContract } from './hooks/useContract'

import './App.css'
import Contract from './components/Contract'

function App() {
  const isConnectedToMetaMask = window.ethereum.isConnected()

  const {
    provider,
    connectToMetaMask,
    network,
    signer,
    contract,
    isLoading,
    balance,
  } = useProvider()

  const { contractInfo, mintTokens, mintLoading, buyTokens, buyTokensLoading } =
    useContract(contract, signer)

  return (
    <div className='App'>
      {isLoading && <h4 className='loader'>Loading...</h4>}

      {isConnectedToMetaMask && Boolean(provider) && !isLoading && (
        <Box
          sx={{
            maxWidth: 550,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
          }}
        >
          <Card sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardContent>
              <Typography
                sx={{ fontSize: 16 }}
                color='text.primary'
                gutterBottom
              >
                Connected to network: {network}
              </Typography>
              <Typography
                sx={{ fontSize: 16 }}
                color='text.primary'
                gutterBottom
              >
                Account: {signer.address}
              </Typography>
              <Typography
                sx={{ fontSize: 16 }}
                color='text.primary'
                gutterBottom
              >
                Balance: {balance} ETH
              </Typography>
            </CardContent>
            {/* <CardActions>
              <Button variant='outlined' size='small' onClick={disconect}>
                Disconect
              </Button>
            </CardActions> */}
          </Card>
          <Contract
            contractInfo={contractInfo}
            mintTokens={mintTokens}
            mintLoading={mintLoading}
            buyTokens={buyTokens}
            buyTokensLoading={buyTokensLoading}
          />
        </Box>
      )}

      {!isConnectedToMetaMask && !provider && !isLoading && (
        <div className='conectWrapper'>
          <h3>Please connect to MetaMask</h3>
          <Button variant='contained' onClick={connectToMetaMask}>
            Connect
          </Button>
        </div>
      )}
      <ToastContainer
        position='bottom-center'
        autoClose={3000}
        closeOnClick
        pauseOnHover={false}
        draggable={false}
        theme='colored'
      />
    </div>
  )
}

export default App
