const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const app = express();
const port = 3007;
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
        // Tìm kiếm một sản phẩm hiện có trong mảng kết quả
        const existingProduct = acc.find(prod => prod.ItemID === item.ItemID);
        if (existingProduct) {
            existingProduct.Total_Quantity+= item.Total_Quantity;
            existingProduct.Total_Amount += item.Total_Amount;
        } else {
            // Thêm sản phẩm mới vào mảng kết quả
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
        const exis = add.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+= item.Total_Quantity;
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
function aggregateDataByCustomer(data){
    return data.reduce((acc,item) => {
        const key = `${item.Customer}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+= item.Total_Quantity;
            exis.Total_Amount += item.Total_Amount;
        }else{
            acc.push({
                Customer : item.Customer,
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
function aggregateDataByCustomerTime(data){
    return data.reduce((acc,item)=>{
        const key = `${item.Customer}-${item.Year}-${item.Quarter}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Customer : item.Customer,
                Year : item.Year,
                Quarter : item.Quarter,
                Total_Quantity: item.Total_Quantity,
                Total_Amount: item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerStore_ID(data){
    return data.reduce((acc,item)=>{
        const key = `${item.Customer}-${item.Store_ID}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Customer : item.Customer,
                Store_ID : item.Store_ID,
                Total_Quantity: item.Total_Quantity,
                Total_Amount: item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerItemID(data){
    return data.reduce((acc,item)=>{
        const key = `${item.Customer}-${item.ItemID}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Customer : item.Customer,
                ItemID : item.ItemID,
                Total_Quantity: item.Total_Quantity,
                Total_Amount: item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerLocation(data){
    return  data.reduce((acc,item)=>{
        const key = `${item.Customer}-${item.City_name}-${item.State}`;
        const exis = acc.find(entry =>entry.key === key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount += item.Total_Amount;
        }else{
            acc.push({
                Customer : item.Customer,
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
//customer-location-ItemID-Store_ID-time
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
function aggregateDataByCustomerStore_IDTime(data){
    return data.reduce((acc,item)=>{
        const key = `${item.Store_ID}-${item.Year}-${item.Quarter}-${item.Customer}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Year : item.Year,
                Quarter : item.Quarter,
                Store_ID : item.Store_ID,
                Customer : item.Customer,
                Total_Quantity: item.Total_Quantity,
                Total_Amount: item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerItemIDStore_ID(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Customer}-${item.ItemID}-${item.Store_ID}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Customer : item.Customer,
                ItemID : item.ItemID,
                Store_ID : item.Store_ID
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerItemIDTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Customer}-${item.ItemID}-${item.Year}-${item.Quarter}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Year : item.Year,
                Quarter : item.Quarter,
                Customer : item.Customer,
                ItemID : item.ItemID,
                Store_ID : item.Store_ID
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerLocationTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Customer}-${item.City_name}-${item.State}-${item.Year}-${item.Quarter}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Year : item.Year,
                Quarter : item.Quarter,
                Customer : item.Customer,
                City_name : item.City_name,
                State : item.State,

                Total_Quantity: item.Total_Quantity,
                Total_Amount : item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerLocationStore_ID(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Customer}-${item.City_name}-${item.State}-${item.Store_ID}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                Store_ID : item.Store_ID,
                Customer : item.Customer,
                City_name : item.City_name,
                State : item.State,

                Total_Quantity: item.Total_Quantity,
                Total_Amount : item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerLocationItemID(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Customer}-${item.City_name}-${item.State}-${item.ItemID}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Total_Quantity+=item.Total_Quantity;
            exis.Total_Amount +=item.Total_Amount;
        }else{
            acc.push({
                ItemID : item.ItemID,
                Customer : item.Customer,
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
function aggregateDataByCustomerItemIDStore_IDTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Year}-${item.Quarter}-${item.Store_ID}-${item.Customer}-${item.ItemID}`;
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
                Customer : item.Customer,

                Total_Quantity: item.Total_Quantity,
                Total_Amount : item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerLocationStore_IDTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Year}-${item.Quarter}-${item.Store_ID}-${item.Customer}-${item.City_name}-${item.State}`;
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
                Customer : item.Customer,

                Total_Quantity: item.Total_Quantity,
                Total_Amount : item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerLocationItemIDTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Year}-${item.Quarter}-${item.ItemID}-${item.Customer}-${item.City_name}-${item.State}`;
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
                Customer : item.Customer,

                Total_Quantity: item.Total_Quantity,
                Total_Amount : item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerLocationItemIDStore_ID(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Store_ID}-${item.ItemID}-${item.Customer}-${item.City_name}-${item.State}`;
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
                Customer : item.Customer,

                Total_Quantity: item.Total_Quantity,
                Total_Amount : item.Total_Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerLocationItemIDStore_IDTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Customer}-${item.ItemID}-${item.Store_ID}-${item.Year}-${item.Quarter}-${item.City_name}-${item.State}`;
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
                Customer : item.Customer,
                ItemID : item.ItemID,
                Store_ID : item.Store_ID,
                Total_Quantity: item.Total_Quantity,
                Total_Amount : item.Total_Amount
            });
        }
        return acc;
    },[])
}
app.get('/customer-location',async (req,res) =>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT Customer,City_name,State, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByCustomerLocation(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/customer-ItemID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT Customer,ItemID, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByCustomerItemID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/customer-Store_ID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT Customer,Store_ID, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByCustomerStore_ID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/customer-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT Customer,Quarter,Year, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByCustomerTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/Store_ID-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT Store_ID,Quarter ,Year ,Total_Quantity,Total_Amount  FROM huy2');
        const aggregatedData = aggregateDataByStore_IDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/ItemID-Store_ID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT ItemID,Store_ID, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByItemIDStore_ID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/location-Store_ID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT Store_ID,City_name,State, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByLocationStore_ID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/location-ItemID-Store_ID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,ItemID,Store_ID, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByLocationItemIDStore_ID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/location-ItemID-time', async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,ItemID,Quarter,Year, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByLocationItemIDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/location-Store_ID-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,Store_ID,Quarter,Year, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByLocationStore_IDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/ItemID-Store_ID-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT Store_ID,ItemID,Quarter,Year, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByItemIDStore_IDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/customer-Store_ID-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT Customer,Store_ID,Quarter,Year, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByCustomerStore_IDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/customer-ItemID-Store_ID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT Customer,ItemID,Store_ID, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByCustomerItemIDStore_ID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/customer-ItemID-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT Customer,ItemID,Quarter,Year, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByCustomerItemIDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/customer-location-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,Customer,Quarter,Year, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByCustomerLocationTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/customer-location-Store_ID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,Customer,Store_ID, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByCustomerLocationStore_ID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/customer-location-ItemID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT Customer,Location,ItemID, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByCustomerLocationItemID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/location-ItemID-Store_ID-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,ItemID,Store_ID,Quarter,Year, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByLocationItemIDStore_IDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/customer-ItemID-Store_ID-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT Customer,Store_ID,ItemID,Quarter,Year, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByCustomerItemIDStore_IDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/customer-location-Store_ID-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,Customer,Store_ID,Quarter,Year, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByCustomerLocationStore_IDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/customer-location-ItemID-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,Customer,ItemID,Quarter,Year, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByCustomerLocationItemIDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/customer-location-ItemID-Store_ID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,Customer,Store_ID,ItemID, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByCustomerLocationItemIDStore_ID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/Store_ID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT Store_ID, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByStore_ID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/customer',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT Customer, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByCustomer(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT Year,Quarter, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/ItemID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT ItemID, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByItemID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/location',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByLocation(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/location-time', async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,Year,Quarter, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByLocationTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/ItemID-Time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT ItemID,Year,Quarter, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByItemIDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/location-ItemID',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,ItemID, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByLocationItemID(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/CustomerType-location-ItemID-Store_ID-time',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT City_name,State,Year,Quarter,Customer,ItemID,Store_ID, Total_Quantity, Total_Amount FROM huy2');
        const aggregatedData = aggregateDataByCustomerLocationItemIDStore_IDTime(result.recordset);
        res.json(aggregatedData);
    }catch (err) {
        res.status(500).send(err.message);
    }
})
app.get('/',async (req,res)=>{
    try {
        await sql.connect(config);
        const result = await sql.query('SELECT * FROM huy2');
        res.json(result.recordset);
    }catch (err) {
        res.status(500).send(err.message);
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
