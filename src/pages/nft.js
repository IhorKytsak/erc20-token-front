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

import { fetchNFTsForContract, putNFTOnSale } from '../api/NFT.api'
import AccountDetails from '../components/AccountDetails'

const NFTs = ({ signer, network, balance, isLoading }) => {
  const [isNFTLoading, setIsNFTLoading] = useState(false)
  const [allNFT, setAllNFT] = useState([])

  useEffect(() => {
    async function fetchNFT() {
      setIsNFTLoading(true)
      if (signer) {
        const nfts = await fetchNFTsForContract(signer.address)

        setAllNFT(nfts)
      }
      setIsNFTLoading(false)
    }

    fetchNFT()
  }, [signer])

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

      {isNFTLoading && (
        <Box sx={{ textAlign: 'center', padding: 4 }}>Loading NFTs... </Box>
      )}
      {!isNFTLoading && (
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
                <Button
                  onClick={putNFTOnSale.bind(null, signer, item.id)}
                  size='small'
                >
                  Put on sale
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </>
  )
}

export default NFTs
