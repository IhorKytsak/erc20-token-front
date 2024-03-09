import { useEffect, useState, useCallback } from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import abi from '../abi.json'

export function useContract(signer) {
  const [contract, setContract] = useState(null)
  const [mintLoading, setMintLoading] = useState(false)
  const [buyTokensLoading, setBuyTokensLoading] = useState(false)
  const [contractInfo, setContractInfo] = useState({
    address: '',
    cap: '',
    name: '',
    symbol: '',
    totalSupply: '',
    accountBalance: '',
  })
  const [tsx, setTsx] = useState([])

  const decimals = 18

  useEffect(() => {
    if (Boolean(signer)) {
      const newContract = new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        abi,
        signer
      )
      setContract(newContract)

      newContract.on('Transfer', (from, to, amount, e) => {
        console.log(from, to, amount, e)
        setTsx((currentTsx) => [
          ...currentTsx,
          {
            txHash: e.log.transactionHash,
            from,
            to,
            amount: amount.toString(),
          },
        ])
      })

      return () => {
        newContract.off('Transfer')
      }
    }
  }, [signer])

  const getContractData = useCallback(async () => {
    if (Boolean(contract)) {
      const address = contract.target
      const cap = await contract.cap()
      const name = await contract.name()
      const symbol = await contract.symbol()
      const totalSupply = await contract.totalSupply()
      const accountBalance = await contract.balanceOf(signer.address)

      setContractInfo({
        cap: ethers.formatUnits(cap, decimals),
        address,
        name,
        symbol,
        totalSupply: ethers.formatUnits(totalSupply, decimals),
        accountBalance: ethers.formatUnits(accountBalance, decimals),
      })
    }
  }, [contract, signer])

  useEffect(() => {
    getContractData()
  }, [contract, getContractData])

  const buyTokens = async (amountOfTokens) => {
    if (Boolean(contract) && Boolean(signer)) {
      const owner = await contract.owner()

      if (signer.address === owner) {
        toast.error("Owner can't buy tokens")
        return
      }
      try {
        setBuyTokensLoading(true)
        const tokenToETH = amountOfTokens / 10
        const amountInWei = ethers.parseEther(tokenToETH.toString())
        const transaction = await contract.buyToken({
          value: amountInWei,
        })

        await transaction.wait()
        getContractData()
        toast.success('Tokens bought successfully!')
      } catch (error) {
        console.error('Error buying tokens:')
        toast.error('Error buying tokens. Please try again.')
      } finally {
        setBuyTokensLoading(false)
      }
    }
  }

  const mintTokens = async (amountOfTokens) => {
    if (Boolean(contract) && Boolean(signer)) {
      const owner = await contract.owner()
      if (signer.address !== owner) {
        toast.error('Only owner can mint tokens')
        return
      }
      try {
        setMintLoading(true)
        const transaction = await contract.mint(amountOfTokens)

        await transaction.wait()
        const totalSupply = await contract.totalSupply()
        const accountBalance = await contract.balanceOf(signer.address)

        setContractInfo((prevInfo) => ({
          ...prevInfo,
          totalSupply: ethers.formatUnits(totalSupply, decimals),
          accountBalance: ethers.formatUnits(accountBalance, decimals),
        }))
        toast.success('Tokens minted successfully!')
      } catch (error) {
        console.error('Error minting tokens:', error)
        toast.error('Error minting tokens. Please try again.')
      } finally {
        setMintLoading(false)
      }
    }
  }

  return {
    contractInfo,
    getContractData,
    buyTokens,
    mintTokens,
    mintLoading,
    buyTokensLoading,
    tsx,
  }
}
