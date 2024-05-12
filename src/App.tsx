import React, { useEffect, useState } from 'react';
import {FieldList, Inject, PivotViewComponent, CalculatedField} from '@syncfusion/ej2-react-pivotview'
// import {pivotData} from './data';
import './App.css';
function App() {
        const [pivotData, setPivotData] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/') // Adjust the URL as needed
            .then(response => response.json())
            .then(data => setPivotData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);
  return (
    <div className="App">

        <PivotViewComponent
        dataSourceSettings={{
            dataSource: pivotData,
            values: [
                {name: "Sold",caption:"Units Sold"},
                {name: "Amount" , caption: "Sold Amount"},
                {name: "Total", caption: "Total Units", type: "CalculatedField"}
            ],
            rows: [
                {name: "Country"},
                {name: "Products"},

            ],
            columns: [
                {name: "Year"},
                {name: "Quarter"}
            ],

            calculatedFieldSettings: [{
                name: "Total",
                formula: '"Sum(Amount)"+"Sum(Sold)"'
            }]
        }}

        showFieldList={true}
        allowCalculatedField={true}
        height={'500'}
        width={'1500'}
        >
           <Inject services={[FieldList]}></Inject>
        </PivotViewComponent>
    </div>
  );
}

export default App;
