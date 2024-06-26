import React, { useEffect, useState, useRef } from 'react';
import { PivotViewComponent, FieldList, Inject } from '@syncfusion/ej2-react-pivotview';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';
import { enableRipple } from '@syncfusion/ej2-base';
import './App.css';

enableRipple(true);

const App = () => {
    const [pivotData, setPivotData] = useState([]);
    const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
    const [currentUrl, setCurrentUrl] = useState<string>('');

    // Create refs for each CheckBoxComponent
    const timeRef = useRef<CheckBoxComponent>(null);
    const ItemIDRef = useRef<CheckBoxComponent>(null);
    const Store_IDRef = useRef<CheckBoxComponent>(null);
    const CustomerTypeRef = useRef<CheckBoxComponent>(null);
    const locationRef = useRef<CheckBoxComponent>(null);
    const RESTART = useRef<CheckBoxComponent>(null);
    useEffect(() => {
        // Construct the endpoint based on selected dimensions
        const dimensionsStr = selectedDimensions.join('-');
        const apiUrl = `http://localhost:3003/${dimensionsStr ? dimensionsStr : 'location'}`;

        setCurrentUrl(apiUrl);

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => setPivotData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [selectedDimensions]);

    const updateDimensions = (dimensions: string[]): string[] => {
        return dimensions.sort((a, b) => a.localeCompare(b));
    };

    const handleCheckboxChange = () => {
        const updatedDimensions: string[] = [];

        const refs: { [key: string]: React.RefObject<CheckBoxComponent> } = {
            time: timeRef,
            ItemID: ItemIDRef,
            location: locationRef,
            Store_ID: Store_IDRef,
            CustomerType: CustomerTypeRef,
            RESTART:RESTART
        };

        Object.keys(refs).forEach(dim => {
            if (refs[dim].current?.checked) {
                updatedDimensions.push(dim);
            }
        });

        setSelectedDimensions(updateDimensions(updatedDimensions));
    };

    return (
        <div className="App">
            <div className="checkbox-container">
                <CheckBoxComponent
                    label="Time"
                    ref={timeRef}
                    onChange={handleCheckboxChange}
                    checked={selectedDimensions.includes('time')}
                />
                <CheckBoxComponent
                    label="Location"
                    ref={locationRef}
                    onChange={handleCheckboxChange}
                    checked={selectedDimensions.includes('location')}
                />
                <CheckBoxComponent
                    label="Store_ID"
                    ref={Store_IDRef}
                    onChange={handleCheckboxChange}
                    checked={selectedDimensions.includes('Store_ID')}
                />
                <CheckBoxComponent
                    label="CustomerType"
                    ref={CustomerTypeRef}
                    onChange={handleCheckboxChange}
                    checked={selectedDimensions.includes('CustomerType')}
                />
                <CheckBoxComponent
                    label="ItemID"
                    ref={ItemIDRef}
                    onChange={handleCheckboxChange}
                    checked={selectedDimensions.includes('ItemID')}
                />
                <CheckBoxComponent
                    label="RESTART"
                    ref={RESTART}
                    onChange={handleCheckboxChange}
                    checked={selectedDimensions.includes('RESTART')}
                />
            </div>
            <div className="current-url">
                <strong>Current URL: </strong><span>{currentUrl}</span>
            </div>
            <PivotViewComponent
                dataSourceSettings={{
                    dataSource: pivotData,
                    values: [
                        { name: "Total_Amount",caption :"Amount"},
                        { name: "Total_Quantity" ,caption: "Sold"},
                    ],
                    rows: selectedDimensions.includes('ItemID') ? [{ name: "ItemID" }] : [],
                    columns: selectedDimensions.filter(dim => dim !== 'ItemID').map(dim => ({ name: dim.charAt(0).toUpperCase() + dim.slice(1) })),
                    calculatedFieldSettings: [{ name: "Total", formula: '"Sum(Total_Amount)"+"Sum(Total_Quantity)"' }],
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
