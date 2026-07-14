import express from "express"
import cors from 'cors'
import { Signindetails, Signupdetails, userdetails } from "./types"
import {prisma} from "@repo/db"
import axios from "axios"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "./config"
import { authMiddleware, AuthenticatedRequest } from "./middleware"

const app=express()
app.use(express.json())
app.use(cors())

app.post("/signup",async(req,res)=>{
    const {success,data}=Signupdetails.safeParse(req.body);
    if(!success){
        return res.status(402).json({
            message:"Please enter the correct credentials"
        })
    }
    try {
        const existingEmail=await prisma.User.findFirst({
            where:{
                email:data?.email
            }
        })
        if(existingEmail){
            return res.status(402).json({
                message:"Email already exists"
            })
        }
        if(!data?.password){
            return res.status(402).json({
                message:"Password is required"
            })
        }
        const hashedPassword=await bcrypt.hash(data?.password,10)
        const user= await prisma.User.create({
            data:{
                username:data?.username,
                password:hashedPassword,
                email:data?.email
            }
        })
        return res.json({
            userId:user.id
        })
    } catch (error) {
        return res.status(402).json({
            message:error
        })
    }
})

app.post("/signin",async(req,res)=>{
    const {success,data}=Signindetails.safeParse(req.body)
    if(!success){
        return res.status(402).json({
            message:"Invalid credentials"
        })
    }
    try {
        const existingUser=await prisma.User.findFirst({
            where:{
                email:data?.email
            }
        })
        if(!existingUser){
            return res.status(402).json({
                message:"Email doesnt exist"
            })
        }
        if(!data?.password){
            return res.status(402).json({
                message:"Password is required"
            })
        }
        const matchedpassword=await bcrypt.compare(data.password,existingUser.password)
        if(!matchedpassword){
            return res.status(402).json({
                message:"Password incorrect"
            })
        }
        const token=jwt.sign({ userId: existingUser.id },JWT_SECRET)
        return res.json({
            token:token
        })
    } catch (error) {
        return res.status(402).json({
            message:error
        })
    }
})

app.post("/github-verification", authMiddleware, async (req: AuthenticatedRequest, res) => {
    const {success,data}=userdetails.safeParse(req.body)
    if(!success){
        res.status(401).json({
            message:"Invalid links"
        })
        return
    }
    const githuburl=data.githuburl.endsWith("/")?data.githuburl.slice(0,-1):data.githuburl
    const githubname=githuburl.split("/").pop()
    const githubUserdata=await axios.get(`https://api.github.com/users/${githubname}/repos`)
    const githubrepodetails=githubUserdata.data.map((x:any)=>({
        description:x.description,
        name:x.name,
        fullName:x.fullName,
        starcount:x.stargazers_count
    }))
    try {
        const interview= await prisma.interview.create({
            data:{
                githubmetadata:githubrepodetails,
                status:'Inprocess',
                userID: req.userId!
            }
        })
        res.json({
            "id":interview.id
        })
    } catch (error) {
        res.json({
            "error":error
        })
    }

})

app.get("/interview/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    const {id} = req.params
    if(!id){
        return
    }
    try {
          const data = await prisma.interview.findFirst({
        where:{
            id:id
        }
    })
    res.json({
        "githubdata":data?.githubmetadata
    })  
    } catch (error) {
        res.json({
            "message":error
        })
    }

    
})

app.listen(8080)