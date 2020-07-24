import { ROUTES as r } from '../config/types'
import VerifyContract from '@/components/VerifyContract'

export default [

  {
    path: `/${r.verifyContract}/:contractAddress?/:id?`,
    name: 'Verify contract',
    component: VerifyContract
  }
]
