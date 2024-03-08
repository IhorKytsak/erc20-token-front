import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'
import abi from '../abi.json'

export function useProvider() {
  const [provider, setProvider] = useState(null)
  const [contract, setContract] = useState(null)
  const [signer, setSigner] = useState(null)
  const [network, setNetwork] = useState('')
  const [balance, setBalance] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const connectToMetaMask = async () => {
    setIsLoading(true)

    if (window.ethereum == null) {
      toast.error('MetaMask not installed; using read-only defaults')
      setProvider(ethers.getDefaultProvider())
    } else {
      const browserProvider = new ethers.BrowserProvider(window.ethereum)
      setProvider(browserProvider)

      const network = await browserProvider.getNetwork()
      setNetwork(network.name)

      const currentSigner = await browserProvider.getSigner()
      setSigner(await browserProvider.getSigner())

      const signerBalance = await browserProvider.getBalance(
        currentSigner.address
      )
      setBalance(ethers.formatUnits(signerBalance, 'ether'))

      const newContract = new ethers.Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        abi,
        currentSigner
      )
      setContract(newContract)

      const handleAccountsChanged = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const balance = await provider.getBalance(signer.address)
        setSigner(signer)
        setBalance(ethers.formatUnits(balance, 'ether'))
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)

      toast.success('Connected to MetaMask')

      // return () => {
      //   window.ethereum.off('accountsChanged', handleAccountsChanged)
      // }
    }

    setIsLoading(false)
  }

  useEffect(() => {
    connectToMetaMask()
  }, [])

  // const disconect = async () => {
  //   await window.ethereum.request({
  //     method: 'wallet_revokePermissions',
  //     params: [
  //       {
  //         eth_accounts: {},
  //       },
  //     ],
  //   })
  //   setProvider(null)
  //   setSigner(null)
  //   setNetwork('')
  //   setBalance(null)
  //   setContract(null)
  //   toast.success('Disconnected from MetaMask')
  // }

  // useEffect(() => {
  //   const getSignerBallance = async () => {
  //     if (contract && signer) {
  //       const balance = await contract.balanceOf(signer.address)

  //       setBalance(ethers.formatUnits(balance, 'ether'))
  //     }
  //   }

  //   getSignerBallance()
  // }, [contract, signer])

  // const getAccountBalance = async () => {
  //   const balance = await contract.balanceOf(signer.address)
  //   console.log(ethers.formatUnits(balance, 17))

  //   setBalance(ethers.formatUnits(balance, 'ether'))
  // }

  // setSigner(await browserProvider.getSigner())

  return {
    provider,
    signer,
    network,
    contract,
    isLoading,
    balance,
    connectToMetaMask,
  }
}
