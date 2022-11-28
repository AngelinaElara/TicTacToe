import {useState, useCallback, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'

const storageName = 'userData'


export const useAuth = () => {
  const [userName, setUserName] = useState(null)
  const [roomId, setRoomId] = useState(null)
  const [stepSymbol, setStepSymbol] = useState('x')
  
  const navigate = useNavigate()

  const login = useCallback((name) => {
    setUserName(name)

    localStorage.setItem(storageName, JSON.stringify({
      userName: name
    }))
  }, [])

  const logout = useCallback(() => {
    setUserName(null)
    
    localStorage.removeItem(storageName)
    navigate('/')
  }, [])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName) || '{}')

    if(data && data.userName) {
      login(data.userName)
    }
  }, [login])

  return {userName, login, logout, roomId, stepSymbol}  
}