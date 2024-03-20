/*
@project OXXO
@name Help Desk
@author LxingA
@message Funciones Esenciales para la Conexión con las API's correspondientes para el Proyecto
@date 01/02/24 13:00
*/
/** Obtención de Todas las Ordenes de OS-OXXO */
function orders() {
    try {
        const $__savedReferenceResponseFromAPI__$ = UrlFetchApp["fetch"](`${$__refEnvironmentInstance["getProperty"]("ckxk_woo_uri")}orders?per_page=100&after=${$__definedInitialSearchingForDated__["startAt"]}&before=${$__definedInitialSearchingForDated__["endAt"]}&orderby=date&order=asc`, {
            headers: {
                authorization: `Basic ${$__refEnvironmentInstance["getProperty"]("ckxk_woo_key")}`
            },
            method: "get",
            muteHttpExceptions: true,
            contentType: "application/json"
        });
        if ($__savedReferenceResponseFromAPI__$["getResponseCode"]() !== 200) modal("Hubo un error a obtener los pedidos desde OS-OXXO");
        else return JSON["parse"]($__savedReferenceResponseFromAPI__$["getContentText"]());
    } catch ($) {
        modal($);
    }
}