import React, { useState, useEffect } from 'react';
const SignalGraph = () => {
    useEffect(() => {
        processVCD();
    }, []);

    const processVCD = async () => {
        try {
            const response = await fetch('http://localhost:5000/process-vcd');
            const data = await response.json();
            console.log(data.message);
        } catch (error) {
            console.error('Ошибка обработки VCD:', error);
        }
    };

    return <div>Обработка VCD...</div>;
};
export default SignalGraph;
