import React, { useState } from 'react'
import {
  Button,
  Box,
  TextField,
  Card,
  CardActions,
  CardContent,
  Typography,
  Link,
} from '@mui/material'

const Contract = ({
  contractInfo,
  mintTokens,
  mintLoading,
  buyTokens,
  buyTokensLoading,
}) => {
  const [mintTokensAmount, setMintTokensAmount] = useState(0)
  const [buyTokensAmount, setBuyTokensAmount] = useState(0)

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ position: 'relative' }}>
        <Typography variant='h6' color='text.primary' gutterBottom>
          General Token Info
        </Typography>
        <Typography sx={{ fontSize: 16 }} color='text.primary' gutterBottom>
          Name: {contractInfo.name} ({contractInfo.symbol})
        </Typography>
        <Typography sx={{ fontSize: 16 }} color='text.primary' gutterBottom>
          Cap: {contractInfo.cap} {contractInfo.symbol}
        </Typography>
        <Typography sx={{ fontSize: 16 }} color='text.primary' gutterBottom>
          Total supply: {contractInfo.totalSupply} {contractInfo.symbol}
        </Typography>
        <Typography variant='h6' color='text.primary' gutterBottom>
          User Info
        </Typography>
        <Typography color='text.primary' gutterBottom>
          Account balance: {contractInfo.accountBalance} {contractInfo.symbol}
        </Typography>
        <Typography color='text.primary' gutterBottom>
          Mint Tokens (only owner)
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }} pb={3}>
          <TextField
            required
            id='mint'
            label='Amount of tokens'
            value={mintTokensAmount}
            onChange={(event) => {
              setMintTokensAmount(event.target.value)
            }}
          />
          <Button
            variant='contained'
            size='small'
            disabled={mintTokensAmount < 1 || mintLoading}
            onClick={() => {
              mintTokens(mintTokensAmount)
              setMintTokensAmount(0)
            }}
          >
            {mintLoading ? 'In progress...' : 'Mint'}
          </Button>
        </Box>
        <Typography color='text.primary' gutterBottom>
          Buy Tokens (only user)
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <TextField
            required
            id='buy'
            label='Amount of tokens'
            value={buyTokensAmount}
            onChange={(event) => {
              setBuyTokensAmount(event.target.value)
            }}
          />
          <Button
            variant='contained'
            size='small'
            disabled={buyTokensAmount <= 0 || buyTokensLoading}
            onClick={() => {
              buyTokens(buyTokensAmount)
              setBuyTokensAmount(0)
            }}
          >
            {buyTokensLoading ? 'In progress...' : 'Buy tokens'}
          </Button>
        </Box>
        <Typography color='text.secondary' gutterBottom>
          100 TT for 1 ETH
        </Typography>
      </CardContent>
      <CardActions>
        <Typography sx={{ fontSize: 16 }} color='text.primary' gutterBottom>
          <Link
            target='_blank'
            href={`https://sepolia.etherscan.io/address/${contractInfo.address}`}
          >
            Watch contract on Etherscan
          </Link>
        </Typography>
      </CardActions>
    </Card>
  )
}

export default Contract
