(function() {
    console.log("LLego?");
    var nodeTemplate = function(data) {
        if (data.tipo == "empleado") {
            return `
                    <div  style="background-color:#D0F0F9;">
                    <div class="text-center">
                        <img src="${data.imagen}" class="img-circle elevation-2 mt-2" style="width: 35%; background-color:white;"> 
                    </div>
                    <div style="font-size: 20px;">
                        ${data.nombre}<br>
                        ${data.apellido}
                    </div>
                    </div>
                    <hr class="mb-2 mt-2">
                    <div class="card elevation-2 bg-gradient-info">
                        <div class="card-body">
                            <div style="font-size: 14px;">
                                <i class="fas fa-id-badge" style="font-size: 15px;"></i><br>
                                ${data.puesto}
                            </div>
                            <hr style="background-color:white;">
                            <div style="font-size: 14px;">
                                <i class="fas fa-map-marker-alt" style="font-size: 15px;"></i><br>
                                ${data.ubicacion}
                            </div>
                            <hr style="background-color:white;">
                            <div style="font-size: 14px;">
                                <i class="fab fa-whatsapp" style="font-size: 15px;"></i>
                                ${data.telefono}
                            </div>
                        </div>
                    </div>
                    `;
        }
        if (data.tipo == "servicio") {
            /*return `
            <div class=" title${data.father} ">${data.name}</div>
            <div class="content ">${data.title}</div>
            `;*/
            ///Proveedores

            /*
                VERSION 1--------------------------------------------------
                <div class="card elevation-2">
                    <div class="col-12" style="background-color:#F3F3F3;">
                        Xochitl Mendoza
                    </div>
                    <div class="card-footer p-1 rounded-bottom ${data.color}">
                        <div class="row">
                            <div class="col-2">
                                <img src="${data.imagen}" class="img-icon">
                            </div>
                            <div class="col-10">
                                <b>${data.title}</b>
                            </div>
                        </div>
                    </div>
                </div>

                VERSION 2----------------------------------------------------


                VERSION 3----------------------------------------------------
                */
            return `
                    <div class="card elevation-2">
                        <div style="background-color:#F3F3F3;">
                            <img src="${data.imagen}" class="img-icon-v2" >
                        </div>
                        <div class="card-footer p-1 rounded-bottom ${data.color}">
                            <b>${data.name}</b>
                        </div>
                    </div>
                    `;
        } else {
            /*return `
            <div><img class=" office responsive " src=" ${data.imagen} "></div>
            <div class=" content ">${data.title}</div>
            `;*/
            ///Empresas
            return `
                <div class="card elevation-2" >
                    <img src="${data.imagen}" class="card-img-top img-default" >
                    <div class="card-footer p-1 rounded-bottom ${data.color}">
                        
                        <b>${data.name}</b>
                    </div>
                </div>
                `;
        }

    }



    datasource = {
        'id': 1,
        'name': 'ELA 2020',
        'title': 'Evento',
        'imagen': 'dist/img/ela.jpg',
        'color': 'bg-gradient-info',
        'children': [{ //Organizadores
            'name': 'Reed Exhibitions',
            'title': 'Organizador',
            'imagen': 'dist/img/reed.png',
            'color': 'bg-gradient-info',
            'children': [{ //Proveedores
                    'name': 'Centro Banamex',
                    'title': 'Proveedor',
                    'imagen': 'dist/img/banamex.jpg',
                    'color': 'bg-gradient-danger',
                    'children': [{
                        'name': 'Colganteo',
                        'title': 'Crea',
                        'imagen': 'pruebas/colganteo.png',
                        'father': 'Banamex',
                        'color': 'bg-gradient-danger',
                        'tipo': 'servicio'
                    }, {
                        'name': 'Limpieza',
                        'title': 'Centro',
                        'father': 'Banamex',
                        'imagen': 'pruebas/limpieza.png',
                        'color': 'bg-gradient-danger',
                        'tipo': 'servicio'
                    }, {
                        'name': 'Servicio Medico',
                        'title': 'Humana',
                        'father': 'Banamex',
                        'imagen': 'pruebas/medicina.png',
                        'color': 'bg-gradient-danger',
                        'tipo': 'servicio'
                    }, {
                        'name': 'Seguridad',
                        'title': 'Centro',
                        'father': 'Banamex',
                        'imagen': 'pruebas/seguridad.png',
                        'color': 'bg-gradient-danger',
                        'tipo': 'servicio'
                    }, {
                        'name': 'Electricidad',
                        'title': 'Espejel',
                        'father': 'Banamex',
                        'imagen': 'pruebas/electricidad.png',
                        'color': 'bg-gradient-danger',
                        'tipo': 'servicio'
                    }], //End childreen banamex
                }, //End banamex
                {
                    'name': 'Naib Group',
                    'title': 'Proveedor',
                    'imagen': 'dist/img/naib.png',
                    'color': 'bg-gradient-primary',
                    'children': [{
                        'name': 'Maniobras',
                        'title': 'Maniobras',
                        'father': 'Naib',
                        'imagen': 'pruebas/maniobras.png',
                        'color': 'bg-gradient-primary',
                        'tipo': 'servicio'
                    }, {
                        'name': 'Aduana',
                        'title': 'Aduana',
                        'father': 'Naib',
                        'imagen': 'pruebas/aduana.png',
                        'color': 'bg-gradient-primary',
                        'tipo': 'servicio'
                    }, {
                        'name': 'Marshalling',
                        'title': 'Marshalling',
                        'father': 'Naib',
                        'imagen': 'pruebas/marshalling.png',
                        'color': 'bg-gradient-primary',
                        'tipo': 'servicio',
                        'children': [{ ///Personal
                            'puesto': 'Encargado',
                            'telefono': '5560783022',
                            'father': 'Naib',
                            'ubicacion': 'Salón A (pasillos 3-7)',
                            'nombre': 'Arturo',
                            'apellido': 'Ortiz',
                            'imagen': 'dist/img/arturo.png',
                            'tipo': 'empleado'
                        }, {
                            'puesto': 'Dudas',
                            'telefono': '5563148975',
                            'ubicacion': 'Salón B (pasillos 2-5)',
                            'nombre': 'Xochitl',
                            'apellido': 'Mendoza',
                            'father': 'Naib',
                            'imagen': 'dist/img/xochitl.png',
                            'tipo': 'empleado'
                        }]
                    }, ]
                }
            ]
        }]
    };

    var oc = $('#chart-container').orgchart({
        'data': datasource,
        'nodeTemplate': nodeTemplate,
        'nodeContent': 'title',
        'zoom': true,
        'pan': true,
        visibleLevel: 4,

    });

    $('#btn_expand').on('click', function() {
        var $temp = oc.$chart.find('.hidden').removeClass('hidden');
        $temp[0].offsetWidth;
        $temp.find('.slide-up').removeClass('slide-up');
    });

    $('#btn_collapse').on('click', function() {
        oc.hideChildren(oc.$chart.find('.node:first'));
    });
});