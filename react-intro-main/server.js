const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

// Middleware для CORS и обработки JSON
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Отдаём статику

// Маршрут для компиляции VHDL
let currentProcess = null;

app.post('/compile-vhdl', (req, res) => {
    const { architectureCode, testbenchCode } = req.body;

    const architectureFilePath = path.join(__dirname, 'programms', 'vhdl_code.vhdl');
    const testbenchFilePath = path.join(__dirname, 'programms', 'tb_vhdl_code.vhdl');

    fs.writeFileSync(architectureFilePath, architectureCode);
    fs.writeFileSync(testbenchFilePath, testbenchCode);

    if (currentProcess) {
        currentProcess.kill(); // Принудительно завершить процесс
    }

    const compileCommand = `cd programms && del /f /q work-obj93.cf && ghdl -a vhdl_code.vhdl && ghdl -a tb_vhdl_code.vhdl && ghdl -e tb_adder && ghdl -r tb_adder --vcd=out.vcd`;

    console.clear(); // Очистка консоли перед запуском

    exec(compileCommand, (err, stdout, stderr) => {
        currentProcess = null;

        const fullOutput = `stdout:\n${stdout}\nstderr:\n${stderr}\nerror: ${err ? err.message : 'none'}`;
        console.log(fullOutput);

        const logFilePath = path.join(__dirname, 'programms', 'compile.log');
        fs.writeFileSync(logFilePath, fullOutput, 'utf8');

        // Копирование out.vcd в public/app
        const vcdFilePath = path.join(__dirname, 'programms', 'out.vcd');
        const publicVcdPath = path.join(__dirname, 'public', 'app', 'out.vcd');

        if (fs.existsSync(vcdFilePath)) {
            fs.copyFileSync(vcdFilePath, publicVcdPath);
            console.log('Файл out.vcd успешно скопирован в public/app');
        }

        res.json({
            success: !err && !stderr,
            stdout,
            stderr: stderr || err?.message || 'Неизвестная ошибка'
        });
    });
});

// Маршрут для скачивания файла out.vcd
app.get('/download-vcd', (req, res) => {
    const vcdFilePath = path.join(__dirname, 'programms', 'out.vcd');

    if (fs.existsSync(vcdFilePath)) {
        console.log('Файл out.vcd найден. Подготовка к скачиванию...');
        res.download(vcdFilePath);
    } else {
        console.log('Файл out.vcd не найден.');
        res.status(404).send('Файл out.vcd не найден');
    }
});

// Маршрут для получения логов компиляции
app.get('/compile-log', (req, res) => {
    const logFilePath = path.join(__dirname, 'programms', 'compile.log');

    if (fs.existsSync(logFilePath)) {
        const logContent = fs.readFileSync(logFilePath, 'utf8');
        res.send(logContent);
    } else {
        res.status(404).send('Лог файл не найден');
    }
});

app.post('/save-graph-xml', (req, res) => {
    const xmlFilePath = path.join(__dirname, 'graph.xml');
    let rawData = '';
    req.setEncoding('utf8');
  
    req.on('data', chunk => rawData += chunk);
    req.on('end', () => {
      fs.writeFileSync(xmlFilePath, rawData, 'utf8');
      console.log('✅ graph.xml сохранён');
      res.status(200).send('XML сохранён');
    });
  
    req.on('error', err => {
      console.error('❌ Ошибка при приёме XML:', err);
      res.status(500).send('Ошибка при сохранении XML');
    });
  });
  

  app.get('/graph.xml', (req, res) => {
    const xmlFilePath = path.join(__dirname, 'graph.xml');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(xmlFilePath);
  });
  
// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер работает на http://localhost:${port}`);
});