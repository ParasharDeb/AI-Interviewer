
import express from "express"
import cors from 'cors'
import { Signupdetails, userdetails } from "./types"
import {prisma} from "@repo/db"
import axios from "axios"

const app=express()
app.use(express.json())
app.use(cors())
app.post("/signup",async(req,res)=>{
    const {success,data}=Signupdetails.safeParse(req.body);
    if(!success){
        res.json({
            message:"Please enter the correct credentials"
        })
    }
    try {
    const user= await prisma.User.create({
        data:{
            username:data?.username,
            password:data?.password,
            email:data?.email
        }
    })
    res.json({
        "UserId":user.id
    })    
    } catch (error) {
        res.json(error)
        return
    }
})

app.post("/github-verification",async(req,res)=>{
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
        const data= await prisma.interview.create({
            data:{
                githubmetadata:githubrepodetails,
                status:'Inprocess',
                userID:"abc123"
            }
        })
        res.json({
            "id":data.id
        })
    } catch (error) {
        res.json({
            "error":error
        })
    }

})
app.get("/interview/:id",async(req,res)=>{
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