// server-type1 : là khi ta có file data như salesData.json
// copyvaofo server.js trong src xong chạy
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
function aggregateDataByStore(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Store}`;
        const exis = add.find(entry => entry.key === key);
        if(exis){
            exis.Sold += item.Sold;
            exis.Amount += item.Amount;
        }else{
            acc.push({
                Store : item.Store,
                Sold : item.Sold,
                Amount : item.Amount
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
            exis.Sold += item.Sold;
            exis.Amount += item.Amount;
        }else{
            acc.push({
                Customer : item.Customer,
                Sold : item.Sold,
                Amount : item.Amount
            });
        }
        return acc
    },[])
}
function aggregateDataByProductsStore(data){
    return data.reduce((acc,item)=>{
        const key = `${item.Store}-${item.Products}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Sold +=item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Store : item.Store,
                Products : item.Products,

                Sold : item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByStoreTime(data){
    return data.reduce((acc,item)=>{
        const key = `${item.Store}-${item.Year}-${item.Quarter}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Sold +=item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Store : item.Store,
                Year : item.Year,
                Quarter : item.Quarter,
                Sold : item.Sold,
                Amount: item.Amount
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
            exis.Sold +=item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Customer : item.Customer,
                Year : item.Year,
                Quarter : item.Quarter,
                Sold : item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerStore(data){
    return data.reduce((acc,item)=>{
        const key = `${item.Customer}-${item.Store}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Sold +=item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Customer : item.Customer,
                Store : item.Store,
                Sold : item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerProducts(data){
    return data.reduce((acc,item)=>{
        const key = `${item.Customer}-${item.Products}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Sold +=item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Customer : item.Customer,
                Products : item.Products,
                Sold : item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerLocation(data){
    return  data.reduce((acc,item)=>{
        const key = `${item.Customer}-${item.Country}-${item.State}`;
        const exis = acc.find(entry =>entry.key === key);
        if(exis){
            exis.Sold +=item.Sold;
            exis.Amount += item.Amount;
        }else{
            acc.push({
                Customer : item.Customer,
                Country : item.Country,
                State : item.State,
                Sold : item.Sold,
                Amount : item.Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByLocationStore(data){
    return data.reduce((acc,item)=>{
        const key = `${item.Store}-${item.Country}-${item.State}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Sold +=item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Store : item.Store,
                Country : item.Country,
                State : item.State,
                Sold : item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    },[])
}
//customer-location-products-store-time
function aggregateDataByLocationProductsStore(data){
    return data.reduce((acc,item)=>{
        const key = `${item.Store}-${item.Products}-${item.Country}-${item.State}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Sold +=item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Store : item.Store,
                Products: item.Products,
                Country : item.Country,
                State : item.State,
                Sold : item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByLocationStoreTime(data){
    return data.reduce((acc,item)=>{
        const key = `${item.Store}-${item.Year}-${item.Quarter}-${item.Country}-${item.State}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Sold +=item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Year : item.Year,
                Quarter : item.Quarter,
                Store : item.Store,
                Country : item.Country,
                State : item.State,
                Sold : item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByProductsStoreTime(data){
    return data.reduce((acc,item)=>{
        const key = `${item.Store}-${item.Year}-${item.Quarter}-${item.Products}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Sold +=item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Year : item.Year,
                Quarter : item.Quarter,
                Store : item.Store,
                Products : item.Products,
                Sold : item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerStoreTime(data){
    return data.reduce((acc,item)=>{
        const key = `${item.Store}-${item.Year}-${item.Quarter}-${item.Customer}`;
        const exis =acc.find(entry => entry.key ===key);
        if(exis){
            exis.Sold +=item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Year : item.Year,
                Quarter : item.Quarter,
                Store : item.Store,
                Customer : item.Customer,
                Sold : item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerProductsStore(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Customer}-${item.Products}-${item.Store}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Sold +=item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Customer : item.Customer,
                Products : item.Products,
                Store : item.Store
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerProductsTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Customer}-${item.Products}-${item.Year}-${item.Quarter}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Sold +=item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Year : item.Year,
                Quarter : item.Quarter,
                Customer : item.Customer,
                Products : item.Products,
                Store : item.Store
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerLocationTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Customer}-${item.Country}-${item.State}-${item.Year}-${item.Quarter}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Sold +=item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Year : item.Year,
                Quarter : item.Quarter,
                Customer : item.Customer,
                Country : item.Country,
                State : item.State,

                Sold : item.Sold,
                Amount : item.Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerLocationStore(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Customer}-${item.Country}-${item.State}-${item.Store}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Sold +=item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Store : item.Store,
                Customer : item.Customer,
                Country : item.Country,
                State : item.State,

                Sold : item.Sold,
                Amount : item.Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerLocationProducts(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Customer}-${item.Country}-${item.State}-${item.Products}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Sold +=item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Products : item.Products,
                Customer : item.Customer,
                Country : item.Country,
                State : item.State,

                Sold : item.Sold,
                Amount : item.Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByLocationProductsStoreTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Year}-${item.Quarter}-${item.Store}-${item.Country}-${item.State}-${item.Products}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Sold +=item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Year : item.Year,
                Quarter : item.Quarter,
                Products : item.Products,
                Store : item.Store,
                Country : item.Country,
                State : item.State,

                Sold : item.Sold,
                Amount : item.Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerProductsStoreTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Year}-${item.Quarter}-${item.Store}-${item.Customer}-${item.Products}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Sold +=item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Year : item.Year,
                Quarter : item.Quarter,
                Products : item.Products,
                Store : item.Store,
                Customer : item.Customer,

                Sold : item.Sold,
                Amount : item.Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerLocationStoreTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Year}-${item.Quarter}-${item.Store}-${item.Customer}-${item.Country}-${item.State}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Sold +=item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Year : item.Year,
                Quarter : item.Quarter,
                Country : item.Country,
                State : item.State,
                Store : item.Store,
                Customer : item.Customer,

                Sold : item.Sold,
                Amount : item.Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerLocationProductsTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Year}-${item.Quarter}-${item.Products}-${item.Customer}-${item.Country}-${item.State}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Sold +=item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Year : item.Year,
                Quarter : item.Quarter,
                Country : item.Country,
                State : item.State,
                Products : item.Products,
                Customer : item.Customer,

                Sold : item.Sold,
                Amount : item.Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerLocationProductsStore(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Store}-${item.Products}-${item.Customer}-${item.Country}-${item.State}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Sold +=item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Store : item.Store,
                Country : item.Country,
                State : item.State,
                Products : item.Products,
                Customer : item.Customer,

                Sold : item.Sold,
                Amount : item.Amount
            });
        }
        return acc;
    },[])
}
function aggregateDataByCustomerLocationProductsStoreTime(data){
    return data.reduce((acc,item)=>{
        const key =`${item.Customer}-${item.Products}-${item.Store}-${item.Year}-${item.Quarter}-${item.Country}-${item.State}`;
        const exis = acc.find(entry => entry.key === key);
        if(exis){
            exis.Sold +=item.Sold;
            exis.Amount +=item.Amount;
        }else{
            acc.push({
                Country : item.Country,
                State : item.State,
                Year : item.Year,
                Quarter : item.Quarter,
                Customer : item.Customer,
                Products : item.Products,
                Store : item.Store,
                Sold : item.Sold,
                Amount : item.Amount
            });
        }
        return acc;
    },[])
}


app.get('/customer-location',(req,res) =>{
    const aggregatedData = aggregateDataByCustomerLocation(data);
    res.json(aggregatedData);
})
app.get('/customer-products',(req,res)=>{
    const aggregatedData = aggregateDataByCustomerProducts(data);
    res.json(aggregatedData);
})
app.get('/customer-store',(req,res)=>{
    const aggregatedData =aggregateDataByCustomerStore(data);
    res.json(aggregatedData);
})
app.get('/customer-time',(req,res)=>{
    const aggregatedData =aggregateDataByCustomerTime(data);
    res.json(aggregatedData);
})
app.get('/store-time',(req,res)=>{
    const aggregatedData = aggregateDataByStoreTime(data);
    res.json(aggregatedData);
})
app.get('/products-store', (req,res)=>{
    const aggregatedData = aggregateDataByProductsStore(data);
    res.json(aggregatedData);
})
app.get('/location-store',(req,res)=>{
    const aggregatedData = aggregateDataByLocationStore(data);
    res.json(aggregatedData);
})
app.get('/location-products-store',(req,res)=>{
    const agg =aggregateDataByLocationProductsStore(data);
    res.json(agg);
})
app.get('/location-products-time', (req,res)=>{
    const aggregatedData = aggregateDataByCountryProductsQuarterStateYear(data);
    res.json(aggregatedData);
})
app.get('/location-store-time',(req,res)=> {
    const agg =aggregateDataByLocationStoreTime(data);
    res.json(agg);
})
app.get('/products-store-time',(req,res)=>{
    const agg = aggregateDataByProductsStoreTime(data);
    res.json(agg);
})
app.get('/customer-store-time',(req,res)=>{
    const agg = aggregateDataByCustomerStoreTime(data);
    res.json(agg);
})
app.get('/customer-products-store',(req,res)=>{
    const agg = aggregateDataByCustomerProductsStore(data);
    res.json(agg);
})
app.get('/customer-products-time',(req,res)=>{
    const agg = aggregateDataByCustomerProductsTime(data);
    res.json(agg);
})
app.get('/customer-location-time',(req,res)=>{
    const agg =aggregateDataByCustomerLocationTime(data);
    res.json(agg);
})
app.get('/customer-location-store',(req,res)=>{
    const agg =aggregateDataByCustomerLocationStore(data);
    res.json(agg);
})
app.get('/customer-location-products',(req,res)=>{
    const a =aggregateDataByCustomerLocationProducts(data);
    res.json(a);
})
app.get('/location-products-store-time',(req,res)=>{
    const a =aggregateDataByLocationProductsStoreTime(data);
    res.json(a);
})
app.get('/customer-products-store-time',(req,res)=>{
    const a =aggregateDataByCustomerProductsStoreTime(data);
    res.json(a);
})
app.get('/customer-location-store-time',(req,res)=>{
    const a =aggregateDataByCustomerLocationStoreTime(data);
    res.json(a);
})
app.get('/customer-location-products-time',(req,res)=>{
    const a =aggregateDataByCustomerLocationProductsTime(data);
    res.json(a);
})
app.get('/customer-location-products-store',(req,res)=>{
    const a=aggregateDataByCustomerLocationProductsStore(data);
    res.json(a);
})
app.get('/store',(req,res)=>{
    const aggregatedData = aggregateDataByStore(data);
    res.json(aggregatedData);
})
app.get('/customer',(req,res)=>{
    const aggregatedData= aggregateDataByCustomer(data);
    res.json(aggregatedData);
})
app.get('/time',(req,res) =>{
    const aggregatedData =aggregateDataByQuarterYear(data);
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
app.get('/location-time', (req,res) =>{
    const aggregatedData = aggregateDataByCountryQuarterStateYear(data);
    res.json(aggregatedData);
})
app.get('/products-time',(req,res) =>{
    const aggregatedData =aggregateDataByQuarterYearProducts(data);
    res.json(aggregatedData);
})
app.get('/location-products',(req,res) =>{
    const aggregatedData =aggregateDataByCountryProductsState(data);
    res.json(aggregatedData);
})
app.get('/customer-location-products-store-time',(req,res)=>{
    const agg = aggregateDataByCustomerLocationProductsStoreTime(data);
    res.json(agg);
})
app.get('/', (req, res) => {
    res.json(data);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
