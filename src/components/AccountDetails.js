import { Card, CardContent, Typography } from '@mui/material'
import React from 'react'

const AccountDetails = ({ network, signer, balance }) => {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column' }}>
      <CardContent>
        <Typography sx={{ fontSize: 16 }} color='text.primary' gutterBottom>
          Connected to network: {network}
        </Typography>
        <Typography sx={{ fontSize: 16 }} color='text.primary' gutterBottom>
          Account: {signer.address}
        </Typography>
        <Typography sx={{ fontSize: 16 }} color='text.primary' gutterBottom>
          Balance: {balance} ETH
        </Typography>
      </CardContent>
    </Card>
  )
}

export default AccountDetails
