const baseURI = 'https://testnets-api.opensea.io/api/v2'

export async function fetchNFTsForContract() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  }

  try {
    const response = await fetch(
      `${baseURI}/chain/sepolia/contract/${process.env.REACT_APP_NFT_CONTRACT_ADDRESS}/nfts?limit=99`,
      options
    )

    const contractInfo = await response.json()

    const nfts = contractInfo.nfts.map((item) => ({
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
