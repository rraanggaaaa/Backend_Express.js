import { Sequelize } from "sequelize";
import db from "../config/database.js";


const {DataTypes} = Sequelize;
const History = db.define('history', {
    user_email:{
        type: DataTypes.STRING
    },
    product_name:{
        type: DataTypes.STRING
    },
    quntity:{
        type: DataTypes.INTEGER
    },
    price:{
        type: DataTypes.INTEGER
    }
},{
    freezeTableName:true
});

export default History;

