import React, { useEffect, useState } from 'react'
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Box,
} from '@mui/material'

import { fetchNFTsForContract } from '../api/getNFT.api'
import AccountDetails from '../components/AccountDetails'

const NFTs = ({ signer, network, balance, isLoading }) => {
  const [allNFT, setAllNFT] = useState([])

  useEffect(() => {
    async function fetchNFT() {
      const nfts = await fetchNFTsForContract()

      setAllNFT(nfts)
    }

    fetchNFT()
  }, [])

  return (
    <>
      <Box
        sx={{
          maxWidth: 550,
          width: '100%',
          mx: 'auto',
        }}
      >
        {isLoading && <h4 className='loader'>Loading...</h4>}
        {Boolean(signer) && !isLoading && (
          <AccountDetails network={network} signer={signer} balance={balance} />
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          m: 2,
          justifyContent: 'center',
        }}
      >
        {allNFT.map((item, index) => (
          <Card key={index} sx={{ maxWidth: 345 }}>
            <CardMedia
              sx={{ height: '300px', width: '300px' }}
              image={item.imageURL}
              title='NFT Image'
            />
            <CardContent>
              <Typography gutterBottom variant='h5' component='div'>
                {item.name}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {item.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size='small'>Share</Button>
              <Button size='small'>Learn More</Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </>
  )
}

export default NFTs
