import Users from "../models/UserModel.js"
import bcrypt from "bcrypt"
import axios from "axios"
import jwt from "jsonwebtoken"

export const getJobs = async(req, res) => {
    try {
        const response = await axios.get("http://dev3.dansmultipro.co.id/api/recruitment/positions.json")
        res.send(response.data)
    } catch (error) {
        console.log(error)
    }
}

export const getJobDetail = async(req, res) => {
    try {
        const response = await axios.get("http://dev3.dansmultipro.co.id/api/recruitment/positions.json")
        const filteredRes = response.data.filter((eventData) => {
            if(req.params['id'] === "") return eventData 
            else if(eventData.id.includes(req.params['id'])) return eventData
        })
        res.send(filteredRes[0])
    } catch (error) {
        console.log(error)
    }
}

export const Register = async(req, res) => {
    const { name, username, password, confPassword } = req.body
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"})
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)
    try {
        await Users.create({
            name: name,
            username: username,
            password: hashPassword
        })
        res.json({msg: "Register Berhasil"})
    } catch (error) {
        console.log(error)
    }
}

export const Login = async(req, res) => {
    const user = await Users.findAll({
        where:{
            username: req.body.username
        }
    })
    const match = await bcrypt.compare(req.body.password, user[0].password)
    if(!match) return res.status(400).json({msg: "Wrong Password"})
    const userId = user[0].id
    const name = user[0].name
    const username = user[0].username
    const accessToken = jwt.sign({userId, name, username}, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: '20s'
    })
    const refreshToken = jwt.sign({userId, name, username}, process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: '1d'
    })
    await Users.update({refresh_token: refreshToken},{
        where:{
            id: userId
        }
    })
    res.cookie('refreshToken', refreshToken,{
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    })
    res.json({ accessToken })
}

export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken) return res.sendStatus(204)
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    })
    if(!user[0]) return res.sendStatus(204)
    const userId = user[0].id
    await Users.update({refresh_token: null},{
        where:{
            id: userId
        }
    })
    res.clearCookie('refreshToken')
    return res.sendStatus(200)
}