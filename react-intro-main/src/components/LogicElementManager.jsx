import React, { useState, useEffect } from 'react';

const LogicElementManager = ({ onGenerateCode }) => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    const handleElementAdded = (event) => {
      const newElement = event.detail;
      setElements((prevElements) => [...prevElements, newElement]);
    };

    window.addEventListener('elementAdded', handleElementAdded);
    return () => window.removeEventListener('elementAdded', handleElementAdded);
  }, []);

  useEffect(() => {
    let vhdlCode = `library ieee;\nuse ieee.std_logic_1164.all;\nuse ieee.numeric_std.all;\n\n`;

    vhdlCode += `entity adder is\n`;
    vhdlCode += `  port (\n`;
    vhdlCode += `    clk   : in std_logic; --  тактовый сигнал\n`;
    vhdlCode += `    rst_n : in std_logic -- сигнал сброса\n`;

    // Добавляем входы
    const inputs = elements
      .filter(element => element.type === 'INPUT')
      .map(element => element.inputs[0]);
    
    const outputs = elements
      .filter(element => element.type === 'OUTPUT')
      .map(element => element.output);
    
    inputs.forEach((input, index) => {
        vhdlCode += `    ${input} : in std_logic${(index < inputs.length - 1) || outputs.length > 0 ? ';' : ''}\n`;
    });

    // Добавляем выходы
    outputs.forEach((output, index) => {
        vhdlCode += `    ${output} : out std_logic${index < outputs.length - 1 ? ';' : ''}\n`;
    });
    
    vhdlCode += `  );\nend adder;\n\n`;

    vhdlCode += `architecture rtl of adder is\n`;

    let uniqueSignalIndex = 0;  // Индекс для генерации уникальных имен сигналов

    // Генерация сигналов для логических элементов
    elements.forEach((element) => {
        if (['AND', 'OR', 'NOT'].includes(element.type)) {
            const uniqueSignalName = 'sig_' + uniqueSignalIndex++; // Генерация уникального имени сигнала
            vhdlCode += `  signal ${uniqueSignalName} : std_logic;\n`; // Генерация сигнала с уникальным именем
        }
    });
    
    vhdlCode += `begin\n`;

    // Генерация логических элементов
    elements.forEach((element, index) => {
        switch (element.type) {
            case 'AND':
                vhdlCode += `  AND_GATE_${index}: entity work.and_gate\n`;
                vhdlCode += `    port map (A => ${element.inputs[0]}, B => ${element.inputs[1]}, Y => ${element.output});\n`;
                break;

            case 'OR':
                vhdlCode += `  OR_GATE_${index}: entity work.or_gate\n`;
                vhdlCode += `    port map (A => ${element.inputs[0]}, B => ${element.inputs[1]}, Y => ${element.output});\n`;
                break;

            case 'NOT':
                const uniqueSignalName = 'sig_' + index; // Уникальное имя для промежуточного сигнала

                vhdlCode += `  NOT_GATE_${index}: entity work.not_gate\n`;
                vhdlCode += `    port map (A => ${element.inputs[0]}, Y => ${uniqueSignalName});\n`; // Используем уникальное имя для порта

                // Выход для этого элемента
                if (element.output) {
                  vhdlCode += `  ${element.output} <= ${uniqueSignalName};\n`; // Присваиваем промежуточный сигнал на выход
                } else {
                  vhdlCode += `  -- Нет выходного сигнала для NOT_GATE_${index}\n`;
                }
                break;

            case 'INPUT':
              break;

            case 'OUTPUT':
              break;

            default:
                vhdlCode += `  -- Неизвестный элемент: ${element.type}\n`;
        }
    });

    vhdlCode += `end rtl;\n`;

    onGenerateCode(vhdlCode); // Передача кода в редактор
  }, [elements]);

  return null;
};

export default LogicElementManager;
