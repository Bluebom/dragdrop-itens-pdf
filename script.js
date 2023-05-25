let pdfData = atob(document.getElementById('pdfBase64').value);
/*
*  costanti per i placaholder
*/
let maxPDFx = 1190;
let maxPDFy = 842;
let offsetY = 7;

'use strict';


// The workerSrc property shall be specified.
//
pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.min.js';

//
// Asynchronous download PDF
//
let loadingTask = pdfjsLib.getDocument({data: pdfData});
loadingTask.promise.then(function (pdf) {
    const canvasContainer = document.getElementById("the-canvas");
    for (let num = 1; num <= pdf.numPages; num++)
        pdf.getPage(num).then(function (page) {
            let scale = 1.0;
            let viewport = page.getViewport(scale);
            let wrapper = document.createElement("div");
            let canvas = document.createElement('canvas');
            let canvasContext = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            let renderContext = {
                canvasContext,
                viewport
            };
            wrapper.appendChild(canvas)
            canvasContainer.appendChild(wrapper);
            page.render(renderContext).then(function () {
                document.dispatchEvent(new Event("pagerendered"));
            }, function () {
                console.log("ERROR");
            });

        });
});


/* The dragging code for '.draggable' from the demo above
 * applies to this demo as well so it doesn't have to be repeated. */

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
    // only accept elements matching this CSS selector
    accept: '.drag-drop',
    // Require a 100% element overlap for a drop to be possible
    overlap: 1,

    // listen for drop related events:

    ondropactivate: function (event) {
        // add active dropzone feedback
        event.target.classList.add('drop-active');
    },
    ondragenter: function (event) {
        let draggableElement = event.relatedTarget,
            dropzoneElement = event.target;

        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target');
        draggableElement.classList.add('can-drop');
        draggableElement.classList.remove('dropped-out');
        //draggableElement.textContent = 'Dragged in';
    },
    ondragleave: function (event) {
        // remove the drop feedback style
        event.target.classList.remove('drop-target');
        event.relatedTarget.classList.remove('can-drop');
        event.relatedTarget.classList.add('dropped-out');
        //event.relatedTarget.textContent = 'Dragged out';
    },
    ondrop: function (event) {
        //event.relatedTarget.textContent = 'Dropped';
    },
    ondropdeactivate: function (event) {
        // remove active dropzone feedback
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');
    }
});

interact('.drag-drop')
    .draggable({
        inertia: true,
        restrict: {
            restriction: "#selectorContainer",
            endOnly: true,
            elementRect: {top: 0, left: 0, bottom: 1, right: 1}
        },
        autoScroll: true,
        // dragMoveListener from the dragging demo above
        onmove: dragMoveListener,
    });


function dragMoveListener(event) {
    let target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

// this is used later in the resizing demo
window.dragMoveListener = dragMoveListener;

document.addEventListener('pagerendered', function (e) {
    document.getElementById('pdfManager').style.display = 'block';
    let parametri = JSON.parse(document.getElementById('parameters').value);
    let parametriContainer = document.getElementById('parametriContainer');
    parametriContainer.innerHTML = '';
    renderizzaPlaceholder(0, parametri);
});


function getMax() {
    return [
        document.getElementById('the-canvas').offsetWidth,
        document.getElementById('the-canvas').offsetHeight,
        document.getElementById('parametriContainer').offsetWidth
    ]
}

function renderizzaPlaceholder(currentPage, parametri) {
    let [maxHTMLx, maxHTMLy, paramContainerWidth] = [...getMax()];

    let yCounterOfGenerated = 0;
    let numOfMaxItem = 25;
    let notValidHeight = 30;
    let y = 0;
    let x = 6;
    let page = 0;

    let totalPages = Math.ceil(parametri.length / numOfMaxItem);

    for (i = 0; i < parametri.length; i++) {
        let param = parametri[i];
        let page = Math.floor(i / numOfMaxItem);
        let display = currentPage === page ? "block" : "none";

        if (i > 0 && i % numOfMaxItem === 0) {
            yCounterOfGenerated = 0;
        }

        /*il placeholder non è valido: lo incolonna a sinistra*/

        if (i > 0 && i % numOfMaxItem == 0) {
            yCounterOfGenerated = 0;
        }

        let classStyle = "";
        let value = param.value;
        /*il placeholder non è valido: lo incolonna a sinistra*/
        y = yCounterOfGenerated;
        yCounterOfGenerated += notValidHeight;
        classStyle = "drag-drop dropped-out";

        let parametriContainer = document.getElementById("parametriContainer");
        let div = document.createElement("div");
        const inX = Math.floor(param.xPosition),
            inY = Math.floor(param.yPosition);
        div.className = classStyle;
        div.setAttribute("data-id", `${param.id}`);
        div.setAttribute("data-page", page);
        div.setAttribute("data-toggle", value);
        div.setAttribute("data-valore", value);
        div.setAttribute("data-x", `${inX}`);
        div.setAttribute("data-y", `${inY}`);
        div.style.transform = "translate(" + inX + "px, " + inY + "px)";
        div.style.display = display;

        let spanCircle = document.createElement("span");
        spanCircle.className = "circle";

        let spanDescrizione = document.createElement("span");
        spanDescrizione.className = "description";
        spanDescrizione.textContent = param.description;

        div.appendChild(spanCircle);
        div.appendChild(spanDescrizione);

        parametriContainer.appendChild(div);
    }
}

function showCoordinates() {
    let validi = [];
    let nonValidi = [];

    let [maxHTMLx, maxHTMLy, paramContainerWidth] = [...getMax()];

    //recupera tutti i placholder validi
    let dragDropElements = document.querySelectorAll('.drag-drop.can-drop');

    dragDropElements.forEach(function (element) {
        let x = parseFloat(element.getAttribute('data-x'));
        let y = parseFloat(element.getAttribute('data-y'));
        let id = element.getAttribute('data-id');

        // let xPosition = (x * maxPDFx / maxHTMLx) - paramContainerWidth;
        // let yPosition = maxPDFy - offsetY - (y * maxPDFy / maxHTMLy);

        let val = {
            "id": id,
            "xPosition": (x * maxPDFx / maxHTMLx),
            "yPosition": (y * maxPDFy / maxHTMLy),
        };
        validi.push(val);
    });
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8123/update.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
    const data = JSON.stringify({coords: validi});
    xhr.send(data);
}


