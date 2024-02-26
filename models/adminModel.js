import { Sequelize } from "sequelize";
import db from "../config/database.js";


const {DataTypes} = Sequelize;
const Users = db.define('admin', {
    name:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING
    }
},{
    freezeTableName:true
});

export default Users;