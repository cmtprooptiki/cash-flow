import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const timologia = db.define('timologia', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    invoice_date:
    {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    ammount_no_tax:
    {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    ammount_tax_incl:
    {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    ////parakratiseis
    ammount_parakratisi_eight:
    {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: DataTypes.UUIDV4,
        allowNull: true,
        validate:{
            notEmpty: true
        }
    },
    ammount_parakratisi_eforia:
    {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: DataTypes.UUIDV4,
        allowNull: true,
        validate:{
            notEmpty: true
        }
    },
    ammount_loipa_exoda:
    {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: DataTypes.UUIDV4,
        allowNull: true,
        validate:{
            notEmpty: true
        }
    },
    actual_payment_date:
    {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    ammount_of_income_tax_incl:
    {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    comments:
    {
        type: DataTypes.STRING,
        allowNull: true,
        validate:{
            notEmpty: false,
            len: [0, 500]
        }
    },
    invoice_number:
    {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [1, 100]
        }
    },
    status_paid:
    {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    }
},{
    freezeTableName: true
});

export default timologia;
