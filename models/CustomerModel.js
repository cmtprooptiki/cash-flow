import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Customer = db.define('customers', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    logoImage: {  // New column for profile image
        type: DataTypes.STRING,
        allowNull: true // It can be null if the user hasn't uploaded an image yet
       
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: true // Assuming name can be nullable
    },
    afm: {
        type: DataTypes.STRING(45),
        allowNull: true // Assuming afm can be nullable
    },
    doy: {
        type: DataTypes.STRING(45),
        allowNull: true // Assuming afm can be nullable
    },
    epagelma: {
        type: DataTypes.STRING(200),
        allowNull: true // Assuming afm can be nullable
    },
    phone: {
        type: DataTypes.STRING(45),
        allowNull: true // Assuming phone can be nullable
    },
    email: {
        type: DataTypes.STRING(45),
        allowNull: true // Assuming email can be nullable
    },
    address: {
        type: DataTypes.STRING(45),
        allowNull: true // Assuming address can be nullable
    },
    website: {
        type: DataTypes.STRING(200),
        allowNull: true // Assuming email can be nullable
    },
    facebookUrl: {
        type: DataTypes.STRING(5000),
        allowNull: true // Assuming email can be nullable
    },
    twitterUrl: {
        type: DataTypes.STRING(2048),
        allowNull: true // Assuming email can be nullable
    },
    linkedInUrl: {
        type: DataTypes.STRING(3000),
        allowNull: true // Assuming email can be nullable
    },
    instagramUrl: {
        type: DataTypes.STRING(2000),
        allowNull: true // Assuming email can be nullable
    },

    postal_code: {
        type: DataTypes.INTEGER,
        allowNull: true // Assuming postal_code can be nullable
    }
    
},{
    freezeTableName: true
});

export default Customer;
