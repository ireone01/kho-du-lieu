const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const app = express();
const port = 3003;
const fs = require('fs');
const path = require('path');
app.use(cors());
// Cấu hình kết nối SQL Server
const config = {
    user: 'sa',
    password: '12345',
    server: 'IRE-ONCE\\IREONE01',
    database: 'x1',
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true
    }
};
function aggregateDataByItemID(data){
    return data.reduce((acc, item) => {

        const existingProduct = acc.find(prod => prod.ItemID === item.ItemID);
        if (existingProduct) {
            existingProduct.Total_Quantity+= item.Total_Quantity;
            existingProduct.Total_Amount += item.Total_Amount;
        } else {

            acc.push({
                ItemID: item.ItemID,
                Total_Quantity: item.Total_Quantity,
                Total_Amount: item.Total_Amount
            });
        }
        return acc;
    }, []);

}
function aggregateDataByLocation(data){
    return data.reduce((acc,item) =>{
        const key=`${item.City_name}-${item.State}`;
        const exis =acc.find(entry => entry.key === key);
        if(exis) {
            exis.Total_Quantity+= item.Total_Quantity;
            exis.Total_Amount += item.Total_Amount;
        }else {
            acc.push({
                City_name : item.City_name,
                State : item.State,
                Total_Quantity: item.Total_Quantity,
                Total_Amount : item.Total_Amount
            });
        }
        return acc;
    },[]);
}
function aggregateDataByTime(data) {
    return data.reduce((acc, item) => {
        const key = `${item.Quarter}-${item.Year}`;
        const existingEntry = acc.find(entry => entry.key === key);
        if (existingEntry) {
            existingEntry.Total_Quantity+= item.Total_Quantity;
            existingEntry.Total_Amount += item.Total_Amount;
        } else {
            acc.push({

                Quarter: item.Quarter,
                Year: item.Year,
                Total_Quantity: item.Total_Quantity,
                Total_Amount: item.Total_Amount
            });
        }
        return acc;
    }, []);
}
function aggregateDataByItemIDTime(data) {
    return data.reduce((acc, item) => {
        const key = `${item.Quarter}-${item.Year}-${item.ItemID}`;
        const exis =acc.find(entry => entry.key===key);
        if (exis) {
            exis.Total_Quantity+= item.Total_Quantity;
            exis.Total_Amount += item.Total_Amount;
        } else {
            acc.push ({
                ItemID: item.ItemID,
                Year: item.Year,
                Quarter: item.Quarter,
                Total_Quantity: item.Total_Quantity,
                Total_Amount: item.Total_Amount
            });
        }
        return acc;
    }, []);
}
function aggregateDataByAll(data){
    return data.reduce((acc,item) =>{
        const key = `${item.Year}-${item.ItemID}-${item.City_name}-${item.Quarter}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+= item.Total_Quantity;
            exis.Total_Amount += item.Total_Amount;
        }else {
            acc.push({
                Year: item.Year,
                Quarter: item.Quarter,
                ItemID: item.ItemID,
                City_name: item.City_name,
                Total_Quantity: item.Total_Quantity,
                Total_Amount: item.Total_Amount
            });
        }
        return acc ;
    }, [])
}
function aggregateDataByLocationItemID(data){
    return data.reduce((acc,item) =>{
        const key =`${item.City_name}-${item.ItemID}-${item.State}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+= item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                City_name : item.City_name,
                ItemID : item.ItemID,
                State : item.State,
                Total_Quantity: item.Total_Quantity,
                Total_Amount : item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByLocationTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.City_name}-${item.Quarter}-${item.State}-${item.Year}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+= item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                City_name: item.City_name,
                Quarter: item.Quarter,
                State: item.State,
                Year: item.Year,
                Sold: item.Total_Quantity,
                Total_Amount: item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByLocationItemIDTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.City_name}-${item.ItemID}-${item.Quarter}-${item.State}-${item.Year}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+= item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                City_name: item.City_name,
                ItemID: item.ItemID,
                Quarter: item.Quarter,
                State: item.State,
                Year: item.Year,
                Sold: item.Total_Quantity,
                Total_Amount: item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByStore_ID(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Store_ID}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity += item.Total_Quantity;
            exis.Total_Amount += item.Total_Amount;
        }else{
            acc.push({
                Store_ID : item.Store_ID,
                Total_Quantity: item.Total_Quantity,
                Total_Amount : item.Total_Amount
            });
        }
        return acc
    },[])
}
function aggregateDataByCustomerType(data){
    return data.reduce((acc,item) => {
        const key = `${item.CustomerType}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+= item.Total_Quantity;
            exis.Total_Amount += item.Total_Amount;
        }else{
            acc.push({
                CustomerType : item.CustomerType,
                Total_Quantity: item.Total_Quantity,
                Total_Amount : item.Total_Amount
            });
        }
        return acc
    },[])
}
function aggregateDataByItemIDStore_ID(data){
    return data.reduce((acc,item)=>{
        const key = `${item.Store_ID}-${item.ItemID}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Store_ID : item.Store_ID,
                ItemID : item.ItemID,

                Total_Quantity: item.Total_Quantity,
                Total_Amount: item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByStore_IDTime(data){
    return data.reduce((acc,item)=>{
        const key = `${item.Store_ID}-${item.Year}-${item.Quarter}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Store_ID : item.Store_ID,
                Year : item.Year,
                Quarter : item.Quarter,
                Total_Quantity: item.Total_Quantity,
                Total_Amount: item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerTypeTime(data){
    return data.reduce((acc,item)=>{
        const key = `${item.CustomerType}-${item.Year}-${item.Quarter}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                CustomerType : item.CustomerType,
                Year : item.Year,
                Quarter : item.Quarter,
                Total_Quantity: item.Total_Quantity,
                Total_Amount: item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerTypeStore_ID(data){
    return data.reduce((acc,item)=>{
        const key = `${item.CustomerType}-${item.Store_ID}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                CustomerType : item.CustomerType,
                Store_ID : item.Store_ID,
                Total_Quantity: item.Total_Quantity,
                Total_Amount: item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerTypeItemID(data){
    return data.reduce((acc,item)=>{
        const key = `${item.CustomerType}-${item.ItemID}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                CustomerType : item.CustomerType,
                ItemID : item.ItemID,
                Total_Quantity: item.Total_Quantity,
                Total_Amount: item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerTypeLocation(data){
    return  data.reduce((acc,item)=>{
        const key = `${item.CustomerType}-${item.City_name}-${item.State}`;
        const exis = acc.find(entry =>entry.key === key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount += item.Total_Amount;
        }else{
            acc.push({
                CustomerType : item.CustomerType,
                City_name : item.City_name,
                State : item.State,
                Total_Quantity: item.Total_Quantity,
                Total_Amount : item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByLocationStore_ID(data){
    return data.reduce((acc,item)=>{
        const key = `${item.Store_ID}-${item.City_name}-${item.State}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Store_ID : item.Store_ID,
                City_name : item.City_name,
                State : item.State,
                Total_Quantity: item.Total_Quantity,
                Total_Amount: item.Total_Amount
            });
        }
        return acc;
    },[])
}
//CustomerType-ItemID-location-Store_ID-time
function aggregateDataByLocationItemIDStore_ID(data){
    return data.reduce((acc,item)=>{
        const key = `${item.Store_ID}-${item.ItemID}-${item.City_name}-${item.State}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Store_ID : item.Store_ID,
                ItemID: item.ItemID,
                City_name : item.City_name,
                State : item.State,
                Total_Quantity: item.Total_Quantity,
                Total_Amount: item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByLocationStore_IDTime(data){
    return data.reduce((acc,item)=>{
        const key = `${item.Store_ID}-${item.Year}-${item.Quarter}-${item.City_name}-${item.State}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Year : item.Year,
                Quarter : item.Quarter,
                Store_ID : item.Store_ID,
                City_name : item.City_name,
                State : item.State,
                Total_Quantity: item.Total_Quantity,
                Total_Amount: item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByItemIDStore_IDTime(data){
    return data.reduce((acc,item)=>{
        const key = `${item.Store_ID}-${item.Year}-${item.Quarter}-${item.ItemID}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Year : item.Year,
                Quarter : item.Quarter,
                Store_ID : item.Store_ID,
                ItemID : item.ItemID,
                Total_Quantity: item.Total_Quantity,
                Total_Amount: item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerTypeStore_IDTime(data){
    return data.reduce((acc,item)=>{
        const key = `${item.Store_ID}-${item.Year}-${item.Quarter}-${item.CustomerType}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Year : item.Year,
                Quarter : item.Quarter,
                Store_ID : item.Store_ID,
                CustomerType : item.CustomerType,
                Total_Quantity: item.Total_Quantity,
                Total_Amount: item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerTypeItemIDStore_ID(data){
    return data.reduce((acc,item)=>{
        const key =`${item.CustomerType}-${item.ItemID}-${item.Store_ID}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                CustomerType : item.CustomerType,
                ItemID : item.ItemID,
                Store_ID : item.Store_ID,
                Total_Amount: item.Total_Amount,
                Total_Quantity : item.Total_Quantity
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerTypeItemIDTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.CustomerType}-${item.ItemID}-${item.Year}-${item.Quarter}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Year : item.Year,
                Quarter : item.Quarter,
                CustomerType : item.CustomerType,
                ItemID : item.ItemID,
                Store_ID : item.Store_ID
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerTypeLocationTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.CustomerType}-${item.City_name}-${item.State}-${item.Year}-${item.Quarter}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Year : item.Year,
                Quarter : item.Quarter,
                CustomerType : item.CustomerType,
                City_name : item.City_name,
                State : item.State,

                Total_Quantity: item.Total_Quantity,
                Total_Amount : item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerTypeLocationStore_ID(data){
    return data.reduce((acc,item)=>{
        const key =`${item.CustomerType}-${item.City_name}-${item.State}-${item.Store_ID}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Store_ID : item.Store_ID,
                CustomerType : item.CustomerType,
                City_name : item.City_name,
                State : item.State,

                Total_Quantity: item.Total_Quantity,
                Total_Amount : item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerTypeLocationItemID(data){
    return data.reduce((acc,item)=>{
        const key =`${item.CustomerType}-${item.City_name}-${item.State}-${item.ItemID}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                ItemID : item.ItemID,
                CustomerType : item.CustomerType,
                City_name : item.City_name,
                State : item.State,

                Total_Quantity: item.Total_Quantity,
                Total_Amount : item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByLocationItemIDStore_IDTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Year}-${item.Quarter}-${item.Store_ID}-${item.City_name}-${item.State}-${item.ItemID}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Year : item.Year,
                Quarter : item.Quarter,
                ItemID : item.ItemID,
                Store_ID : item.Store_ID,
                City_name : item.City_name,
                State : item.State,

                Total_Quantity: item.Total_Quantity,
                Total_Amount : item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerTypeItemIDStore_IDTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Year}-${item.Quarter}-${item.Store_ID}-${item.CustomerType}-${item.ItemID}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Year : item.Year,
                Quarter : item.Quarter,
                ItemID : item.ItemID,
                Store_ID : item.Store_ID,
                CustomerType : item.CustomerType,

                Total_Quantity: item.Total_Quantity,
                Total_Amount : item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerTypeLocationStore_IDTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Year}-${item.Quarter}-${item.Store_ID}-${item.CustomerType}-${item.City_name}-${item.State}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Year : item.Year,
                Quarter : item.Quarter,
                City_name : item.City_name,
                State : item.State,
                Store_ID : item.Store_ID,
                CustomerType : item.CustomerType,

                Total_Quantity: item.Total_Quantity,
                Total_Amount : item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerTypeLocationItemIDTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Year}-${item.Quarter}-${item.ItemID}-${item.CustomerType}-${item.City_name}-${item.State}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Year : item.Year,
                Quarter : item.Quarter,
                City_name : item.City_name,
                State : item.State,
                ItemID : item.ItemID,
                CustomerType : item.CustomerType,

                Total_Quantity: item.Total_Quantity,
                Total_Amount : item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerTypeLocationItemIDStore_ID(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Store_ID}-${item.ItemID}-${item.CustomerType}-${item.City_name}-${item.State}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Store_ID : item.Store_ID,
                City_name : item.City_name,
                State : item.State,
                ItemID : item.ItemID,
                CustomerType : item.CustomerType,

                Total_Quantity: item.Total_Quantity,
                Total_Amount : item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerTypeLocationItemIDStore_IDTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.CustomerType}-${item.ItemID}-${item.Store_ID}-${item.Year}-${item.Quarter}-${item.City_name}-${item.State}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                City_name : item.City_name,
                State : item.State,
                Year : item.Year,
                Quarter : item.Quarter,
                CustomerType : item.CustomerType,
                ItemID : item.ItemID,
                Store_ID : item.Store_ID,
                Total_Quantity: item.Total_Quantity,
                Total_Amount : item.Total_Amount
            });
        }
        return acc;
    },[])
}
app.get('/CustomerType-location',async (req,res) =>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT CustomerType,City_name,State, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByCustomerTypeLocation(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/CustomerType-ItemID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT CustomerType,ItemID, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByCustomerTypeItemID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/CustomerType-Store_ID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT CustomerType,Store_ID, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByCustomerTypeStore_ID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/CustomerType-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT CustomerType,Quarter,Year, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByCustomerTypeTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/Store_ID-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT Store_ID,Quarter ,Year ,Total_Quantity,Total_Amount  FROM huy3');
        const aggregatedData = aggregateDataByStore_IDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/ItemID-Store_ID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT ItemID,Store_ID, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByItemIDStore_ID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/location-Store_ID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT Store_ID,City_name,State, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByLocationStore_ID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/location-ItemID-Store_ID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,ItemID,Store_ID, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByLocationItemIDStore_ID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/location-ItemID-time', async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,ItemID,Quarter,Year, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByLocationItemIDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/location-Store_ID-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,Store_ID,Quarter,Year, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByLocationStore_IDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/ItemID-Store_ID-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT Store_ID,ItemID,Quarter,Year, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByItemIDStore_IDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/CustomerType-Store_ID-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT CustomerType,Store_ID,Quarter,Year, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByCustomerTypeStore_IDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/CustomerType-ItemID-Store_ID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT CustomerType,ItemID,Store_ID, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByCustomerTypeItemIDStore_ID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/CustomerType-ItemID-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT CustomerType,ItemID,Quarter,Year, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByCustomerTypeItemIDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/CustomerType-location-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,CustomerType,Quarter,Year, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByCustomerTypeLocationTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/CustomerType-location-Store_ID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,CustomerType,Store_ID, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByCustomerTypeLocationStore_ID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/CustomerType-ItemID-location',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT CustomerType,Location,ItemID, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByCustomerTypeLocationItemID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/location-ItemID-Store_ID-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,ItemID,Store_ID,Quarter,Year, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByLocationItemIDStore_IDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/CustomerType-ItemID-Store_ID-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT CustomerType,Store_ID,ItemID,Quarter,Year, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByCustomerTypeItemIDStore_IDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/CustomerType-location-Store_ID-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,CustomerType,Store_ID,Quarter,Year, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByCustomerTypeLocationStore_IDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/CustomerType-ItemID-location-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,CustomerType,ItemID,Quarter,Year, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByCustomerTypeLocationItemIDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/CustomerType-ItemID-location-Store_ID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,CustomerType,Store_ID,ItemID, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByCustomerTypeLocationItemIDStore_ID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/Store_ID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT Store_ID, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByStore_ID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/CustomerType',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT CustomerType, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByCustomerType(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT Year,Quarter, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/ItemID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT ItemID, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByItemID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/location',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByLocation(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/location-time', async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,Year,Quarter, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByLocationTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/ItemID-Time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT ItemID,Year,Quarter, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByItemIDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/location-ItemID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,ItemID, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByLocationItemID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/CustomerType-ItemID-location-Store_ID-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,Year,Quarter,CustomerType,ItemID,Store_ID, Total_Quantity, Total_Amount FROM huy3');
        const aggregatedData = aggregateDataByCustomerTypeLocationItemIDStore_IDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT * FROM huy3');
        res.json(result.recordset);
    }catch (err) {
        res.status(500).send(err.message);
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
