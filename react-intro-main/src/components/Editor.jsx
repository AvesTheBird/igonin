import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import registerVHDL from './monaco-vhdl';
import LogicElementManager from './LogicElementManager';

const VHDLEditor = ({ id, onCodeChange, initialCode }) => {
  const handleEditorWillMount = (monaco) => {
    registerVHDL(monaco); // Регистрируем язык VHDL
  };
  return (
    <div id={id} className="vhdl-editor">
      <Editor
        defaultLanguage="vhdl"
        value={initialCode}
        theme="my-custom-dark"
        beforeMount={handleEditorWillMount}
        onChange={(value) => onCodeChange(value || '')} // Обработчик изменений
        options={{
          automaticLayout: true, // Автоматическое изменение размера
        }}
      />
    </div>
  );
};

const CompilerConsole = ({ output }) => (
  <div className="compiler-console" id="compilerconsole">
    <h3 style={{ color: 'black', marginLeft: '15px' }}>Консоль</h3>
    <pre style={{ color: 'black', marginLeft: '15px' }}>{output}</pre>
  </div>
);

const VHDLEditorWithCompiler = () => {
  const [architectureCode, setArchitectureCode] = useState(`library ieee;
  use ieee.std_logic_1164.all;
  use ieee.numeric_std.all;

  entity adder is
  end adder;

  architecture rtl of adder is
  begin
    -- Здесь можно добавить логику схемы
  end architecture;

  `);

  const [testbenchCode, setTestbenchCode] = useState(`library ieee;
  use ieee.std_logic_1164.all;
  use ieee.numeric_std.all;

  entity tb_adder is
  end tb_adder;

  architecture testbench of tb_adder is
  begin
    -- Здесь можно добавить тестовую логику
  end testbench;
  `);

  const [graphData, setGraphData] = useState({
    elements: [
      { type: 'AND', inputs: ['A', 'B'], output: 'Y1' },
      { type: 'NOT', inputs: ['Y1'], output: 'Y2' }
    ]
  });

  const handleCodeGenerated = (vhdlCode) => {
    setArchitectureCode(vhdlCode);
  };

  const [output, setOutput] = useState('');

  const compileCode = async () => {
    try {
      const response = await fetch('http://localhost:5000/compile-vhdl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ architectureCode, testbenchCode }),
      });

      const text = await response.text();

      try {
        const result = JSON.parse(text);
        const fullOutput = `stdout:\n${result.stdout || ''}\nstderr:\n${result.stderr || ''}`;
        
        if (result.success) {
          setOutput(`✅ Компиляция успешна:\n\n${fullOutput}`);
        } else {
          setOutput(`❌ Ошибка компиляции:\n\n${fullOutput}`);
        }
      } catch {
        setOutput(`⚠️ Некорректный JSON-ответ: ${text}`);
      }
    } catch (error) {
      setOutput(`🚨 Ошибка запроса: ${error.message}`);
    }
};

  
  const compileButton = document.getElementById('compile-html');
  if (compileButton) {
    compileButton.addEventListener('click', compileCode);
  }

  const downloadVCD = async () => {
    try {
      const response = await fetch('http://localhost:5000/download-vcd', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.statusText}`);
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'out.vcd';
      link.click();
    } catch (error) {
      setOutput('Ошибка скачивания VCD: ' + error.message);
    }
  };

  const downloadButton = document.getElementById('download-vcd-html');
  if (downloadButton) {
    downloadButton.addEventListener('click', downloadVCD);
  }

  return (
    <div id="content-container" className="content-container">
      <div id="editors-container" className="editors-container">
        <h4 style={{ color: 'white', marginLeft: '15px', marginBottom: '8px', marginTop: '15px'  }}>Архитектура:</h4>
        <VHDLEditor
          id="architecture-editor" 
          className="architecture-editor"
          onCodeChange={setArchitectureCode}
          initialCode={architectureCode}
        />
    
        <h4 style={{ color: 'white', marginLeft: '15px', marginBottom: '8px', marginTop: '5px'}}>Тестовый стенд:</h4>
        <VHDLEditor
          id="testbench-editor"
          className="testbench-editor"
          onCodeChange={setTestbenchCode}
          initialCode={testbenchCode}
        />
        <LogicElementManager
          graphData={graphData}
          onGenerateCode={handleCodeGenerated} // Это должен быть правильный вызов
        />
      </div>
      <CompilerConsole output={output} />
    </div>
  );
  
};

export default VHDLEditorWithCompiler;
