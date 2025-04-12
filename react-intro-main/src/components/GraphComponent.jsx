import React, { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import axios from 'axios';
import {
  popup,
  ModelXmlSerializer,
  domUtils,
  styleUtils,
  mathUtils,
  cloneUtils,
  eventUtils,
  Graph,
  InternalEvent,
  RubberBandHandler,
  ConnectionHandler,
  ConnectionConstraint,
  Point,
  CylinderShape,
  CellRenderer,
  DomHelpers,
  EdgeStyle,
  Rectangle,
  EdgeHandler,
  StyleRegistry,
  EdgeSegmentHandler,
  UndoManager,
  CellEditorHandler,
  ConstraintHandler,
  Guide,
  ImageBox,
  GraphView,
  SelectionHandler,
  PanningHandler,
  TooltipHandler,
  SelectionCellsHandler,
  PopupMenuHandler,
  xmlUtils,
  Codec,
  Shape,
} from '@maxgraph/core';

import {
  contextMenuTypes,
  contextMenuValues,
  globalTypes,
  globalValues,
  rubberBandTypes,
  rubberBandValues,
} from './shared/args.js';


import { createGraphContainer } from './shared/configure.js';

// style required by RubberBand
import '@maxgraph/core/css/common.css';

import { render } from 'react-dom';

import {
  MyCustomGraph, 
  MyCustomEdgeSegmentHandler, 
  MyCustomGraphView, 
  MyCustomConnectionHandler,  
  MyCustomPanningHandler, 
  MyCustomSelectionHandler,
  MyCustomEdgeHandler,
  MyCustomConstraintHandler
} from './MyCustomGraph.jsx';


export const YourComponent = () => {
  const importFileInputRef = useRef(null);
  const graphContainerRef = useRef(null);
  const [xmlText, setXmlText] = useState('');
  // Инициализируем переменную для graph
  let [graphInstance, setGraphInstance] = useState(null);
  let [variableFromEffect, setVariableFromEffect] = useState(null);
  let counter = 1;
  let counter2 = 1;
  let [jsonData, setJsonData] = useState(null);  // Задаем начальное состояние как null

  const [graph, setGraph] = useState(null);
  const LINE_ARCSIZE = 20;

  useEffect(() => {

    axios.get('./data.json')
    .then(response => {
      console.log(response.data);  // Проверяем, что данные приходят
      setJsonData(response.data);  // Обновляем состояние с данными из файла
      jsonData = response.data;
      console.log(jsonData);
    });
    console.log(jsonData);


    if (graphContainerRef.current) {
    const graphContainer =  document.querySelector('.ыыы');
    const newGraph = new Graph(graphContainerRef.current);
    setGraph(newGraph); // Сохраняем граф в состояние

   ////


////
    const parentContainer = document.createElement('div');
    const container = createGraphContainer({
      imageUrl: ''
    });
    parentContainer.appendChild(container);
    //console.log({graph})
      // Changes some default colors
  // TODO Find a way of modifying globally or setting locally! See https://github.com/maxGraph/maxGraph/issues/192
  //constants.SHADOWCOLOR = '#C0C0C0';

  let joinNodeSize = 7;
  let strokeWidth = 2;

  // Switch for black background and bright styles
  let invert = false;
  let MyCustomCellEditorHandler;

  if (!graphInstance) {
    const newGraph = new MyCustomGraph(graphContainer, null, []);
    setGraphInstance(newGraph);
  }

  if (invert) {
    container.style.backgroundColor = 'black';

    // White in-place editor text color
    MyCustomCellEditorHandler = class extends CellEditorHandler {
      startEditing(cell, trigger) {
        super.startEditing.apply(this, arguments);

        if (this.textarea != null) {
          this.textarea.style.color = '#FFFFFF';
        }
      }
    };
  } else {
    MyCustomCellEditorHandler = CellEditorHandler;
  }

  // Imlements a custom resistor shape. Direction currently ignored here.

  class ResistorShape extends CylinderShape {
    constructor() {
      // TODO: The original didn't seem to call the super
      super(null, null, null, null);
    }

    redrawPath(path, x, y, w, h, isForeground) {
      let dx = w / 16;

      if (isForeground) {
        path.moveTo(0, h / 2);
        path.lineTo(2 * dx, h / 2);
        path.lineTo(3 * dx, 0);
        path.lineTo(5 * dx, h);
        path.lineTo(7 * dx, 0);
        path.lineTo(9 * dx, h);
        path.lineTo(11 * dx, 0);
        path.lineTo(13 * dx, h);
        path.lineTo(14 * dx, h / 2);
        path.lineTo(16 * dx, h / 2);
        path.end();
      }
    }
  }

  CellRenderer.registerShape('resistor', ResistorShape);



///////////////////////////////////////////////////
class CustomTriangleShape extends Shape {
  constructor() {
    super();
  }
  paintVertexShape(c, x, y, w, h) {
    c.begin();
    // Начинаем с нижнего левого угла треугольника
    const arcSize = (this.style?.arcSize ?? LINE_ARCSIZE) / 5;
    this.addPoints(c, [new Point(x, y), new Point(x + w, y), new Point(x + w + w/2, y + h/2), new Point(x + w, y + h), new Point(x, y + h)], this.isRounded, arcSize, true);
    // Закрываем фигуру (оставляем открытой одну сторону)
    c.end();
    c.stroke();  // Рисуем только границы без заливки
  }
}
// Регистрация новой формы
CellRenderer.registerShape('customTriangle', CustomTriangleShape);



class Shape2 extends Shape {
  constructor() {
    super();
  }
  paintVertexShape(c, x, y, w, h) {
    c.begin();
    // Начинаем с нижнего левого угла треугольника
    const arcSize = (this.style?.arcSize ?? LINE_ARCSIZE) / 5;
    this.addPoints(c, [new Point(x, y), new Point(x + w, y + h/2), new Point(x, y + h)], this.isRounded, arcSize, true);
    // Закрываем фигуру (оставляем открытой одну сторону)
    c.end();
    c.stroke();  // Рисуем только границы без заливки
  }
}
// Регистрация новой формы
CellRenderer.registerShape('shape2', Shape2);


class Shape3 extends Shape {
  constructor() {
    super();
  }
  paintVertexShape(c, x, y, w, h) {
    c.begin();
    c.moveTo(x, y); 
    c.curveTo(x + w/2, y, x + w + w/5, y+h/4, x + w+w/3.5, y+h/2.5); 
    c.moveTo(x + w+w/3.5, y+h/2.5); 
    c.curveTo(x + w+w/3.5, y+h/2.5, x + w + w/5, y+h/1.5, x, y+h/1.3); 
    c.moveTo(x, y+h/1.3); 
    c.curveTo(x, y+h/1.3, x + w/3, y+h/2.2, x, y);
    c.end();
    c.stroke();  // Рисуем только границы без заливки
  }
}
// Регистрация новой формы
CellRenderer.registerShape('shape3', Shape3);



class Shape4 extends Shape {
  constructor() {
    super();
  }
  paintVertexShape(c, x, y, w, h) {
    c.begin();
    // Рисуем полукруг. Используем arcTo для создания дуги
    const r = w / 2;  // Радиус по ширине
    c.moveTo(x, y + h);  // Начинаем с нижней левой точки
    c.arcTo(r, h, 0, 0, 1, x + w, y + h);  // Рисуем полукруг от левого нижнего угла к правому
    
    // Соединяем линию обратно к левой нижней точке
    c.lineTo(x, y + h); 
    c.end();
    c.stroke();  // Рисуем только границы без заливки
  }
}
// Регистрация новой формы
CellRenderer.registerShape('shape4', Shape4);
////////////////////////////////////////////////////////


  // Imlements a custom resistor shape. Direction currently ignored here.

  EdgeStyle.WireConnector = function (state, source, target, hints, result) {
    // Creates array of all way- and terminalpoints
    let pts = state.absolutePoints;
    let horizontal = true;
    let hint = null;

    // Gets the initial connection from the source terminal or edge
    if (source != null && source.cell.isEdge()) {
      horizontal = state.style.sourceConstraint == 'horizontal';
    } else if (source != null) {
      horizontal = source.style.portConstraint != 'vertical';

      // Checks the direction of the shape and rotates
      let direction = source.style.direction;

      if (direction == 'north' || direction == 'south') {
        horizontal = !horizontal;
      }
    }

    // Adds the first point
    // TODO: Should move along connected segment
    let pt = pts[0];

    if (pt == null && source != null) {
      pt = new Point(
        state.view.getRoutingCenterX(source),
        state.view.getRoutingCenterY(source)
      );
    } else if (pt != null) {
      pt = pt.clone();
    }

    let first = pt;

    // Adds the waypoints
    if (hints != null && hints.length > 0) {
      // FIXME: First segment not movable
      /*hint = state.view.transformControlPoint(state, hints[0]);
      MaxLog.show();
      MaxLog.debug(hints.length,'hints0.y='+hint.y, pt.y)

      if (horizontal && Math.floor(hint.y) != Math.floor(pt.y))
      {
        MaxLog.show();
        MaxLog.debug('add waypoint');

        pt = new Point(pt.x, hint.y);
        result.push(pt);
        pt = pt.clone();
        //horizontal = !horizontal;
      }*/

      for (let i = 0; i < hints.length; i++) {
        horizontal = !horizontal;
        hint = state.view.transformControlPoint(state, hints[i]);

        if (horizontal) {
          if (pt.y !== hint.y) {
            pt.y = hint.y;
            result.push(pt.clone());
          }
        } else if (pt.x !== hint.x) {
          pt.x = hint.x;
          result.push(pt.clone());
        }
      }
    } else {
      hint = pt;
    }

    // Adds the last point
    pt = pts[pts.length - 1];

    // TODO: Should move along connected segment
    if (pt == null && target != null) {
      pt = new Point(
        state.view.getRoutingCenterX(target),
        state.view.getRoutingCenterY(target)
      );
    }

    if (horizontal) {
      if (pt.y !== hint.y && first.x !== pt.x) {
        result.push(new Point(pt.x, hint.y));
      }
    } else if (pt.x !== hint.x && first.y !== pt.y) {
      result.push(new Point(hint.x, pt.y));
    }
  };

  StyleRegistry.putValue('wireEdgeStyle', EdgeStyle.WireConnector);


  let graph = new MyCustomGraph(container, null, [
    MyCustomCellEditorHandler,
    TooltipHandler,
    SelectionCellsHandler,
    PopupMenuHandler,
    MyCustomConnectionHandler,
    MyCustomSelectionHandler,
    MyCustomPanningHandler,
  ]);
  
  setVariableFromEffect(graph); // оставляем
  
  // === ВОТ ЭТА ЧАСТЬ ===
  graph.model.addListener(InternalEvent.CHANGE, () => {
    const xml = new ModelXmlSerializer(graph.getDataModel()).export();
  
    fetch('http://localhost:5000/save-graph-xml', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
      },
      body: xml,
    })
      .then((res) => res.text())
      .then(() => console.log('[XML] отправлен'))
      .catch((err) => console.error('[XML] ошибка:', err));
  });
  


  let labelBackground = invert ? '#000000' : '#FFFFFF';
  let fontColor = invert ? '#FFFFFF' : '#000000';
  let strokeColor = invert ? '#C0C0C0' : '#000000';
  let fillColor = invert ? 'none' : '#FFFFFF';

  graph.view.scale = 1;
  graph.setPanning(true);
  graph.setConnectable(true);
  graph.setConnectableEdges(true);
  graph.setDisconnectOnMove(false);
  graph.foldingEnabled = false;

  //Maximum size
  graph.maximumGraphBounds = new Rectangle(0, 0, 1000, 1000);
  graph.border = 50;
  graph.spacingLeft = 30;

  // Enables return key to stop editing (use shift-enter for newlines)
  graph.setEnterStopsCellEditing(true);

  // Adds rubberband selection
  new RubberBandHandler(graph);

  // Adds a special tooltip for edges
  graph.setTooltips(true);

  let style = graph.getStylesheet().getDefaultEdgeStyle();
  delete style.endArrow;
  style.strokeColor = strokeColor;
  style.labelBackgroundColor = labelBackground;
  style.edgeStyle = 'wireEdgeStyle';
  style.fontColor = fontColor;
  style.fontSize = '9';
  style.movable = '0';
  style.strokeWidth = strokeWidth;
  //style.rounded = '1';

  // Sets join node size
  style.startSize = joinNodeSize;
  style.endSize = joinNodeSize;

  style = graph.getStylesheet().getDefaultVertexStyle();
  style.gradientDirection = 'south';
  //style.gradientColor = '#909090';
  style.strokeColor = strokeColor;
  //style.fillColor = '#e0e0e0';
  style.fillColor = 'none';
  style.fontColor = fontColor;
  style.fontStyle = '1';
  style.fontSize = '12';
  style.resizable = '0';
  style.rounded = '1';
  style.strokeWidth = strokeWidth;

  // инородное дерьмо

  const btn1 = document.getElementById('btn1');
  const btn2 = document.getElementById('btn2');
  const btn3 = document.getElementById('btn3');
  const btn6 = document.getElementById('btn6');
  const btn7 = document.getElementById('btn7');

  const dispatchElementAdded = (elementType, inputLabels = [], outputLabel = '') => {
    const event = new CustomEvent('elementAdded', {
      detail: {
        type: elementType,
        inputs: inputLabels,
        output: outputLabel
      }
    });
    window.dispatchEvent(event);
  };

  const update = (event) => {
    setTimeout(() => {
    var parent = graph.getDefaultParent();
    graph.batchUpdate(() => {
      const targetId = event.target.id;

      if (targetId === 'btn3') {
        const v1 = graph.insertVertex(parent, null, '', 80, 80, 40, 40, {
          shape: 'shape2',
          strokeColor: strokeColor,
        });
        v1.setConnectable(false);
        var v11 = graph.insertVertex(v1, null, '', 0, 0, 15, 16, {
          shape: 'line',
          align: 'top',
          verticalAlign: 'top',
          fontSize: 10,
          routingCenterX: -0.5,
          spacingLeft: 0,
          spacingTop: -7,
          fontColor,
          strokeColor,
        });
        v11.geometry.relative = true;
        v11.geometry.offset = new Point(-v1.geometry.width +25, 12);

        var v12 = graph.insertVertex(v1, null, '◯', 0, 0, 15, 16, {
          shape: 'line',
          align: 'top',
          verticalAlign: 'top',
          fontSize: 10,
          routingCenterX: -0.5,
          spacingLeft: -20,
          spacingTop: 0,
          fontColor,
          strokeColor,
        });
        v12.geometry.relative = true;
        v12.geometry.offset = new Point(v1.geometry.width+7.5, 12);

        dispatchElementAdded('NOT', ['X1'], 'Y1');
      }

      else if (targetId === 'btn6') {
        const v1 = graph.insertVertex(parent, null, '', 80, 80, 35, 25, {
          shape: 'customTriangle',
          strokeColor: strokeColor,
        });
        v1.setConnectable(false);
        const labelText = 'X' + counter;  // Формируем текст с текущим значением счётчика
        let fontColor = 'black';  // По умолчанию цвет текста черный
        if (jsonData.inputs.includes(labelText)) {
          fontColor = 'red';  // Если есть совпадение, меняем цвет на красный
        }
        var v11 = graph.insertVertex(v1, null, labelText, 0, 0, 20, 16, {
          shape: 'line',
          align: 'top',
          verticalAlign: 'top',
          fontSize: 10,
          routingCenterX: -0.5,
          spacingLeft: -5,
          spacingTop: -7,
          fontColor,
          strokeColor,
        });
        counter += 1;
        v11.geometry.relative = true;
        v11.geometry.offset = new Point(v1.geometry.width+16.5, 4.5);
        dispatchElementAdded('INPUT', [labelText], '');
      }

      
      else if (targetId === 'btn7') {
        const v1 = graph.insertVertex(parent, null, '', 80, 80, 35, 25, {
            shape: 'customTriangle',
            strokeColor: strokeColor,
            rotation: 180  
        });
        v1.setConnectable(false);
    
        const labelText = 'F' + counter2;  // Создаем уникальное имя выхода
        var v11 = graph.insertVertex(v1, null, labelText, 0, 0, 20, 16, {
            shape: 'line',
            align: 'top',
            verticalAlign: 'top',
            fontSize: 10,
            routingCenterX: -0.5,
            spacingLeft: -5,
            spacingTop: -7,
            fontColor,
            strokeColor,
        });
    
        v11.geometry.relative = true;
        v11.geometry.offset = new Point(v1.geometry.width + 16.5, 4.5);
    
        dispatchElementAdded('OUTPUT', [], labelText); // Добавляем выход в массив
        counter2 += 1; // Увеличиваем счетчик
    }
    

      else if (targetId === 'btn2') {
        const v1 = graph.insertVertex(parent, null, '', 80, 100, 60, 60, {
          shape: 'shape3',
          strokeColor: strokeColor,  
        });
        v1.setConnectable(false);
        var v11 = graph.insertVertex(v1, null, '', 0, 0, 20, 16, {
          shape: 'line',
          align: 'top',
          verticalAlign: 'top',
          fontSize: 10,
          routingCenterX: -0.5,
          spacingLeft: -5,
          spacingTop: -7,
          fontColor,
          strokeColor,
        });
        v11.geometry.relative = true;
        v11.geometry.offset = new Point(v1.geometry.width+17.8, 16);


        var v12 = graph.insertVertex(v1, null, '', 0, 0, 20, 16, {
          shape: 'line',
          align: 'top',
          verticalAlign: 'top',
          fontSize: 10,
          routingCenterX: -0.5,
          spacingLeft: -5,
          spacingTop: -7,
          fontColor,
          strokeColor,
        });
        v12.geometry.relative = true;
        v12.geometry.offset = new Point(-v1.geometry.width+48, 8);

        var v13 = graph.insertVertex(v1, null, '', 0, 0, 20, 16, {
          shape: 'line',
          align: 'top',
          verticalAlign: 'top',
          fontSize: 10,
          routingCenterX: -0.5,
          spacingLeft: -5,
          spacingTop: -7,
          fontColor,
          strokeColor,
        });
        v13.geometry.relative = true;
        v13.geometry.offset = new Point(-v1.geometry.width+48, 24);
        dispatchElementAdded('AND', ['X1', 'X2'], 'Y1');
      } 
      
      
      
      else if (targetId === 'btn1') {
        const v1 = graph.insertVertex(parent, null, '', 80, 100, 47, 70, {
          shape: 'shape4',
          strokeColor: strokeColor,  
          rotation: 90 
        });
        v1.setConnectable(false);


        var v13 = graph.insertVertex(v1, null, '', 0, 0, 20, 16, {
          shape: 'line',
          align: 'top',
          verticalAlign: 'top',
          fontSize: 10,
          routingCenterX: -0.5,
          spacingLeft: -5,
          spacingTop: -7,
          fontColor,
          strokeColor,
        });
        v13.geometry.relative = true;
        v13.geometry.offset = new Point(v1.geometry.width-33, -18);



        var v14 = graph.insertVertex(v1, null, '', 0, 0, 20, 16, {
          shape: 'line',
          align: 'top',
          verticalAlign: 'top',
          fontSize: 10,
          routingCenterX: -0.5,
          spacingLeft: -5,
          spacingTop: -7,
          fontColor,
          strokeColor,
        });
        v14.geometry.relative = true;
        v14.geometry.offset = new Point(5, 71);



        var v15 = graph.insertVertex(v1, null, '', 0, 0, 20, 16, {
          shape: 'line',
          align: 'top',
          verticalAlign: 'top',
          fontSize: 10,
          routingCenterX: -0.5,
          spacingLeft: -5,
          spacingTop: -7,
          fontColor,
          strokeColor,
        });
        v15.geometry.relative = true;
        v15.geometry.offset = new Point(23, 71);
        dispatchElementAdded('OR', ['X1', 'X2'], 'Y1');
      } 
      
      
      
      else if (targetId === 'btn4') {
        var v1 = graph.insertVertex(parent, null, '', 80, 140, 40, 80,
          'verticalLabelPosition=top;verticalAlign=bottom;shadow=1;fillColor=' + fillColor);
        v1.setConnectable(false);

        var v11 = graph.insertVertex(v1, null, '', 0, 0, 14, 16, {
          shape: 'line',
          align: 'left',
          verticalAlign: 'middle',
          fontSize: 10,
          routingCenterX: -0.5,
          spacingLeft: 12,
          fontColor: fontColor,
          strokeColor: strokeColor
        });
        v11.geometry.relative = true;
        v11.geometry.offset = new Point(-v11.geometry.width, 12);
        var v12 = v11.clone();
        v12.value = '';
        v12.geometry.offset = new Point(-v11.geometry.width, 52);
        v1.insert(v12);
        var v15 = v11.clone();
        v15.value = '';
        v15.geometry.x = 1;
        v15.style = {
          shape: 'line',
          align: 'right',
          verticalAlign: 'middle',
          fontSize: 10,
          routingCenterX: 0.5,
          spacingRight: 12,
          fontColor: fontColor,
          strokeColor: strokeColor
        };
        v15.geometry.offset = new Point(0, 32);
        v1.insert(v15);

        var v16 = graph.insertVertex(v1, null, '○', 0, 0, 0, 0, {
          shape: 'line',
          align: 'right',
          verticalAlign: 'middle',
          fontSize: 25,
          routingCenterX: 0.5,
          spacingLeft: 6,
          fontColor: fontColor,
          strokeColor: strokeColor
        });
        v16.geometry.x = 1;
        v16.geometry.offset = new Point(8, 15);
        v1.insert(v16);
        var v17 = graph.insertVertex(v1, null, 'X', 0, 0, 0, 0, {
          shape: 'line',
          align: 'right',
          verticalAlign: 'middle',
          fontSize: 10,
          routingCenterX: 0.5,
          spacingLeft: 6,
          fontColor: fontColor,
          strokeColor: strokeColor
        });
        v17.geometry.x = 1;
        v17.geometry.offset = new Point(14, 20);
        v1.insert(v17);
        var v18 = graph.insertVertex(v1, null, 'Y', 0, 0, 0, 0, {
          shape: 'line',
          align: 'right',
          verticalAlign: 'middle',
          fontSize: 10,
          routingCenterX: 0.5,
          spacingLeft: 6,
          fontColor: fontColor,
          strokeColor: strokeColor
        });
        v18.geometry.x = 1;
        v18.geometry.offset = new Point(14, 59);
        v1.insert(v18);
        dispatchElementAdded('AND', ['X1', 'X2'], 'Y1');
      }
      
    });
  }, 0);  // Задержка в 0 мс позволяет выполнить код в следующем цикле событий
};


  btn1.addEventListener('click', update);
  btn2.addEventListener('click', update);
  btn3.addEventListener('click', update);
  btn6.addEventListener('click', update);
  btn7.addEventListener('click', update);




  const importButton = document.getElementById("import");
  importButton.onclick = () => {
    console.log(graph);
    const fileInput = document.getElementById("importFileInput");
  
    if (fileInput) {
      // Сначала сохраняем текущий граф в XML
      const xml = new ModelXmlSerializer(graph.getDataModel()).export();
      
      // Затем загружаем его обратно в граф
      loadGraphFromXml(xml, graph);
  
      // Добавляем обработчик события onchange
      fileInput.onchange = function (event) {
        handleFileImport(event); // Вызываем функцию импорта файла
      };
  
      // Открываем диалог выбора файла
      fileInput.click();
      console.log("Диалог выбора файла открыт");
    } else {
      console.log("fileInput не найден!");
    }
  };
  
  function handleFileImport(event) {
    console.log("blyaaa");
      // Очищаем граф перед загрузкой новой схемы
      console.log(graph);
    const file = event.target.files[0];
    if (file) {
      // Вызов функции readXMLFile
      readXMLFile(file, function(xmlContent) {
        console.log('Файл импортирован: ', xmlContent); // Работаем с содержимым файла
        loadGraphFromXml(xmlContent, graph); // Загружаем граф из XML
      });
    } else {
      console.log("Файл не выбран!");
    }
  }
  // Функция чтения XML файла
function readXMLFile(file, callback) {
const reader = new FileReader();
reader.onload = function(e) {
  const xmlContent = e.target.result;
  callback(xmlContent);  // Передаем результат чтения в коллбэк
};
reader.readAsText(file);  // Читаем файл как текст
}

// Функция для загрузки графа из XML
const loadGraphFromXml = (xml, graph) => {
graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
const node = xmlUtils.parseXml(xml).documentElement;
graph.model.beginUpdate();
try {
  console.log(node);

  const codec = new Codec();  // Создаем кодек для декодирования XML
  codec.decode(node, graph.model);  // Декодируем XML и загружаем в модель графа
} finally {
  graph.model.endUpdate();  // Завершаем транзакцию
  graph.refresh();
}
};

  ////////////////////////////////////////////////////////
// XML 

document.getElementById("xml").onclick = () => {
  // Получаем XML данные
  console.log(graph);
  const xml = new ModelXmlSerializer(graph.getDataModel()).export();
  
  // Создаем новый Blob объект с XML данными
  const blob = new Blob([xml], { type: 'text/xml' });
  
  // Создаем ссылку на Blob объект
  const url = window.URL.createObjectURL(blob);
  
  // Создаем ссылку для скачивания
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.xml'; // Имя файла для скачивания
  document.body.appendChild(a);
  
  // Инициируем скачивание файла
  a.click();
  
  // Освобождаем ресурсы
  window.URL.revokeObjectURL(url);
};








const sendXmlToServer = (xmlText) => {
  fetch('http://localhost:5000/save-graph-xml', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/xml',
    },
    body: xmlText,
  })
  .then((res) => res.text())
  .then((result) => console.log('[XML] Схема успешно отправлена'))
  .catch((err) => console.error('[XML] Ошибка при отправке XML:', err));
};

///////////////////////////////////////////////////////////


    document.getElementById("zoom").onclick = () => graph.zoomIn();
    document.getElementById("zoomout").onclick = () => graph.zoomOut();

  // Undo/redo
  let undoManager = new UndoManager();
  let listener = function (sender, evt) {
    undoManager.undoableEditHappened(evt.getProperty('edit'));
  };
  graph.getDataModel().addListener(InternalEvent.UNDO, listener);
  graph.getView().addListener(InternalEvent.UNDO, listener);

  document.getElementById("undo").onclick = () => undoManager.undo();
  document.getElementById("redo").onclick = () => undoManager.redo();


  document.getElementById("delete").onclick = () => graph.removeCells();

  // Wire-mode
  let checkbox = document.getElementById("wire");

  // Grid
  let checkbox2 = document.getElementById("grid");
  checkbox2.setAttribute('checked', 'true');


  InternalEvent.addListener(checkbox2, 'click', function (evt) {
    if (checkbox2.checked) {
      container.style.background = '';
    } else {
      container.style.background = '';
    }
    container.style.backgroundColor = invert ? 'black' : 'white';
  });
  InternalEvent.disableContextMenu(container);


    graphContainer.appendChild(parentContainer);



}
}, []);



  return (
      <div ref={graphContainerRef} />
  );
  
};


