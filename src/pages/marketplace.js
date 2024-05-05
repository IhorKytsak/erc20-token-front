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

import { fetchNFTsForSale, buyNFT, removeNFTFromSale } from '../api/NFT.api'
import AccountDetails from '../components/AccountDetails'

const Marketplace = ({ signer, network, balance, isLoading }) => {
  const [isNFTLoading, setIsNFTLoading] = useState(false)
  const [isRemoveLoading, setIsRemoveLoading] = useState(false)
  const [isBuyLoading, setIsBuyLoading] = useState(false)
  const [allNfts, setNfts] = useState([])

  useEffect(() => {
    async function fetchNFT() {
      setIsNFTLoading(true)
      if (signer) {
        const nfts = await fetchNFTsForSale(signer)

        setNfts(nfts)
      }
      setIsNFTLoading(false)
    }

    fetchNFT()
  }, [signer])

  const removeNFTHandler = async (signer, id) => {
    try {
      setIsRemoveLoading(true)
      await removeNFTFromSale(signer, id)
      const nfts = await fetchNFTsForSale(signer)

      setNfts(nfts)
    } catch (error) {
      console.error(error)
    } finally {
      setIsRemoveLoading(false)
    }
  }

  const buyNFTHandler = async (signer, id) => {
    try {
      setIsBuyLoading(true)
      await buyNFT(signer, id)
      const nfts = await fetchNFTsForSale(signer)

      setNfts(nfts)
    } catch (error) {
      console.error(error)
    } finally {
      setIsBuyLoading(false)
    }
  }

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
          {allNfts.length > 0 ? (
            allNfts.map((item, index) => (
              <Card key={index} sx={{ maxWidth: 300 }}>
                <CardMedia
                  sx={{ height: '300px', width: '300px' }}
                  image={item.imageURL}
                  title='NFT Image'
                />
                <CardContent>
                  <Typography gutterBottom variant='h5' component='div'>
                    {item.name}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    gutterBottom
                  >
                    {item.description}
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    gutterBottom
                  >
                    Price: {item.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  {item.isOwner ? (
                    <Button
                      onClick={removeNFTHandler.bind(null, signer, item.id)}
                      size='small'
                      disabled={isRemoveLoading}
                    >
                      {isRemoveLoading ? 'Loading...' : 'Remove from sale'}
                    </Button>
                  ) : (
                    <Button
                      onClick={buyNFTHandler.bind(null, signer, item.id)}
                      size='small'
                      disabled={isBuyLoading}
                    >
                      {isBuyLoading ? 'Loading...' : 'Buy'}
                    </Button>
                  )}
                </CardActions>
              </Card>
            ))
          ) : (
            <h5>There are no NFTs for sale yet </h5>
          )}
        </Box>
      )}
    </>
  )
}

export default Marketplace
