import { React, useState} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const removeMsg = () => {
    setErrorMsg('')
  }

  const Login = async(e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/login", {
        username: username,
        password: password
      });
      navigate("/dashboard")
    } catch (error) {
      if(error.response) {
        setErrorMsg(error.response.data.msg)
        setTimeout(() => {
          removeMsg()
        }, 5000)
      }
    }
  }

  return (
    <div>
      <section className="hero is-fullheight is-width">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
                <div className="column is-4-desktop">
                    <form onSubmit={ Login } className="box">
                        {
                          errorMsg &&
                          <div className="notification is-warning">
                              <button className="delete" onClick={removeMsg}></button>
                              {errorMsg}
                          </div>
                        }
                        
                        <div className="field mt-5">
                            <div className="label">Email or Username</div>
                            <div className="controls">
                                <input type="text" className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                            </div>
                        </div>
                        
                        <div className="field mt-5">
                            <div className="label">Password</div>
                            <div className="controls">
                                <input type="password" className="input" placeholder="**********" value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                        </div>

                        <div className="field mt-5">
                            <button className="button is-info is-fullwidth">Login</button>
                        </div>
                        
                        <div className="field mt-5 mb-5 columns is-centered">
                          Don't Have an account? <a href="/register" className="has-text-info pl-1"> Create Account</a>
                        </div>
                    </form>
                </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Login
