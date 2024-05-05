import { ethers } from 'ethers'
import { toast } from 'react-toastify'

import ERC20Token from '../abi/ERC20Token.json'
import NFT from '../abi/NFT.json'
import Marketplace from '../abi/Marketplace.json'

const baseURI = 'https://testnets-api.opensea.io/api/v2'

export async function fetchNFTsForContract(accountAddr) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  }

  try {
    const response = await fetch(
      `${baseURI}/chain/sepolia/account/${accountAddr}/nfts?collection=testnft-3965`,
      options
    )

    const contractInfo = await response.json()

    const nfts = contractInfo.nfts.map((item) => ({
      id: item.identifier,
      name: item.name,
      description: item.description,
      imageURL: item.image_url,
    }))

    return nfts
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function fetchNFTsForSale(signer) {
  const marketplaceContract = new ethers.Contract(
    process.env.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS,
    Marketplace.abi,
    signer
  )
  const nftContract = new ethers.Contract(
    process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
    NFT.abi,
    signer
  )
  const tokenContract = new ethers.Contract(
    process.env.REACT_APP_CONTRACT_ADDRESS,
    ERC20Token.abi,
    signer
  )
  const tokenSymbol = await tokenContract.symbol()
  const nftCost = await nftContract.cost()
  const tokensPerEth = await tokenContract.tokensPerEth()
  const fixedNftCost = ethers.FixedNumber.fromValue(nftCost)
  const fixedTokensPerEth = ethers.FixedNumber.fromValue(tokensPerEth)
  const fixedResult = fixedNftCost.mul(fixedTokensPerEth)
  const tokenForNft = ethers.formatUnits(
    fixedResult.toUnsafeFloat().toString(),
    18
  )

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  }

  try {
    const response = await fetch(
      `${baseURI}/chain/sepolia/contract/${process.env.REACT_APP_NFT_CONTRACT_ADDRESS}/nfts`,
      options
    )
    const { nfts } = await response.json()
    const nftIdsOnSale = []

    for (let i = 1; i <= nfts.length; i++) {
      const isOnSale = await marketplaceContract.tokenIdForSale(i)
      if (isOnSale) {
        nftIdsOnSale.push(i)
      }
    }

    const nftsOfSigner = await nftContract.walletOfOwner(signer.address)
    const nftsOfSignerSet = new Set(nftsOfSigner.map((s) => ethers.toNumber(s)))

    const nftsOnSale = nfts
      .filter((nft) => nftIdsOnSale.includes(parseInt(nft.identifier)))
      .map((item) => ({
        id: item.identifier,
        name: item.name,
        description: item.description,
        imageURL: item.image_url,
        price: tokenForNft + ' ' + tokenSymbol,
        isOwner: nftsOfSignerSet.has(parseInt(item.identifier)),
      }))

    return nftsOnSale
  } catch (error) {
    toast.error('Failed to fetch NFTs')
    console.error(error)
    return []
  }
}

export async function putNFTOnSale(signer, nftId) {
  if (signer) {
    const nftContract = new ethers.Contract(
      process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
      NFT.abi,
      signer
    )
    const marketplaceContract = new ethers.Contract(
      process.env.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS,
      Marketplace.abi,
      signer
    )

    const isAlreadyOnSale = await marketplaceContract.tokenIdForSale(nftId)

    if (isAlreadyOnSale) {
      toast.success('NFT is already on sale')
      return
    }

    try {
      const approveNftSpend = await nftContract.approve(
        process.env.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS,
        nftId
      )

      const putOnSale = await marketplaceContract.putNFTOnSale(nftId)

      await approveNftSpend.wait()
      await putOnSale.wait()

      toast.success('Successfully put NFT on sale')
    } catch (error) {
      toast.error('Failed to put NFT on sale')
      console.error(error)
    }
  }
}

export async function removeNFTFromSale(signer, nftId) {
  if (signer) {
    const nftContract = new ethers.Contract(
      process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
      NFT.abi,
      signer
    )
    const marketplaceContract = new ethers.Contract(
      process.env.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS,
      Marketplace.abi,
      signer
    )

    const isOnSale = await marketplaceContract.tokenIdForSale(nftId)

    if (!isOnSale) {
      toast.success('NFT is already withdrawn from sale')
      return
    }

    try {
      const resetApprove = await nftContract.approve(ethers.ZeroAddress, nftId)

      const removeFromSale = await marketplaceContract.removeNFTFromSale(nftId)

      await resetApprove.wait()
      await removeFromSale.wait()
      console.log(resetApprove, removeFromSale, 'removeNFTFromSale')
      toast.success('NFT successfully removed from sale')
    } catch (error) {
      toast.error('Failed to remove NFT from sale')
      console.error(error)
    }
  }
}

export async function buyNFT(signer, nftId) {
  if (signer) {
    const tokenContract = new ethers.Contract(
      process.env.REACT_APP_CONTRACT_ADDRESS,
      ERC20Token.abi,
      signer
    )

    const nftContract = new ethers.Contract(
      process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
      NFT.abi,
      signer
    )

    const nftCost = await nftContract.cost()
    const tokensPerEth = await tokenContract.tokensPerEth()
    const fixedNftCost = ethers.FixedNumber.fromValue(nftCost)
    const fixedTokensPerEth = ethers.FixedNumber.fromValue(tokensPerEth)
    const fixedResult = fixedNftCost.mul(fixedTokensPerEth)

    const valueToAllow = fixedResult.toUnsafeFloat().toString()

    const marketplaceContract = new ethers.Contract(
      process.env.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS,
      Marketplace.abi,
      signer
    )

    try {
      const approveTokenSpend = await tokenContract.approve(
        process.env.REACT_APP_MARKETPLACE_CONTRACT_ADDRESS,
        valueToAllow
      )
      await approveTokenSpend.wait()

      const buyNFT = await marketplaceContract.buyNFT(nftId)
      await buyNFT.wait()

      toast.success('NFT successfully purchased')
    } catch (error) {
      toast.error('Failed to buy NFT')
      console.error(error)
    }

    console.log('Not Implemented')
  }
}
