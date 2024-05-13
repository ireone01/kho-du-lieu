import React, { useEffect, useState, useRef } from 'react';
import { PivotViewComponent, FieldList, Inject } from '@syncfusion/ej2-react-pivotview';
import { CheckBoxComponent, ChangeEventArgs } from '@syncfusion/ej2-react-buttons';
import { enableRipple } from '@syncfusion/ej2-base';
import './App.css';

enableRipple(true);

const App = () => {
    const [pivotData, setPivotData] = useState([]);
    const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);

    // Create refs for each CheckBoxComponent
    const yearRef = useRef<CheckBoxComponent>(null);
    const quarterRef = useRef<CheckBoxComponent>(null);
    const productsRef = useRef<CheckBoxComponent>(null);
    const countryRef = useRef<CheckBoxComponent>(null);

    useEffect(() => {
        const dimensionsStr = selectedDimensions.join('-');
        const apiUrl = `http://localhost:3003/${dimensionsStr ? dimensionsStr : 'country-products-quarter-year'}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => setPivotData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [selectedDimensions]);

    const updateDimensions = (dimensions: string[]): string[] => {
        return dimensions.sort((a, b) => a.localeCompare(b));
    };

    const handleCheckboxChange = () => {
        setSelectedDimensions(() => {
            let updatedDimensions: string[] = [];

            const refs: { [key: string]: React.RefObject<CheckBoxComponent> } = {
                year: yearRef,
                quarter: quarterRef,
                products: productsRef,
                country: countryRef
            };

            Object.keys(refs).forEach(dim => {
                if (refs[dim].current?.checked) {
                    updatedDimensions.push(dim);
                }
            });

            return updateDimensions(updatedDimensions);
        });
    };

    return (
        <div className="App">
            <div className="checkbox-container">
                <CheckBoxComponent
                    label="Year"
                    ref={yearRef}
                    onChange={handleCheckboxChange}
                    checked={selectedDimensions.includes('year')}
                />
                <CheckBoxComponent
                    label="Quarter"
                    ref={quarterRef}
                    onChange={handleCheckboxChange}
                    checked={selectedDimensions.includes('quarter')}
                />
                <CheckBoxComponent
                    label="Products"
                    ref={productsRef}
                    onChange={handleCheckboxChange}
                    checked={selectedDimensions.includes('products')}
                />
                <CheckBoxComponent
                    label="Country"
                    ref={countryRef}
                    onChange={handleCheckboxChange}
                    checked={selectedDimensions.includes('country')}

                />
            </div>
            <PivotViewComponent
                dataSourceSettings={{
                    dataSource: pivotData,
                    values: [
                        { name: "Sold", caption: "Units Sold" },
                        { name: "Amount", caption: "Sold Amount" },
                    ],
                    rows: selectedDimensions.includes('products') ? [{ name: "Products" }] : [],
                    columns: selectedDimensions.filter(dim => dim !== 'products').map(dim => ({ name: dim.charAt(0).toUpperCase() + dim.slice(1) })),
                    calculatedFieldSettings: [{ name: "Total", formula: '"Sum(Amount)"+"Sum(Sold)"' }],
                }}
                showFieldList={true}
                allowCalculatedField={true}
                height={'500px'}
                width={'1500px'}

            >
                <Inject services={[FieldList]} />
            </PivotViewComponent>
        </div>
    );
}

export default App;
