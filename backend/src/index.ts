import { Socket } from "socket.io";
import http from "http";
import { Server } from 'socket.io';
import express from "express"
import cors from 'cors'
import { userdetails } from "./types"
import {prisma} from "./db"
import axios from "axios"

const app=express()
app.use(express.json())
app.use(cors())


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

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
//socket.io code
io.on('connection', (socket: Socket) => {
  console.log('a user connected');

  socket.on("disconnect", () => {
    console.log("user disconnected");
    
  })
});
server.listen(8080)