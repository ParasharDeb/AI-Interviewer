import "dotenv/config"
import { client } from "@repo/redis";
import {prisma} from "@repo/db"
async function rating_Interview(){
    const result = await client.brpop(
        "interview-rating-queue",
        0
    );
    if(!result) {
        console.log("NOT FOUND")
        return
    }
    const interviewId=result[1]
    console.log(interviewId)
    const Interview=await prisma.interview.findUnique({
        where:{
            id:interviewId
        },
        include:{
            messages:true
        }
    })
    console.log(Interview)

}
rating_Interview()