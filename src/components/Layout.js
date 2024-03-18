import { Suspense } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { AppBar, Button } from '@mui/material'

const Layout = () => {
  return (
    <>
      <AppBar
        sx={{
          display: 'flex',
          flexDirection: 'row',
          position: 'initial',
          mb: 2,
        }}
        component='nav'
      >
        <Link to='/'>
          <Button sx={{ color: '#fff' }}>Home</Button>
        </Link>
        <Link to='/nft'>
          <Button sx={{ color: '#fff' }}>NFT</Button>
        </Link>
      </AppBar>

      <Suspense fallback={<div>Loading... </div>}>
        <Outlet />
      </Suspense>
    </>
  )
}

export default Layout
