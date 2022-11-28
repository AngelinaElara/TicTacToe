import {useAuth} from './hooks/auth.hook'
import { AuthContext } from './context/authContext'
import { useRoutes } from './routes/routes'

const App = () => {
  const {login, logout, userName, roomId, stepSymbol} = useAuth()
  const isAuth = userName?.length 
  const routes = useRoutes(isAuth)

  return (
    <AuthContext.Provider value={{login, logout, userName, roomId, stepSymbol}}> 
      {routes}
    </AuthContext.Provider>
  )
} 

export default App
