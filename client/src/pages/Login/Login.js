import { useState, useContext} from 'react'
import { AuthContext } from '../../context/authContext'

const Login = () => {
  const [inputNameValue, setInputNameValue] = useState('')
  const className = 'login'

  const auth = useContext(AuthContext)

  const handleLoginBtnClick = (e) => {
    e.preventDefault()
    auth.login(inputNameValue)
    auth.userName = inputNameValue
  }

  return (
    <div className={className}>
      <h1>Welcome to tic-tac-toe</h1>
      <form className={`${className}__form`}>
        <input 
          type='text'
          placeholder='Name'
          value={inputNameValue}
          onChange={(event) => setInputNameValue(event.target.value)} 
          className={`${className}__input`}
        />
        <button 
          type='submit'
          className={`${className}__btn`}
          onClick={handleLoginBtnClick}
        >
          Login
        </button>
      </form>

    </div>
  )
}

export default Login