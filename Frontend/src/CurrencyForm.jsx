import Select from 'react-select';
import { useState, useEffect } from 'react';
import exchange from './assets/exchange.svg';

export default function CurrencyForm() {
    const [currencyCode, setCurrencyCode] = useState([]);
    const [firstValue, setFirstValue] = useState('');
    const [secondValue, setSecondValue] = useState('');
    const [firstSelectedCurrency, setFirstSelectedCurrency] = useState('');
    const [secondSelectedCurrency, setSecondSelectedCurrency] = useState('');
    const [isReverse, setIsReverse] = useState(false);

    useEffect(() => {
        const fetchCurrencyCode = async () => {
            const response = await fetch('http://localhost:8000/currency/all');
            if (response.status === 200) {
                const data = await response.json();
                setCurrencyCode(data.codes);
            }
        };

        fetchCurrencyCode();
    }, []);

    useEffect(() => {
        const fetchLatestCurrency = async () => {
            if (firstSelectedCurrency && secondSelectedCurrency) {
                const response = await fetch('http://localhost:8000/currency/lastest', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        first_currency: firstSelectedCurrency,
                        second_currency: secondSelectedCurrency,
                    }),
                });

                if (response.status === 200) {
                    const data = await response.json();
                    const currencyData = data.data;
                    const currencyCode = Object.keys(currencyData)[0];
                    const currencyRate = currencyData[currencyCode];
                    setSecondValue(currencyRate);
                }
            }
        };

        fetchLatestCurrency();
    }, [firstSelectedCurrency, secondSelectedCurrency]);

    const currencies = currencyCode.map((code) => ({
        value: code,
        label: code,
    }));

    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: '100%',
            border: 'none',
            boxShadow: 'none',
            backgroundColor: 'transparent',
        }),
        container: (provided) => ({
            ...provided,
            width: '25%',
        }),
    };

    const roundedValue = secondValue && firstValue ? (secondValue * firstValue).toFixed(1) : '';

    // Функция для обмена валют
    const handleExchange = () => {
        setIsReverse(!isReverse);
        // Меняем местами валюты
        const temp = firstSelectedCurrency;
        setFirstSelectedCurrency(secondSelectedCurrency);
        setSecondSelectedCurrency(temp);
    };

    return (
        <div className='currency-form'>
            <h1>Choose currencies</h1>
            <div className='currency-group'>
                <input
                    type="text"
                    placeholder="Enter amount"
                    value={firstValue}
                    onChange={(event) => setFirstValue(event.target.value)}
                    className="currency-input"
                />
                <Select
                    id="1"
                    className='currency-select'
                    options={currencies}
                    value={currencies.find((c) => c.value === firstSelectedCurrency)} // Используем текущее значение
                    onChange={(selected) => setFirstSelectedCurrency(selected?.value || '')}
                    styles={customStyles}
                />
            </div>
            <div className='currency-img'>
                <img src={exchange} alt="=" onClick={handleExchange} />
            </div>

            <div className='currency-group'>
                <input
                    type="text"
                    placeholder="Result"
                    value={roundedValue || ''}
                    onChange={(event) => setSecondValue(event.target.value)}
                    readOnly
                    className="currency-input"
                />
                <Select
                    id="2"
                    className='currency-select'
                    options={currencies}
                    value={currencies.find((c) => c.value === secondSelectedCurrency)} // Используем текущее значение
                    onChange={(selected) => setSecondSelectedCurrency(selected?.value || '')}
                    styles={customStyles}
                />
            </div>
        </div>
    );
}