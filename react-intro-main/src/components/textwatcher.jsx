import { useEffect, useState } from 'react';

export default function TextWatcher() {
  const [text, setText] = useState('');
  const [prevText, setPrevText] = useState('');

  useEffect(() => {
    const fetchText = async () => {
      try {
        const res = await fetch(`/app/1/out.vcd?cb=${Date.now()}`); // 👈 кэш обход
        const newText = await res.text();

        if (newText !== prevText) {
          setText(newText);
          setPrevText(newText);
        }
      } catch (e) {
        console.error('Ошибка загрузки файла:', e);
      }
    };

    fetchText(); // первая загрузка

    const interval = setInterval(fetchText, 2000); // обновление каждые 2 секунды

    return () => clearInterval(interval);
  }, [prevText]);

  return (
    <pre>{text}</pre>
  );
}
