const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

// Đọc file JSON
const dataPath = path.join(__dirname, 'salesData.json');
let data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
// Hàm để tính toán tổng Sold và Amount theo quarter
function aggregateDataByQuarter(data){
    return data.reduce((acc, item) => {
        const existingQuarter = acc.find(q => q.Quarter === item.Quarter);
        if (existingQuarter) {
            existingQuarter.Sold += item.Sold;
            existingQuarter.Amount += item.Amount;
        } else {
            acc.push({
                Quarter: item.Quarter,
                Sold: item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    }, []);
}

function aggregateDataByYear(data){
    return data.reduce((acc, item) => {
        const existingYear = acc.find(y => y.Year === item.Year);
        if (existingYear) {
            existingYear.Sold += item.Sold;
            existingYear.Amount += item.Amount;
        } else {
            acc.push({
                Year: item.Year,
                Sold: item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    }, []);
}

function aggregateDataByCountry(data) {
    return data.reduce((acc, item) => {
        const existingCountry = acc.find(c => c.Country === item.Country);
        if (existingCountry) {
            existingCountry.Sold += item.Sold;
            existingCountry.Amount += item.Amount;
        } else {
            acc.push({
                Country: item.Country,
                Sold: item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    }, []);
}

// Hàm để tính toán tổng Sold và Amount theo products
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

// Hàm để tính toán tổng Sold và Amount theo country-year
function aggregateDataByCountryYear(data){
    return data.reduce((acc, item) => {
        const key = `${item.Country}-${item.Year}`;
        const existingEntry = acc.find(entry => entry.key === key);
        if (existingEntry) {
            existingEntry.Sold += item.Sold;
            existingEntry.Amount += item.Amount;
        } else {
            acc.push({

                Year: item.Year,
                Country: item.Country,
                Sold: item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    }, []);
}

function aggregateDataByQuarterCountry(data) {
    return data.reduce((acc, item) => {
        const key = `${item.Country}-${item.Quarter}`;
        const existingEntry = acc.find(entry => entry.key === key);
        if (existingEntry) {
            existingEntry.Sold += item.Sold;
            existingEntry.Amount += item.Amount;
        } else {
            acc.push({

                Quarter: item.Quarter,
                Country: item.Country,
                Sold: item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    }, []);
}

function aggregateDataByCountryProducts(data) {
    return data.reduce((acc, item) => {
        const key = `${item.Country}-${item.Products}`;
        const existingEntry = acc.find(entry => entry.key === key);
        if (existingEntry) {
            existingEntry.Sold += item.Sold;
            existingEntry.Amount += item.Amount;
        } else {
            acc.push({

                Products: item.Products,
                Country: item.Country,
                Sold: item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    }, []);
}

// Hàm để tính toán tổng Sold và Amount theo year-products
function aggregateDataByYearProducts(data) {
    return data.reduce((acc, item) => {
        const key = `${item.Year}-${item.Products}`;
        const existingEntry = acc.find(entry => entry.key === key);
        if (existingEntry) {
            existingEntry.Sold += item.Sold;
            existingEntry.Amount += item.Amount;
        } else {
            acc.push({

                Year: item.Year,
                Products: item.Products,
                Sold: item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    }, []);
}

function aggregateDataByQuarterProducts(data) {
    return data.reduce((acc, item) => {
        const key = `${item.Quarter}-${item.Products}`;
        const existingEntry = acc.find(entry => entry.key === key);
        if (existingEntry) {
            existingEntry.Sold += item.Sold;
            existingEntry.Amount += item.Amount;
        } else {
            acc.push({

                Quarter: item.Quarter,
                Products: item.Products,
                Sold: item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    }, []);
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

// Hàm để tính toán tổng Sold và Amount theo quarter-year-products
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
app.get('/products-quarter-year',(req,res) =>{
    const aggregatedData =aggregateDataByQuarterYearProducts(data);
    res.json(aggregatedData);
})

function aggregateDataByQuarterYearCountry(data) {
    return data.reduce((acc, item) => {
        const key = `${item.Quarter}-${item.Year}-${item.Country}`;
        const exis = acc.find(entry => entry.key === key);
        if (exis) {
            exis.Sold += item.Sold;
            exis.Amount += item.Amount;
        } else {
             acc.push({
                Country: item.Country,
                Year: item.Year,
                Quarter: item.Quarter,
                Sold: item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    }, []);
}
app.get('/country-quarter-year',(req,res) =>{
    const aggregatedData =aggregateDataByQuarterYearProducts(data);
    res.json(aggregatedData);
})

function aggregateDataByQuarterProductsCountry(data) {
    return data.reduce((acc, item) => {
        const key = `${item.Quarter}-${item.Products}-${item.Country}`;
        const exis = acc.find(entry => entry.key === key);
        if (exis) {
            exis.Sold += item.Sold;
            exis.Amount += item.Amount;
        } else {
           acc.push({
                Country: item.Country,
                Products: item.Products,
                Quarter: item.Quarter,
                Sold: item.Sold,
                Amount: item.Amount
            });
        }
        return acc;
    }, []);
}
app.get('/country-products-quarter',(req,res) =>{
    const aggregatedData =aggregateDataByQuarterProductsCountry(data);
    res.json(aggregatedData);
})

function aggregateDataByYearProductsCountry(data) {
    return data.reduce((acc, item) => {
        const key = `${item.Year}-${item.Products}-${item.Country}`;
        const exis = acc.find(entry => entry.key === key);
        if (exis) {
            exis.Sold += item.Sold;
            exis.Amount += item.Amount;
        } else {
           acc.push({
                Country: item.Country,
                Products: item.Products,
                Year: item.Year,
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
app.get('/country-products-year',(req,res) =>{
    const aggregatedData =aggregateDataByYearProductsCountry(data);
    res.json(aggregatedData);
})

app.get('/country-products-quarter-year', (req ,res)=>{
    const aggregatedData = aggregateDataByAll(data);
    res.json(aggregatedData);
})

app.get('/quarter-year',(req,res) =>{
    const aggregatedData =aggregateDataByQuarterYear(data);
    res.json(aggregatedData);
})
app.get('/products-quarter',(req,res) =>{
    const aggregatedData =aggregateDataByQuarterProducts(data);
    res.json(aggregatedData);
})
app.get('/products-year',(req,res) =>{
    const aggregatedData =aggregateDataByYearProducts(data);
    res.json(aggregatedData);
})
app.get('/country-products',(req,res) =>{
    const aggregatedData =aggregateDataByCountryProducts(data);
    res.json(aggregatedData);
})
app.get('/country-year',(req,res) =>{
    const aggregatedData =aggregateDataByCountryYear(data);
    res.json(aggregatedData);
})
app.get('/quarter',(req,res)=>{
    const aggregatedData = aggregateDataByQuarter(data);
    res.json(aggregatedData);
})
app.get('/year',(req,res)=>{
    const aggregatedData = aggregateDataByYear(data);
    res.json(aggregatedData);
})
app.get('/products',(req,res) =>{
    const aggregatedData = aggregateDataByProducts(data);
    res.json(aggregatedData);
})
// Endpoint để lấy dữ liệu tổng hợp theo Country
app.get('/country', (req, res) => {
    const aggregatedData = aggregateDataByCountry(data);
    res.json(aggregatedData);
});

// Endpoint lấy dữ liệu tổng hợp theo Quarter và Country
app.get('/country-quarter', (req, res) => {
    const aggregatedData = aggregateDataByQuarterCountry(data);
    res.json(aggregatedData);
});

// Endpoint gốc để trả về dữ liệu không thay đổi
app.get('/', (req, res) => {
    res.json(data);
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
