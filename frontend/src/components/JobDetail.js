import { React, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import axios from 'axios'

const JobDetail = () => {
  const [token, setToken] = useState('')
  const [expired, setExpied] = useState('')
  const [detail, setDetail] = useState('')
  const params = useParams();

  const navigate = useNavigate()

  useEffect(() => {
    refreshToken()
    getJobDetail()
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

  const getJobDetail = async() => {
    try {
      const response = await axiosJwt.get(`/jobDetail/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setDetail(response.data)
    } catch (error) {

    }
  }

  return (
    <div className="container box">
      <div className="columns mt-5">
        <div className="column is-12-desktop pt-5">
            <p className="has-text-grey">{detail.type+' / '+detail.location}</p>
            <strong className="is-size-4">{ detail.title }</strong>
            <hr/>
          </div>
      </div>
      <div className="columns">
        <div className="column is-8-desktop p-5">
          <div dangerouslySetInnerHTML={{__html: detail.description}}></div>
        </div>
        <div className="column is-4-desktop pl-5 pr-5">
          <div className="column is-12-desktop">
            <div className="box">
              <p>{detail.company} <button className="button is-light is-size-7 has-text-info is-pulled-right">1 Other Job</button></p>
              <hr />
              <figure className="image is-16by9 is-640x360">
                <img src="https://bulma.io/images/placeholders/640x360.png" />
              </figure>
            </div>
          </div>
          <div className="column is-12-desktop">
            <div className="notification is-warning is-light box">
              <p>How to apply</p>
              <hr />
              <div dangerouslySetInnerHTML={{__html: detail.how_to_apply}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDetail
