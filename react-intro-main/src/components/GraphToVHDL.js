// GraphToVHDL.js - Update the generateVHDLFromXML function
const generateVHDLFromXML = async () => {
    try {
      const response = await fetch('http://localhost:5000/graph.xml');
      if (!response.ok) {
        throw new Error('Failed to fetch graph.xml');
      }
      
      const xmlText = await response.text();
      if (!xmlText) {
        throw new Error('Empty XML content');
      }
  
      const xmlDoc = xmlUtils.parseXml(xmlText).documentElement;
      if (!xmlDoc) {
        throw new Error('Invalid XML structure');
      }
  
      const codec = new Codec();
      const model = codec.decode(xmlDoc);
      
      if (!model?.cells) {
        return assembleVHDL([], [], []); // Return empty VHDL if no cells
      }
  
      const cells = Object.values(model.cells);
      const inputs = [];
      const outputs = [];
      const operations = [];

  for (const cell of cells) {
    if (!cell?.style) continue;
    const style = cell.style;

    if (style.includes('customTriangle') && !style.includes('rotation')) {
      const label = getLabelFromChildren(cell);
      if (label) inputs.push(label);
    }

    else if (style.includes('customTriangle') && style.includes('rotation')) {
      const label = getLabelFromChildren(cell);
      if (label) outputs.push(label);
    }

    else if (style.includes('shape2')) {
      // NOT
      const inp = getLabelFromChildren(cell, 0);
      const out = getLabelFromChildren(cell, 1);
      if (inp && out) operations.push(`${out} <= not ${inp};`);
    }

    else if (style.includes('shape3')) {
      // AND
      const in1 = getLabelFromChildren(cell, 0);
      const in2 = getLabelFromChildren(cell, 1);
      const out = getLabelFromChildren(cell, 2);
      if (in1 && in2 && out) operations.push(`${out} <= ${in1} and ${in2};`);
    }

    else if (style.includes('shape4')) {
      // OR
      const in1 = getLabelFromChildren(cell, 0);
      const in2 = getLabelFromChildren(cell, 1);
      const out = getLabelFromChildren(cell, 2);
      if (in1 && in2 && out) operations.push(`${out} <= ${in1} or ${in2};`);
    }
  }

  return assembleVHDL(inputs, outputs, operations);
} catch (error) {
  console.error('Error generating VHDL:', error);
  // Return a basic empty VHDL structure when errors occur
  return assembleVHDL([], [], []);
}
};

/**
 * Извлекает текстовое значение из дочерних узлов вершины.
 */
const getLabelFromChildren = (cell, index = 0) => {
  try {
    return cell.children?.[index]?.value?.toString().trim() || null;
  } catch {
    return null;
  }
};

/**
 * Собирает архитектуру VHDL
 */
const assembleVHDL = (inputs, outputs, logicLines) => {
  const code = [];

  code.push('library ieee;');
  code.push('use ieee.std_logic_1164.all;');
  code.push('use ieee.numeric_std.all;');
  code.push('');
  code.push('entity circuit is');
  code.push('  port (');

  const allPorts = [
    ...inputs.map((i) => `    ${i} : in std_logic;`),
    ...outputs.map((o) => `    ${o} : out std_logic;`),
  ];

  if (allPorts.length > 0) {
    allPorts[allPorts.length - 1] = allPorts[allPorts.length - 1].replace(/;$/, '');
  }

  code.push(...allPorts);
  code.push('  );');
  code.push('end circuit;');
  code.push('');
  code.push('architecture rtl of circuit is');
  code.push('begin');

  if (logicLines.length === 0) {
    code.push('  -- Логика пока не задана');
  } else {
    code.push(...logicLines.map(line => `  ${line}`));
  }

  code.push('end architecture;');
  return code.join('\n');
};

export default generateVHDLFromXML;
