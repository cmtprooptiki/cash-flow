import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Customer from "./CustomerModel.js";
import ErgaCategories from "./ErgaCategoriesModel.js";
const {DataTypes} = Sequelize;

const Erga = db.define('erga',{
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
        type: DataTypes.STRING,
        allowNull: true, // Allow empty values
        validate: {
            len: [3, 500]
        }
    },
    description:
    {
        type: DataTypes.STRING,
        allowNull:true
    },
    color:{
        type: DataTypes.STRING,
        allowNull: false, // Allow empty values
    },
    sign_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: true
        }
    },
    sign_ammount_no_tax: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        validate: {
            isNumeric: true
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notEmpty: true
        }
    },
    estimate_start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: true
        }
    },
    project_manager: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: [3, 100]
        }
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: true
        }
    },

    shortname: {
        type: DataTypes.STRING,
        allowNull: true, // Allow empty values
        validate: {
            len: [2, 100]
        }
    },
    ammount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        validate: {
            isNumeric: true
        }
    },

    ammount_vat: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        validate: {
            isNumeric: true
        }
    },

    ammount_total: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        validate: {
            isNumeric: true
        }
    },

    estimate_payment_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: true
        }
    },

    
    estimate_payment_date_2: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: true
        }
    },

    
    estimate_payment_date_3: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: true
        }
    },

    erga_code:{
        type: DataTypes.STRING(500),
        allowNull: true 
    },
    symvallomenos:
    {
        type: DataTypes.STRING(500),
        allowNull: true 
    },
    end_date:{
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
            isDate: true
        }
    }

    








},{
    freezeTableName: true
});
Erga.belongsTo(Customer, { foreignKey: 'customer_id' });
Erga.belongsTo(ErgaCategories, { foreignKey: 'erga_cat_id' });


export default Erga;
