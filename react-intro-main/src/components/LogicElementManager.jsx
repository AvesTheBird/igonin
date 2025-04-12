import React, { useEffect, useRef } from 'react';
import { xmlUtils } from '@maxgraph/core';

const LogicElementManager = ({ onGenerateCode }) => {
  const lastXmlContent = useRef('');
  const checkInterval = useRef(null);

  const fetchAndGenerate = async () => {
    try {
      const response = await fetch('http://localhost:5000/graph.xml?t=' + Date.now());
      const xmlText = await response.text();
      
      if (xmlText === lastXmlContent.current) return;

      lastXmlContent.current = xmlText;
      const xmlDoc = xmlUtils.parseXml(xmlText);
      const cells = Array.from(xmlDoc.getElementsByTagName('Cell'));

      const elementsById = {};
      const parentMap = {};
      const inputs = [];
      const outputs = [];
      const edges = [];

      for (const cell of cells) {
        const id = cell.getAttribute('id');
        const value = cell.getAttribute('value')?.trim();
        const vertex = cell.getAttribute('vertex');
        const edge = cell.getAttribute('edge');
        const parent = cell.getAttribute('parent');
        const source = cell.getAttribute('source');
        const target = cell.getAttribute('target');
        const shapeObj = cell.querySelector('Object[as="style"]');
        const shape = shapeObj?.getAttribute('shape') || '';
        const rotation = shapeObj?.getAttribute('rotation') || null;

        elementsById[id] = {
          id,
          value,
          vertex,
          edge,
          shape,
          rotation,
          parent,
          source,
          target,
          children: [],
        };

        if (parent) {
          if (!parentMap[parent]) parentMap[parent] = [];
          parentMap[parent].push(id);
        }

        if (edge === '1') {
          edges.push({ id, source, target });
        }
      }

      for (const [parentId, childIds] of Object.entries(parentMap)) {
        elementsById[parentId].children = childIds.map(id => elementsById[id]);
      }

      for (const el of Object.values(elementsById)) {
        const shape = el.shape;
        const children = el.children || [];

        if (shape === 'customTriangle' && !el.rotation) {
          const label = children[0]?.value;
          if (label) inputs.push(label);
        }

        if (shape === 'customTriangle' && el.rotation === '180') {
          const label = children[0]?.value;
          if (label) outputs.push(label);
        }
      }

      const allPorts = [
        ...inputs.map(i => ({ name: i, dir: 'in' })),
        ...outputs.map(o => ({ name: o, dir: 'out' }))
      ];

      const portLines = allPorts.map(({ name, dir }, index) => {
        const isLast = index === allPorts.length - 1;
        return `    ${name} : ${dir} std_logic${isLast ? '' : ';'}`;
      });

      const logicLines = [];
      const signalLines = [];
      const elementNames = {};
      const inputsByTarget = {};

      const getParentElement = (elementId) => {
        const element = elementsById[elementId];
        if (!element || !element.parent) return null;
        return elementsById[element.parent];
      };

      // Назначение имён
      for (const el of Object.values(elementsById)) {
        const shape = el.shape;
        const children = el.children || [];
        const label = children[0]?.value || 'unnamed';

        if (shape === 'shape3') {
          elementNames[el.id] = `and_${el.id}`;
        } else if (shape === 'shape4') {
          elementNames[el.id] = `or_${el.id}`;
        } else if (shape === 'shape2') {
          elementNames[el.id] = `not_${el.id}`;
        } else if (shape === 'customTriangle') {
          elementNames[el.id] = label;
        }
      }

      // Сбор входов
      for (const edge of edges) {
        const sourceParent = getParentElement(edge.source);
        const targetParent = getParentElement(edge.target);
        
        if (sourceParent && targetParent) {
          const targetId = targetParent.id;
          const sourceName = elementNames[sourceParent.id];
          
          if (!inputsByTarget[targetId]) inputsByTarget[targetId] = [];
          inputsByTarget[targetId].push(sourceName);
        }
      }

      // Объявляем сигналы для логических элементов
      for (const [id, name] of Object.entries(elementNames)) {
        if (name.startsWith('and_') || name.startsWith('or_') || name.startsWith('not_')) {
          signalLines.push(`  signal ${name} : std_logic;`);
        }
      }

      // Генерация логики
      for (const [targetId, inputNames] of Object.entries(inputsByTarget)) {
        const targetEl = elementsById[targetId];
        const shape = targetEl.shape;
        const targetName = elementNames[targetId];

        if (shape === 'shape3') {
          logicLines.push(`  ${targetName} <= ${inputNames.join(' and ')};`);
        } else if (shape === 'shape4') {
          logicLines.push(`  ${targetName} <= ${inputNames.join(' or ')};`);
        } else if (shape === 'shape2') {
          logicLines.push(`  ${targetName} <= not ${inputNames[0]};`);
        } else if (shape === 'customTriangle' && targetEl.rotation === '180') {
          logicLines.push(`  ${targetName} <= ${inputNames[0]};`);
        }
      }

      const vhdl = [
        'library ieee;',
        'use ieee.std_logic_1164.all;',
        'use ieee.numeric_std.all;\n',
        'entity circuit is',
        '  port (',
        ...portLines,
        '  );',
        'end circuit;\n',
        'architecture rtl of circuit is',
        ...signalLines,
        'begin',
        ...logicLines,
        'end rtl;'
      ].join('\n');

      onGenerateCode(vhdl);
    } catch (e) {
      console.error('Ошибка при обработке XML:', e);
    }
  };

  useEffect(() => {
    fetchAndGenerate();
    checkInterval.current = setInterval(fetchAndGenerate, 300);

    return () => {
      if (checkInterval.current) {
        clearInterval(checkInterval.current);
      }
    };
  }, [onGenerateCode]);

  return null;
};

export default LogicElementManager;
