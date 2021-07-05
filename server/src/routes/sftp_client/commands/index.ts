import { Method } from '../interfaces'
import connect from './connect'
import disconnect from './disconnect'
import list from './list'
import exists from './exists'

interface MethodsMap {
  [key: string]: Method
}

export default <MethodsMap>{
  connect,
  disconnect,
  list,
  exists
}
