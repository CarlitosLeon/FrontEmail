var datasource;

function getEvent(Evento) {
    $.ajax({
        type: 'POST',
        data: { "Operacion": Evento },
        url: 'data.php',
        dataType: "json",
        success: function(res) {
                datasource = res;
            } ///End success
    });
}