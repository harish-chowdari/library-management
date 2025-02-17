const librarainModel = require("../models/librarian");

const userModel = require("../models/user")


const createLibrarianAccount = async (req, res) => {
    try {
        const {email,name,password} = req.body;
        const isEmailExist = await librarainModel.findOne({email});
        if(isEmailExist){
            return res.status(400).json({"message":"Email already exists"});
        }
        const librarian = new librarainModel({
            email,
            name,
            password
        });
        await librarian.save();
        return res.send({"message":"Account created successfully",librarian:librarian});
    } catch (error) {
        console.log(error);
        res.status(400).json({"message":"Internal server error"});
    }
}


const librarianLogin = async (req, res) => {
    try{
        const {email,password} = req.body;
        const librarian = await librarainModel.findOne({email});
        if(!librarian){
            return res.status(400).json({"message":"User Not Found"});
        }
        if(librarian.password === password){
            return res.send({"message":"Login successful",librarian:librarian});
        }else{
            return res.status(400).json({"message":"Invalid credentials"});
        }
    }catch(error){
        res.status(400).json({"message":"Internal server error"});
    }
}




const getLibrarianById = async (req, res) => {
    try {
        const { id } = req.params;
        const librarian = await librarainModel.findById(id);
        if (!librarian) {
            return res.status(200).json({ "message": "librarian not found" });
        }
        return res.json({ "message": "librarian found", librarian });
    } catch (error) {
        res.status(500).json({ "message": "Internal server error" });
    }
}





const createUserAccount = async (req, res) => {
    try {
        const {email,name,password} = req.body;
        const isEmailExist = await userModel.findOne({email});
        if(isEmailExist){
            return res.status(400).json({"message":"Email already exists"});
        }
        const user = new userModel({
            email,
            name,
            password
        });
        await user.save();
        return res.send({"message":"Account created successfully",user:user});
    } catch (error) {
        console.log(error);
        res.status(400).json({"message":"Internal server error"});
    }
}


const userLogin = async (req, res) => {
    try{
        const {email,password} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({"message":"User Not Found"});
        }
        if(user.password === password){
            return res.send({"message":"Login successful",user:user});
        }else{
            return res.status(400).json({"message":"Invalid credentials"});
        }
    }catch(error){
        res.status(400).json({"message":"Internal server error"});
    }
}



const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(200).json({ "message": "User not found" });
        }
        return res.json({ "message": "User found", user });
    } catch (error) {
        res.status(500).json({ "message": "Internal server error" });
    }
}






module.exports = {
    createLibrarianAccount,
    librarianLogin,
    getLibrarianById,
    
    createUserAccount,
    userLogin,
    getUserById

}