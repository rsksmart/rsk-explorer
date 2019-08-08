import { ROUTES as r } from '../config/types'
import VerifyContract from '@/components/VerifyContract'

export default [

  {
    path: `/${r.verifyContract}/:address?`,
    name: 'VerifyContract',
    component: VerifyContract,
    props: {}
  }
]
