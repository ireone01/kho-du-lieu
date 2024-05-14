const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

// Đọc file JSON
const dataPath = path.join(__dirname, 'salesData.json');
let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

function aggregateDataByProducts(data){
    return data.reduce((acc, item) => {
        // Tìm kiếm một sản phẩm hiện có trong mảng kết quả
        const existingProduct = acc.find(prod => prod.Products === item.Products);
        if (existingProduct) {
            existingProduct.Sold += item.Sold;
            existingProduct.Amount += item.Amount;
        } else {
            // Thêm sản phẩm mới vào mảng kết quả
            acc.push({
                Products: item.Products,
                Sold: item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    }, []);

}

function aggregateDataByCountryState(data){
    return data.reduce((acc,item) =>{
        const key=`${item.Country}-${item.State}`;
        const exis =acc.find(entry => entry.key === key);
        if(exis) {
            exis.Sold += item.Sold;
            exis.Amount += item.Amount;
        }else {
            acc.push({
                Country : item.Country,
                State : item.State,
                Sold : item.Sold,
                Amount : item.Amount
            });
        }
        return acc;
    },[]);
}
function aggregateDataByQuarterYear(data) {
    return data.reduce((acc, item) => {
        const key = `${item.Quarter}-${item.Year}`;
        const existingEntry = acc.find(entry => entry.key === key);
        if (existingEntry) {
            existingEntry.Sold += item.Sold;
            existingEntry.Amount += item.Amount;
        } else {
            acc.push({

                Quarter: item.Quarter,
                Year: item.Year,
                Sold: item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    }, []);
}

function aggregateDataByQuarterYearProducts(data) {
    return data.reduce((acc, item) => {
        const key = `${item.Quarter}-${item.Year}-${item.Products}`;
        const exis =acc.find(entry => entry.key===key);
        if (exis) {
           exis.Sold += item.Sold;
            exis.Amount += item.Amount;
        } else {
           acc.push ({
                Products: item.Products,
                Year: item.Year,
                Quarter: item.Quarter,
                Sold: item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    }, []);
}

function aggregateDataByAll(data){
    return data.reduce((acc,item) =>{
        const key = `${item.Year}-${item.Products}-${item.Country}-${item.Quarter}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Sold += item.Sold;
            exis.Amount += item.Amount;
        }else {
            acc.push({
                Year: item.Year,
                Quarter: item.Quarter,
                Products: item.Products,
                Country: item.Country,
                Sold: item.Sold,
                Amount: item.Amount
            });
        }
        return acc ;
    }, [])
}
function aggregateDataByCountryProductsState(data){
    return data.reduce((acc,item) =>{
        const key =`${item.Country}-${item.Products}-${item.State}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Sold += item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Country : item.Country,
                Products : item.Products,
                State : item.State,
                Sold : item.Sold,
                Amount : item.Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCountryQuarterStateYear(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Country}-${item.Quarter}-${item.State}-${item.Year}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Sold += item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Country: item.Country,
                Quarter: item.Quarter,
                State: item.State,
                Year: item.Year,
                Sold: item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCountryProductsQuarterStateYear(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Country}-${item.Products}-${item.Quarter}-${item.State}-${item.Year}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Sold += item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Country: item.Country,
                Products: item.Products,
                Quarter: item.Quarter,
                State: item.State,
                Year: item.Year,
                Sold: item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    },[])
}
app.get('/location-products-time', (req,res)=>{
    const aggregatedData = aggregateDataByCountryProductsQuarterStateYear(data);
    res.json(aggregatedData);
})
app.get('/location-time', (req,res) =>{
    const aggregatedData = aggregateDataByCountryQuarterStateYear(data);
    res.json(aggregatedData);
})
app.get('/time',(req,res) =>{
    const aggregatedData =aggregateDataByQuarterYear(data);
    res.json(aggregatedData);
})
app.get('/products-time',(req,res) =>{
    const aggregatedData =aggregateDataByQuarterYearProducts(data);
    res.json(aggregatedData);
})
app.get('/products',(req,res) =>{
    const aggregatedData = aggregateDataByProducts(data);
    res.json(aggregatedData);
})
app.get('/location', (req,res)=>{
    const aggregatedData =aggregateDataByCountryState(data);
    res.json(aggregatedData);
})
app.get('/location-products',(req,res) =>{
    const aggregatedData =aggregateDataByCountryProductsState(data);
    res.json(aggregatedData);
})
app.get('/', (req, res) => {
    res.json(data);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
