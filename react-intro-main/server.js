const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const VCDParser = require('vcd-parser');

const app = express();
const port = 5000;

// Middleware для CORS и обработки JSON
app.use(cors());
app.use(bodyParser.json());

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
        console.log(fullOutput); // Вывод в консоль сервера

        const logFilePath = path.join(__dirname, 'programms', 'compile.log');
        fs.writeFileSync(logFilePath, fullOutput, 'utf8');

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

// Маршрут для получения содержимого out.vcd
app.get('/get-cvd', (req, res) => {
    const filePath = path.join(__dirname, 'programms', 'out.vcd');

    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Ошибка чтения файла:', err);
                res.status(500).send('Ошибка чтения файла');
            } else {
                console.log('Файл успешно прочитан.');
                res.json({ content: data });
            }
        });
    } else {
        res.status(404).send('Файл out.vcd не найден');
    }
});

const processVCDFile = async (vcdContent) => {
    try {
        const parsedData = await VCDParser.parse(vcdContent);

        // Преобразуем объект в строку
        return JSON.stringify(parsedData, null, 2); // Преобразуем объект в красивый JSON формат
    } catch (error) {
        console.error('Ошибка парсинга VCD:', error);
        throw error; // Ошибка в парсинге
    }
};

// Маршрут для обработки VCD и сохранения в файл
app.get('/process-vcd', async (req, res) => {
    const vcdFilePath = path.join(__dirname, 'programms', 'out.vcd');
    const parsedFilePath = path.join(__dirname, 'programms', 'parsed_vcd.txt');

    if (!fs.existsSync(vcdFilePath)) {
        return res.status(404).send('Файл out.vcd не найден');
    }

    try {
        const data = fs.readFileSync(vcdFilePath, 'utf8');
        const processedData = await processVCDFile(data); // Обрабатываем данные
        fs.writeFileSync(parsedFilePath, processedData); // Сохраняем обработанный файл

        res.json({ message: 'Файл успешно обработан', file: 'parsed_vcd.txt' });
    } catch (error) {
        res.status(500).send('Ошибка обработки файла');
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер работает на http://localhost:${port} е вкев`);
});
