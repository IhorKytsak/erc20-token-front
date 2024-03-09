import React from 'react'
import { Card, CardContent, Typography } from '@mui/material'

const TransactionsLog = ({ tsx = [] }) => {
  return (
    <>
      {tsx.length > 0 && (
        <Typography variant='h6' color='text.primary' gutterBottom>
          Recent Transactions
        </Typography>
      )}
      {tsx.map(({ txHash, from, to, amount }, index) => (
        <Card key={index} sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ position: 'relative' }}>
            <Typography
              sx={{ fontSize: 16, wordBreak: 'break-all' }}
              color='text.primary'
              gutterBottom
            >
              {`Transaction hash: ${txHash}`}
            </Typography>
            <Typography sx={{ fontSize: 16 }} color='text.primary' gutterBottom>
              from: {from}
            </Typography>
            <Typography sx={{ fontSize: 16 }} color='text.primary' gutterBottom>
              to: {to}
            </Typography>
            <Typography sx={{ fontSize: 16 }} color='text.primary' gutterBottom>
              amount: {amount}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

export default TransactionsLog
