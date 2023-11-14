$(document).ready(function () {

    let start,
        end,
        difference,
        actual,
        originalWidth
    ;
    let down = false;
    let parametros = parameters();
    draw(
        parametros.radiusNP,
        parametros.radiusMicelle,
        0,
        parametros.espacio,
        parametros.zoom,
        parametros.xDrag,
        parametros.yDrag);

    $(document).on('mouseup', function (e) {
        end = e.pageX;
        down = false;
        $('#div-escala').css({
            opacity:1
        });

    });
    $(document).on('mousemove',  function (e) {
        actual = e.pageX;
        difference = actual - start;
        let div = $('#div-escala');
        if(down === true){
            let width = originalWidth+difference;
            div.css({
                width: width,
                opacity:0.5
            });
            tooltipPosition();
        }
    });
    $(document).on('mousedown', '#div-escala-right', function (e) {
        start = e.pageX;
        down = true;
        originalWidth = $('#div-escala').width();

    });
    $(document).on('mouseout', '#div-escala-right', function (e) {
        let scaleTooltip = $('#scale-tooltip');
        const ev = e;
        scaleTooltip.hide();

        setTimeout(function () {
            const pageX = ev.pageX;
            const pageY = ev.pageY;
            const scaleLeft = parseFloat(scaleTooltip.position().left+$('#canvas-container').position().left);
            const scaleTop = scaleTooltip.position().top;
            const scaleWidth = parseFloat(scaleTooltip.width());
            const scaleHeight = scaleTooltip.height();
            if((pageX < (scaleLeft)) || (pageX > (scaleWidth+scaleLeft))){
                if(((pageY < scaleTop) || pageY > scaleTop+scaleHeight)){
                }
            }
        }, 500)
    });
    $(document).on('change', '.radio', function () {
     let radiusNP = $('#radiusNP').val();
     let radiusMicelle = $('#radiusMicelle').val();

     clearCanvas('nanoanillo');

     if(radiusNP>0 && radiusMicelle>0){
         let parametros = parameters();
         let numero = draw(
             parametros.radiusNP,
             parametros.radiusMicelle,
             0,
             parametros.espacio,
             parametros.zoom,
             parametros.xDrag,
             parametros.yDrag);
         $('#cantNP').val(numero.cantidad);
         $('#lastActive').val('radiusNP');
     }
     else {
         alert("Los diametros deben ser mayores que 1")
     }

 })
    $(document).on('input', '#cantNP', function () {
        let cantNP = $(this).val();
        if (cantNP >=3){
            clearCanvas('nanoanillo');

            let parametros = parameters();

            let fn = draw(
                0,
                parametros.radiusMicelle,
                $(this).val(),
                parametros.espacio,
                parametros.zoom,
                parametros.xDrag,
                parametros.yDrag
            );
            $('#radiusNP').val(fn.radioNP);
        }

    })
    $(document).on('input', '#zoom, #espacio', function () {
        clearCanvas('nanoanillo');
        let parametros = parameters();
        const func = draw(
            parametros.radiusNP,
            parametros.radiusMicelle,
            0,
            parametros.espacio,
            parametros.zoom,
            parametros.xDrag,
            parametros.yDrag);
        $('#cantNP').val(func.cantidad);

    });
    $(document).on('change', '#image-file', function () {
        fileInput(this);
    });
    $(document).on('click', '#cargar-imagen', function () {
        $('#image-file').click();
    })
    $(document).on('mouseover mousemove', '#div-escala-right', function () {
        tooltipPosition();
    })
    $(document).on('keyup', '#value-scale', function () {
        let scaleEquiv = $('#scale-equivalence');
        scaleEquiv.attr('data-nm', $(this).val());
        scaleEquiv.attr('data-pixels', $('#div-escala').width())
    })
    $(document).on('click', '#reset-coords, #reset-canvas', function () {
        const parametros = parameters();
        clearCanvas('nanoanillo');
        if($(this).attr('id')==='reset-canvas'){
            parametros.radiusMicelle = 200;
            parametros.radiusNP = 50;
            parametros.espacio = 0;
            parametros.zoom = 0.98;

            $('#radiusNP').val(parametros.radiusNP);
            $('#radiusMicelle').val(parametros.radiusMicelle);
            $('#espacio').val(parametros.espacio);
            $('#zoom').val(parametros.zoom);

        }
        const fn = draw(
            parametros.radiusNP,
            parametros.radiusMicelle,
            0,
            parametros.espacio,
            parametros.zoom,
            0,
            0
        );
        $('#xDrag').val(0);
        $('#yDrag').val(0);
        $('#cantNP').val(fn.cantidad);
    })
    $(document).on('click', '#insertar-escala', function () {
        const div = $('#div-escala');
        if(div.attr('id')==='div-escala'){
            div.remove();
            $('#scale-tooltip').hide();
        }
        else {
            const divEscala = $(document.createElement('div'));
            const divEscalaRight = $(document.createElement('div'));
            const divEscalaDragger = $(document.createElement('div'));
            const parent = $('#canvas-container');
            divEscala.attr({
                id:'div-escala',
            });

            divEscalaRight.attr({
                id:'div-escala-right',
                class:'expand-scale'
            });
            divEscalaDragger.attr({
                id:'div-escala-dragger',
                class:'expand-scale'
            });
            divEscala.css({
                position:'absolute',
                top:(parent.height()/2)-(divEscala.height()/2),
                left:(parent.width()/2)-(divEscala.width()/2),
            });

            divEscala.append(divEscalaDragger);
            divEscala.append(divEscalaRight);
            parent.append(divEscala);
        }
        $('#set-scale-container').toggleClass('hidden')
        $(this).toggleClass('resaltado')
    })
    $(document).on('click', '#set-scale-button', function (){
        const scaleEquiv = $('#scale-equivalence');
        scaleEquiv.attr('data-nm', $('#scale-value').val());
        scaleEquiv.attr('data-pixels', $('#div-escala').width())
    })

    // $(document).on('change', '#scale-micelle', function (e) {
    //     if($(this).prop('checked')===true){
    //         let parametros = parameters();
    //         clearCanvas('nanoanillo');
    //         const radiusMicelle = parseInt($('#value-scale').val());
    //
    //         draw(parametros.radiusNP, radiusMicelle, 0, parametros.espacio, parametros.zoom, parametros.xDrag, parametros.yDrag)
    //     }
    //     else {
    //         clearCanvas('nanoanillo');
    //     }
    // })
});


//Drag the canvas
$(document).ready(function () {
    let isDragging = false;
    let background = $('#nanoanillo');
    let xTop,
        xLeft,
        xWidth,
        xHeight
    ;
    $(document).on('mousedown', '#nanoanillo', function () {
        xTop = background.offset().top;
        xLeft = background.offset().left;
        xWidth = background.width();
        xHeight = background.height();
        isDragging = true;
    });
    $(document).on('mouseup', function () {
        isDragging = false;
        $('#nanoanillo').css({
            cursor:'default'
        });
        background.css({
            cursor:'default'
        })
    });
    $(document).on('mousemove', function (e) {
        let dragX = e.pageX-xLeft-(xWidth/2);
        let dragY = e.pageY-xTop-(xHeight/2);

        if (isDragging === true) {
            background.css({
                cursor:'grab'
            });
            $('#nanoanillo').css({
                cursor:'grab'
            });
            clearCanvas('nanoanillo');
            let parametros = parameters();
            console.log(parameters());
            draw(
                parametros.radiusNP,
                parametros.radiusMicelle,
                0,
                parametros.espacio,
                parametros.zoom,
                dragX,
                dragY);

            $('#xDrag').val(dragX);
            $('#yDrag').val(dragY);
            console.log("X: "+dragX+" Y: "+dragY)
        }
    })
});

//Drag the scale bar
$(document).ready(function () {
    let isDragging = false;
    let escala = $('#div-escala');
    let yTop,
        xLeft;

    $(document).on('mousedown', '#div-escala-dragger', function (e) {
        let div = $('#div-escala');

        yTop = e.pageY-div.position().top;
        xLeft = e.pageX-div.position().left;

        isDragging = true;
    });
    $(document).on('mousemove', function (e) {
        let dragX = e.pageX;
        let dragY = e.pageY;

        if (isDragging === true) {
            $('#div-escala').css({
                left:dragX-xLeft,
                top:dragY-yTop,
                opacity:0.5
            });
            $('#div-escala-right').hide();
        }
    });
    $(document).on('mouseup', function () {
        isDragging = false;

        escala.css({
            cursor:'default',
            opacity:1
        });
        $('#div-escala-right').show();

    });
});

function draw(radiusNP, radiusMicelle, cantNP, espacio, zoom, xDrag, yDrag) {

    //Seleccionar el canvas
    const canvas = document.getElementById('nanoanillo');

    //Ancho y  alto del canvas
    const widthLienzo = canvas.width;
    const heigthLienzo = canvas.height;

    if(!xDrag){
        xDrag = 0;
    }
    if(!yDrag){
        yDrag = 0;
    }

    if(canvas.getContext){

        const ctx = canvas.getContext('2d');
        ctx.beginPath();

        //Diametro de la micela
        let radiusMicelleOrig = parseFloat(radiusMicelle);

        //Diametro de la NP
        let radiusNPOrig =parseFloat(radiusNP);

        //Parseando los diametros
        radiusMicelle = parseFloat(radiusMicelle);
        radiusNP =parseFloat(radiusNP);

        //Cantidad de NPs a dibujar
        let n = 0;

        //Si se fija la cantidad de nanoparticulas deseadas
        if(cantNP>=3)  {
            n = parseInt(cantNP);
            radiusNP = ((radiusMicelle*Math.sin((Math.PI/n)))/(1-Math.sin((Math.PI/n))));
            radiusNPOrig = Math.round(radiusNP);
        }  else {
            //Calculando la cantidad de nanoparticulas en funcion del diametro de la micela y del diametro de las NP
            radiusNP = radiusNP+(parseFloat(espacio));
            n = (Math.PI/(Math.asin(radiusNP/(radiusMicelle+radiusNP))));
        }

        if (Math.ceil(n) - n <= 0.01){
            n = Math.ceil(n)
        } else {
            n = Math.floor(n)
        }

        //Coordenadas de origen de la micela
        let x = (widthLienzo/2)+ xDrag;
        let bigY = (heigthLienzo/2)+yDrag;

        //Factor para hacer zoom
        let zoomFactor = parseFloat(zoom);
        if(zoomFactor<=0){
            zoomFactor = 0.1
        }
        radiusMicelle = radiusMicelle*zoomFactor;
        radiusNP = radiusNP*zoomFactor;

        //Dibujando la micela
        ctx.arc(x, bigY, radiusMicelle, 0, 2*Math.PI, false);

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000';
        let numberFont = radiusMicelle*0.4;
        let fontSize = numberFont+"px Arial";
        ctx.font = fontSize;
        ctx.fillText(radiusMicelleOrig+' nm', x-(numberFont*1.5),bigY+(numberFont/2));
        ctx.stroke();

        //Dibujando las nanoparticulas
        for (let i = 0; i < n; i++) {
            //Calculando las coordenadas de cada nanoparticula alrededor de la micela
            let angle = ((i/(n/2))*Math.PI);
            let xNP = ((radiusMicelle+radiusNP)*Math.cos(angle)) + x;
            let yNP = ((radiusMicelle+radiusNP)*Math.sin(angle)) + bigY;
            ctx.beginPath();
            ctx.arc(xNP, yNP, radiusNP-(parseFloat(espacio)*2), 0, 2*Math.PI, false);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#000';

            numberFont = radiusNP*0.4;
            fontSize = numberFont+"px Arial";
            ctx.font = fontSize;
            ctx.fillStyle = '#000';
            ctx.fillText(radiusNPOrig+' nm', xNP-(numberFont*1.4), yNP+(numberFont/2));
            ctx.stroke();

            //Recubrimiento
            if(espacio >0){
                ctx.beginPath();
                ctx.arc(xNP, yNP, radiusNP, 0, 2*Math.PI, false);
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'rgba(0,0,180, 1)';
                ctx.stroke();
            }
        }

        $('#display-radio-np').html(radiusNPOrig+" nm");
        $('#display-radio-micela').html(radiusMicelleOrig+" nm");
        $('#display-cant').html(n);
        $('#display-recubrimiento').html((espacio/2)+" nm");
        $('#display-espacio').html(espacio+" nm");
        $('#display-zoom').html((zoomFactor.toPrecision(2)));

        return {cantidad:parseInt(n), radioNP:parseInt(radiusNPOrig)};
    }
}
function clearCanvas(id) {
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    return true;
}
function loadImage(x, y) {
    let base_image = new Image();
    base_image.src = 'imagen.png';
    base_image.onload = function () {
        const canvas = document.getElementById('background-canvas');
        const ctx = canvas.getContext('2d');
        ctx.drawImage(base_image, 0, 0, 600, 600)
    }
}

function fileInput(input) {
    if(input.files && input.files[0]){
        if(clearCanvas('background-canvas')){
            let reader = new FileReader();
            let image = new Image();

            const canvas = document.getElementById('background-canvas');
            const ctx = canvas.getContext('2d');

            reader.onload = function (e) {
                image.src = e.target.result;
                setTimeout(function () {

                    ctx.drawImage(image, 0, 0, 600, 600);
                }, 30)
            };
            reader.readAsDataURL(input.files[0]);
            console.log(input);
        }

    }
    else {
        alert();
    }
}
function parameters(){
    return {
        radiusMicelle:parseInt($('#radiusMicelle').val()),
        radiusNP:parseInt($('#radiusNP').val()),
        espacio: parseFloat($('#espacio').val()),
        cantidad:parseInt($('#cantNP').val()),
        zoom:parseFloat($('#zoom').val()),
        xDrag:parseFloat($('#xDrag').val()),
        yDrag: parseFloat($('#yDrag').val())
    }
}
function tooltipPosition() {
    const tooltip = $('#scale-tooltip');
    let right = $('#div-escala-right');
    const rightPosition = right.position();
    const tooltipWidth = tooltip.width();
    const tooltipHeight = tooltip.height();
    const scalePosition = $('#div-escala').position();
    updateScale();

    let left = rightPosition.left+scalePosition.left-(tooltipWidth/2)+((right.width())/2);
    tooltip.css({
        top:scalePosition.top-(tooltipHeight)-(tooltipHeight/2)-10,
        left: left
    });


    $('#scale-micelle').focus();
    tooltip.show();
}


function updateScale() {
    const scaleWidth = $('#div-escala').width();
    let scaleEquivalence = $('#scale-equivalence');
    const scaleNm = parseFloat(scaleEquivalence.attr('data-nm'));
    const scalePx = parseFloat(scaleEquivalence.attr('data-pixels'));
    const ratio = scaleNm/scalePx;
    const inputValue = Math.round(scaleWidth*ratio) || "Set scale first";
    console.log(inputValue)
    $('#scale-length-display').text(inputValue)

}