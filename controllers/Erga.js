import e from "express";
import argon2 from "argon2";
import db from "../config/Database.js";
import { Sequelize } from "sequelize";
import Erga from "../models/ErgaModel.js";
import Customer from "../models/CustomerModel.js";
import ErgaCategories from "../models/ErgaCategoriesModel.js";
import incomes from "../models/incomesModel.js";
import Ekxorimena_Timologia from "../models/Ekxorimena_TimologiaModel.js";
import timologia from "../models/TimologiaModel.js";
import Paradotea from "../models/ParadoteaModel.js";
 
const { Op } = Sequelize;
 
function notifyTracker(ergo) {
  fetch('https://n8n.cmtprooptiki.gr/webhook/cashflow-project-sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ergo),
  }).catch(() => {});
}
 
async function generateErgaCode(customer_id, sign_date, existingCode = null) {
  if (!customer_id || !sign_date) return null;
 
  const customer = await Customer.findOne({
    where: { id: customer_id },
    attributes: ['customer_code'],
  });
  if (!customer?.customer_code) return null;
 
  const year = new Date(sign_date).getFullYear();
  const base = `${customer.customer_code}/${year}`;
 
  // Base unchanged — keep exact same code (preserves suffix, no conflicts)
  if (existingCode && existingCode.startsWith(base + '/')) {
    return existingCode;
  }
 
  // Base changed — count existing entries to get next suffix
  const count = await Erga.count({
    where: { erga_code: { [Op.like]: `${base}/%` } },
  });
 
  return `${base}/${count.toString().padStart(2, '0')}`;
}
 
export const getErga = async(req,res)=>{
    try{
        const response = await Erga.findAll({
            attributes:['id','logoImage','name','color','sign_date',
            'sign_ammount_no_tax','status','estimate_start_date',
            'project_manager','customer_id','shortname','ammount','ammount_vat',
            'ammount_total','estimate_payment_date','estimate_payment_date_2',
            'estimate_payment_date_3','erga_cat_id','erga_code','end_date','description'],
            include: [
                { model: Customer, attributes: ['name'] },
                { model: ErgaCategories, attributes: ['name'] },
            ],
        });
        res.status(200).json(response);
    } catch(error){
        res.status(500).json({msg:error.message});
    }
}
 
export const getErgaById = async(req,res)=>{
    try{
        const response = await Erga.findOne({
            attributes:['id','logoImage','name','color','sign_date',
            'sign_ammount_no_tax','status','estimate_start_date',
            'project_manager','customer_id','shortname','ammount','ammount_vat',
            'ammount_total','estimate_payment_date','estimate_payment_date_2',
            'estimate_payment_date_3','erga_cat_id','erga_code','end_date','description'],
            where:{ id:req.params.id }
        });
        res.status(200).json(response);
    } catch (error){
        res.status(500).json({ msg:error.message });
    }
}
 
export const createErga = async(req, res) => {
  const {name, color, sign_ammount_no_tax, sign_date, status, estimate_start_date,
    project_manager, customer_id, shortname, ammount, ammount_vat, ammount_total,
    estimate_payment_date, estimate_payment_date_2, estimate_payment_date_3,
    erga_cat_id, end_date, description} = req.body;
 
  let logoImage = 'uploads\\nologo.png';
  if (req.file) logoImage = req.file.path;
 
  try {
    const erga_code = await generateErgaCode(customer_id, sign_date);
 
    const newErga = await Erga.create({
      logoImage, name, color, sign_ammount_no_tax, sign_date, status,
      estimate_start_date, project_manager, customer_id, shortname,
      ammount, ammount_vat, ammount_total, estimate_payment_date,
      estimate_payment_date_2, estimate_payment_date_3, erga_cat_id,
      erga_code, end_date, description,
    });
 
    notifyTracker(newErga);
 
    res.status(201).json({msg: "erga complete"});
  } catch(error) {
    res.status(400).json({msg: error.message});
  }
}
 
export const updateErga = async(req, res) => {
  const erga = await Erga.findOne({ where: { id: req.params.id } });
  if (!erga) return res.status(404).json({msg: "erga not found"});
 
  const {name, color, sign_ammount_no_tax, sign_date, status, estimate_start_date,
    project_manager, customer_id, shortname, ammount, ammount_vat, ammount_total,
    estimate_payment_date, estimate_payment_date_2, estimate_payment_date_3,
    erga_cat_id, end_date, description} = req.body;
 
  let logoImage = erga.logoImage;
  if (req.file) logoImage = req.file.path;
 
  // Always regenerate — preserves suffix if client+year unchanged, new suffix if not
  const erga_code = await generateErgaCode(
    customer_id || erga.customer_id,
    sign_date   || erga.sign_date,
    erga.erga_code
  );
 
  try {
    await Erga.update({
      logoImage, name, color, sign_ammount_no_tax, sign_date, status,
      estimate_start_date, project_manager, customer_id, shortname,
      ammount, ammount_vat, ammount_total, estimate_payment_date,
      estimate_payment_date_2, estimate_payment_date_3, erga_cat_id,
      erga_code, end_date, description,
    }, { where: { id: erga.id } });
 
    notifyTracker({ id: erga.id, name, erga_code, sign_date, ammount_total, status, customer_id });
 
    res.status(200).json({msg: "Erga update Successfully"});
  } catch(error) {
    res.status(400).json({msg: error.message});
  }
}
 
export const deleteErga = async (req, res) => {
  const transaction = await db.transaction();
  try {
    const erga = await Erga.findOne({ where: { id: req.params.id }, transaction });
    if (!erga) {
      await transaction.rollback();
      return res.status(404).json({ msg: "Erga not found" });
    }
 
    const paradotea = await Paradotea.findAll({ where: { erga_id: req.params.id }, transaction });
    const timologiaIds = paradotea.map((p) => p.timologia_id).filter((id) => id != null);
 
    await Paradotea.destroy({ where: { erga_id: req.params.id }, transaction });
 
    if (timologiaIds.length > 0) {
      await Ekxorimena_Timologia.destroy({ where: { timologia_id: timologiaIds }, transaction });
      await incomes.destroy({ where: { timologia_id: timologiaIds }, transaction });
      await timologia.destroy({ where: { id: timologiaIds }, transaction });
    }
 
    await Erga.destroy({ where: { id: erga.id }, transaction });
    await transaction.commit();
 
    res.status(200).json({ msg: "Erga deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ msg: error.message });
  }
};