// function callOtherDomain() {
// }
console.log("MAPA JS");

function fixSVGText(str) {

  // var invocation = new XMLHttpRequest();
  // var url = '/2000/svg';
  // parse our string as a DOM object and get the SVGElement
  var svg = new DOMParser().parseFromString(str, "image/svg+xml").documentElement;

  // get all <tspan> elements
  var tspans = svg.querySelectorAll('tspan');
  for (var i = 0; i < tspans.length; i++) {
    var ts = tspans[i],
      parent = ts.parentNode,
      gParent = parent.parentNode;
    var j = 0;
    // if(invocation) {
    //  invocation.open('GET', url, true);
    // invocation.onreadystatechange = handler;
    // invocation.append('Access-Control-Allow-Origin: *');
    //  invocation.send();
    // }
    // create a new SVGTextElement to replace our tspan

    var replace = document.createElementNS('/2000/svg', 'text');

    var tsAttr = ts.attributes;
    // set the 'x', 'y' and 'fill' attributes to our new element
    for (j = 0; j < tsAttr.length; j++) {
      replace.setAttributeNS(null, tsAttr[j].name, tsAttr[j].value);
    }

    // append the contentText
    var childNodes = ts.childNodes;
    for (j = 0; j < childNodes.length; j++) {
      replace.appendChild(ts.childNodes[j]);
    }

    var tAttr = parent.attributes;
    // set the original text attributes to our new one
    for (j = 0; j < tAttr.length; j++) {
      replace.setAttributeNS(null, tAttr[j].name, tAttr[j].value);
    }
    // append our new text to the grand-parent
    gParent.appendChild(replace);

    // if this is the last tspan
    if (ts === parent.lastElementChild)
      // remove the old, now empty, SVGTextElement
      gParent.removeChild(parent)
  }
  // return a string version of our cleaned svg
  return new XMLSerializer().serializeToString(svg);
}

function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

//var canvas = new fabric.StaticCanvas('c');
var canvas = window._canvas = new fabric.Canvas('c');
canvas.setWidth(800);
canvas.setHeight(2000);

canvas.on('mouse:wheel', function (opt) {
  var delta = opt.e.deltaY;
  var zoom = canvas.getZoom();
  zoom = zoom + delta / 200;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.01) zoom = 0.01;
  canvas.setZoom(zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
});
/*
canvas.on('mouse:down', function(opt) {
    console.log("1");
    canvas.calcOffset();
});
*/
fabric.util.addListener(document.getElementById('container'), 'scroll', function () {
  console.log('scroll');
  canvas.calcOffset();
});

//Nueva clase rect
var LabeledRect = fabric.util.createClass(fabric.Rect, {
  type: 'labeledRect',
  initialize: function (options) {
    options || (options = {});
    this.callSuper('initialize', options);
    this.set('label', options.label || '');
  },
  toObject: function () {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      label: this.get('label')
    });
  },
  _render: function (ctx) {
    this.callSuper('_render', ctx);
    ctx.font = '10px Helvetica';
    ctx.fontFamily = 'Impact';
    ctx.fillStyle = '#FFFFFF';
    ctx.fontWeight = 'bold';
    ctx.fillText(this.label, -this.width / 2 - 2, -this.height / 2 + 8);
  }
});

// function drawPlane(canvas, numeroStand) {

// var arrayComponentes = new Array();
// arrayComponentes = $('#listaComponentes').val();
// console.log("arrayComponentes.length = "+ arrayComponentes.length);
// for (var i = 0; i < arrayComponentes.length; i++){
//   console.log(arrayComponentes[i]);
// }
// arrayComponentes.forEach(element =>{
fabric.loadSVGFromString(fixSVGText('<g transform="matrix(1 0 0 1 480.5 325.5)"  ><rect style="stroke: rgb(0,0,0); fill: rgb(247,247,247); "  x="-475" y="-325" rx="0" ry="0" width="950" height="650" />'), function (objItems, options) {
  options.selectable = false;//true;
  var shape = fabric.util.groupSVGElements(objItems, options);
  console.log(shape);
  if (shape.color == "#000000" || shape.stroke == "rgb(0,0,0)") { //objeto tipo limite salon
    //shape.fill = color;
    shape.set({
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
      selectable: false
    });
    //shape.setFill(color);
    //Añadir el objeto
    canvas.add(shape).renderAll();
    canvas.sendToBack(shape);
  } else if (shape.stroke == "#0000ff" || shape.stroke == "rgb(0,0,255)") { //objeto tipo stand
    shape.fill = color;
    shape.stroke = "#0000ff";
    shape.set({
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
      selectable: false
    });

    // var labeledRect = new LabeledRect({
    //   top: 100,//shape.top,
    //   left: 100,//shape.left,
    //   width: 100,//shape.width,
    //   height: 100,//shape.height,
    //   label: "  7dh7ehde",// + numeroStand,
    //   fill: '#000000',//shape.fill,
    //   stroke: '#0000ff',//shape.stroke,
    //   hasControls: false,
    //   lockMovementX: true,
    //   lockMovementY: true,
    //   selectable: false
    // });
    var labeledRect = new LabeledRect({
      top: shape.top,
      left: shape.left,
      width: shape.width,
      height: shape.height,
      label: "  " + 455,
      fill: shape.fill,
      stroke: shape.stroke,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
      selectable: false
    });
  }
});

// labeledRect.uuid = objMain.id;
//Añadir el objeto
canvas.add(labeledRect).renderAll();
canvas.bringToFront(labeledRect);
console.log("Termina la funcion");
// }
// );
