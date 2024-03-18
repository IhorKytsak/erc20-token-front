import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { toast } from 'react-toastify'

export function useProvider() {
  const [provider, setProvider] = useState(null)
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
      setSigner(currentSigner)

      const signerBalance = await browserProvider.getBalance(
        currentSigner.address
      )
      setBalance(ethers.formatUnits(signerBalance, 'ether'))

      const handleAccountsChanged = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        const balance = await provider.getBalance(signer.address)
        setSigner(signer)
        setBalance(ethers.formatUnits(balance, 'ether'))
        toast.success('MetaMask account has been changed')
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)

      toast.success('Connected to MetaMask')
      setIsLoading(false)

      return () => {
        window.ethereum.off('accountsChanged', handleAccountsChanged)
      }
    }
  }

  useEffect(() => {
    connectToMetaMask()
  }, [])

  return {
    provider,
    signer,
    network,
    isLoading,
    balance,
    connectToMetaMask,
  }
}
