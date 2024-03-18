import React from 'react'
import { Button, Box, Card, CardContent, Typography } from '@mui/material'
import 'react-toastify/dist/ReactToastify.css'
import { useContract } from '../hooks/useContract'

import Contract from '../components/Contract'
import TransactionsLog from '../components/TransactionsLog'
import AccountDetails from '../components/AccountDetails'

function Home({
  isConnectedToMetaMask,
  provider,
  isLoading,
  signer,
  connectToMetaMask,
  balance,
  network,
}) {
  const {
    contractInfo,
    mintTokens,
    mintLoading,
    buyTokens,
    buyTokensLoading,
    tsx,
  } = useContract(signer)

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      {isLoading && <h4 className='loader'>Loading...</h4>}

      {isConnectedToMetaMask && Boolean(provider) && !isLoading && (
        <Box
          sx={{
            maxWidth: 550,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <AccountDetails network={network} signer={signer} balance={balance} />
          <Contract
            contractInfo={contractInfo}
            mintTokens={mintTokens}
            mintLoading={mintLoading}
            buyTokens={buyTokens}
            buyTokensLoading={buyTokensLoading}
          />
          <TransactionsLog tsx={tsx} />
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
    </Box>
  )
}

export default Home
