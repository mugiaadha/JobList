import { React, useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const [token, setToken] = useState('')
  const [expired, setExpied] = useState('')
  const [jobList, setJobList] = useState([])

  const [isFullTime, setIsFullTime] = useState(false)
  const [jobDesc, setJobDesc] = useState('')
  const [jobLocation, setJobLocation] = useState('')

  const navigate = useNavigate()

  const handleChange = () => {
    setIsFullTime(!isFullTime);
  };

  useEffect(() => {
    refreshToken()
    getJobs()
  })

  const refreshToken = async() => {
    try {
      const response = await axios.get('http://localhost:5000/token')
      const token = response.data.accessToken
      const decoded = jwt_decode(response.data.accessToken)

      setToken(token)
      setExpied(decoded.exp)
    } catch (error) {
      if (error.response) {
        navigate('/')
      }
    }
  }

  const axiosJwt = axios.create({
    baseURL: 'http://localhost:5000'
  })
  
  axiosJwt.interceptors.request.use(async(config) => {
    const currentDate = new Date()
    if (expired * 1000 < currentDate) {
      const response = await axios.get('/token')
      const token = response.data.accessToken
      const decoded = jwt_decode(response.data.accessToken)

      setToken(token)
      setExpied(decoded.exp)
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  }, (error)=> {
    return Promise.reject(error)
  })

  const getJobs = async() => {
    try {
      const response = await axiosJwt.get('/jobs', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setJobList(response.data)
    } catch (error) {

    }
  }

  const getNumberOfDays = (start) => {
    const date1 = new Date(start)
    const date2 = new Date()

    const oneDay = 1000 * 60 * 60 * 24
    const diffInTime = date2.getTime() - date1.getTime()
    const diffInDays = Math.round(diffInTime / oneDay)

    var result = 0;
    if (diffInDays <= 30) {
      result = (diffInDays).toFixed() + " days ago"
    } else if (diffInDays > 30) {
      result = (diffInDays / 30).toFixed() + " months ago"
    } else {
      result = (diffInDays / 360).toFixed() + " years ago"
    }

    return result
  }

  return (
    <div className="container">
      <div className="form-group columns mt-5">
        <div className="column is-4-desktop">
          <div className="field">
            <label className="label">Job Description</label>
            <div className="control">
              <input className="input" type="text" placeholder="Filter by title, benefits, companiess, expertise" value={jobDesc} onChange={(e) => setJobDesc(e.target.value)}/>
            </div>
          </div>
        </div>

        <div className="column is-5-desktop">
          <div className="field">
            <label className="label">Location</label>
            <div className="control">
              <input className="input" type="text" placeholder="Filter by city, state, zip code or country" value={jobLocation} onChange={(e) => setJobLocation(e.target.value)}/>
            </div>
          </div>
        </div>

        <div className="columns column is-3-desktop">
          <div className="column is-6-desktop">
            <div className="field mt-5">
              <div className="control pt-1">
                <label className="checkbox">
                <input 
                  type="checkbox"
                  checked={isFullTime}
                  onChange={handleChange}
                /> <strong className="is-size-7">Full Time Only</strong></label>
              </div>
            </div>
          </div>
          <div className="column is-6-desktop">
            <div className="field is-grouped mt-5">
              <div className="control pt-1">
                <button className="button is-light">Search</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <article className="panel">
        <p className="panel-heading">Job List</p>
        {jobList.map((job, index) => (
          <a href={'/detail/'+job.id} className="panel-block is-active" key={index}>
            <div className="column is-6-desktop">
              <h1 className="is-size-6 has-text-info">{job.title}</h1>
              <p className="is-size-7 has-text-grey">{job.company} - <span className="has-text-success">{job.type}</span></p>
            </div>
            <div className="column is-6-desktop">
              <p className="is-size-7 is-pulled-right">{job.location}</p><br/>
              <p className="is-size-7 has-text-grey is-pulled-right">{getNumberOfDays(job.created_at)}</p>
            </div>
          </a>
        ))}
      </article>
    </div>
  )
}

export default Dashboard
