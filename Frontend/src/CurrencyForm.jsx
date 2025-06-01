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

    const handleExchange = () => {
        setIsReverse(!isReverse);
        const temp = firstSelectedCurrency;
        setFirstSelectedCurrency(secondSelectedCurrency);
        setSecondSelectedCurrency(temp);
    };

    return (
            <div className="bg-white p-5 w-[90%] max-w-[500px] rounded-2xl shadow-xl transition-transform duration-200 hover:scale-105">
                <h1 className="text-xl font-semibold text-gray-800 mb-4">Choose currencies</h1>
                <div className="flex items-center bg-gray-100 rounded-xl p-2 gap-2 transition-colors duration-200 hover:bg-gray-200">
                    <input
                        type="text"
                        placeholder="Enter amount"
                        value={firstValue}
                        onChange={(event) => setFirstValue(event.target.value)}
                        className="flex-1 p-3 border-none rounded-lg bg-transparent text-base outline-none"
                    />
                    <Select
                        id="1"
                        className="w-1/4"
                        options={currencies}
                        value={currencies.find((c) => c.value === firstSelectedCurrency)}
                        onChange={(selected) => setFirstSelectedCurrency(selected?.value || '')}
                        styles={customStyles}
                        placeholder={'–/–'}
                    />
                </div>
                <div className="my-2 flex justify-center">
                    <img 
                        src={exchange} 
                        alt="Exchange" 
                        className="w-10 h-10 opacity-80 transition-transform duration-200 hover:rotate-180 active:scale-110"
                        onClick={handleExchange}
                    />
                </div>
                <div className="flex items-center bg-gray-100 rounded-xl p-2 gap-2 transition-colors duration-200 hover:bg-gray-200">
                    <input
                        type="text"
                        placeholder="Result"
                        value={roundedValue || ''}
                        onChange={(event) => setSecondValue(event.target.value)}
                        readOnly
                        className="flex-1 p-3 border-none rounded-lg bg-transparent text-base outline-none"
                    />
                    <Select
                        id="2"
                        className="w-1/4"
                        options={currencies}
                        value={currencies.find((c) => c.value === secondSelectedCurrency)}
                        onChange={(selected) => setSecondSelectedCurrency(selected?.value || '')}
                        styles={customStyles}
                        placeholder={'–/–'}
                    />
                </div>
            </div>
    );
}