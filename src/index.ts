import express, {Request, Response} from "express";
import bodyParser from "body-parser";
import mongoose, { ObjectId } from "mongoose";
import dotenv from "dotenv"; 
import { genSalt, hashSync, compareSync, genSaltSync } from "bcrypt";
import userModel from "./models/usermodel";
import jwt from "jsonwebtoken";
import cookieparser from "cookie-parser";
import adminModel from "./models/adminmodel";

interface userDetails{
    userId: string;
    username: string;
    email: string;
    phonenumber: number;
    password: string;
}

interface adminDetails {
    adminId: string;
    adminName: string;
    password: string;
}

dotenv.config(); //we should add dotenv before accessing mongo_uri

const port: number = 3002;
const app = express();
const mongo_url = process.env.MONGO_URI;
const salt: string = genSaltSync(10); 
const secret = process.env.SECRET;
const adminSecret = process.env.ADMIN_SECRET;

mongoose.connect(mongo_url!)   
  .then(()=>{
    console.log("database is connected");   
})

//app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieparser());
app.use(express.json()); 

app.post("/userregister", async (req: Request, res: Response)=> {  
    const {username, email, phonenumber, password} = req.body;
    const hashedPassword = hashSync(password, salt);

    if(hashedPassword){
       await userModel.insertMany({ 
        username: username,
        password: hashedPassword,
        email: email,
        phonenumber: phonenumber
       }).then((response)=> {
        res.status(201).json(response);
       })
    }else{
        res.json("password doesnt reached in the backend or not hashed properly");
    }
});

app.post("/userlogin", async (req: Request, res: Response)=> {
    const {username, password} = req.body;
    if(password){
        const userData = await userModel.findOne({
            username: username
        });
        const passOk = compareSync(password, userData.password);
        if(passOk){
            const username = userData.username;
            const userId = userData._id;

            jwt.sign({username, userId}, process.env.SECRET, {}, (err: Error | null, token: string)=> {
                if(err){
                    res.json(err);
                }else{
                    res.cookie("userToken", token).json({ "token": token});
                }
            })
        }else{
            res.json("please enter correct messege");
        }
    }
    else{
        console.log("password not received");
        res.json("password not received");
    } 
});

app.get("/userlogout", (req: Request, res: Response)=> {
    const { userToken } = req.cookies;
    
    try{
        res.clearCookie(userToken);
        res.status(200).json("user logged out successfully");
        
    }catch(err){
        res.json("unable to logout" + err);
    }
});


app.get("/userdetails", async (req: Request, res: Response)=> { 
    const { userToken } = req.cookies;
    if(userToken){
        jwt.verify(userToken, secret, {}, async (err: Error | null, info: userDetails | null)=> {
            if(err){
                res.json("token cannot be parsed and its information");
            }else{
                const id = info.userId;
                const userDetails = await userModel.findById(id);
                console.log(userDetails);
                res.json(userDetails);
            }
        });
    }else{
        res.json("token didnt received");   
    }
});

app.put("/updateuserdetails", async (req: Request, res: Response)=> {
    const { userToken } = req.cookies;
    const { username, email, phonenumber, password } = req.body;

    if(userToken){
        jwt.verify(userToken, secret, {}, async (err: Error | null, info: userDetails)=> {
            const userDocToUpdated = await userModel.findById(info.userId);

            if(userDocToUpdated){ 
                userDocToUpdated.username = username; 
                userDocToUpdated.email = email;
                userDocToUpdated.phonenumber = phonenumber;
                userDocToUpdated.password = password;
                //save the changes
                await userDocToUpdated.save();
                res.json(userDocToUpdated);
            }else{
                res.json("cant found document in database");  
            }
        });
    }else{
        res.json("please login to create sessions"); 
    }
});

app.delete("/deleteuserdetails", async (req: Request, res: Response)=> {
    const { userToken } = req.cookies;
    
    if(userToken){
        jwt.verify(userToken, secret, {}, async (err: Error | null, info: userDetails)=> {
            const userDocToDeleted = await userModel.deleteOne({ _id: info.userId });
            if(userDocToDeleted){
                res.json("document deleted suuucessfully");
            }else{
                res.json("failed to delete");
            }
        });
    }else{
        res.json("please login to create session for deletion of userdoc");
    }
});

app.post("/adminregister", async (req: Request, res: Response)=> { 
    const {username, password} = req.body;
    const hashedPassword = hashSync(password, salt);

    if(hashedPassword){
       await adminModel.insertMany({
        username: username,
        password: hashedPassword,
       }).then((response)=> {
        res.status(201).json(response);
       })
    }else{
        res.json("password doesnt reached in the backend or not hashed properly");
    }
});

app.post("/adminlogin", async (req: Request, res: Response)=> {
    const {username, password} = req.body;
    if(password){
        const adminData = await adminModel.findOne({
            username: username
        });
        const passOk = compareSync(password, adminData.password);
        if(passOk){
            const adminName = adminData.username;
            const adminId = adminData._id;

            jwt.sign({adminName, adminId}, adminSecret, {}, (err: Error | null, token: adminDetails | any)=> {
                if(err){
                    res.json(err);
                }else{
                    res.cookie("adminToken", token).json({ "token": token, "id": token.adminId });
                }
            })
        }else{
            res.json("please enter correct messege");
        }
    }
    else{
        console.log("password not received");
        res.json("password not received");
    } 
});

app.get("/adminlogout", (req: Request, res: Response)=> {
    const { adminToken } = req.cookies;
    
    try{
        res.clearCookie(adminToken);
        res.status(200).json("admin logged out successfully");
    }catch(err){
        res.json("unable to logout" + err);
    }
});

app.get("/adminDetails", async (req: Request, res: Response)=> { 
    const { adminToken } = req.cookies;

    jwt.verify(adminToken, adminSecret, {}, (err: Error | null, info: adminDetails)=> {
        res.json({"token": adminToken, "id": info.adminId, "username": info.adminName});
    })

    
})

app.get("/admingetusers", async (req: Request, res: Response)=> {
    const { adminToken } = req.cookies;
    
    if(adminToken){
        jwt.verify(adminToken, adminSecret, {}, async (err: Error | null, info: adminDetails)=> {
            if(err){
                console.log("token cant be found", err);
            }else{
                const userDoc = await userModel.find();
                res.json(userDoc)
            }
        });
    }else{
        res.json("please create session to access user details");
    }
});
            
app.listen(port, ()=> {
    console.log("server is running");
});
    