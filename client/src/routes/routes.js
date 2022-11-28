import {Routes, Route} from 'react-router-dom'
import Login from '../pages/Login'
import Rooms from '../pages/Rooms'
import Game from '../pages/Game'

export const useRoutes = (isAuth) => {

  if (isAuth) {
    return (
      <> 
        <Routes>
          <Route path={`/game`} element={<Game />} />
          <Route path='*' element={<Rooms />} />
          <Route path='/' element={<Rooms />} />
        </Routes>
      </>
    )
  }

  return (
    <Routes>
      <Route path='/' element={<Login />} />
    </Routes>
  )
}