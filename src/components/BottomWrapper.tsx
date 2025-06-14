import React from 'react'
import BottomNavigation from './BottomNavigation'
import { auth } from '../auth';

async function BottomWrapper() {

    const session = await auth();

    /////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
      <>
          {session?.user.username && 
            <BottomNavigation username={session?.user.username || false} /> 
          }
    </>
  )
}

export default BottomWrapper
