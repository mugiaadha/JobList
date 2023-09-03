import { React, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confPassword, setConfPassword] = useState('')
  const navigate = useNavigate()

  const Register = async(e) => {
    e.preventDefault()
    try {
      await axios.post("http://localhost:5000/users", {
        name: name,
        username: username,
        password: password,
        confPassword: confPassword
      })
      navigate("/")
    } catch (error) {
      if(error.response) console.log(error.response.data) 
    }
  }

  return (
    <div>
      <section className="hero is-fullheight is-width">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
                <div className="column is-4-desktop">
                    <form onSubmit={ Register } className="box">
                        <div className="notification is-warning">
                            <button className="delete"></button>
                            Password salah
                        </div>
                        
                        <div className="field mt-5">
                            <div className="label">Name</div>
                            <div className="controls">
                                <input type="text" className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
                            </div>
                        </div>

                        <div className="field mt-5">
                            <div className="label">Username</div>
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
                            <div className="label">Confirm Password</div>
                            <div className="controls">
                                <input type="password" className="input" placeholder="**********" value={confPassword} onChange={(e) => setConfPassword(e.target.value)}/>
                            </div>
                        </div>

                        <div className="field mt-5">
                            <button className="button is-info is-fullwidth">Register</button>
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

export default Register
