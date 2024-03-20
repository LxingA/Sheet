/*
@project OXXO
@name Help Desk
@author LxingA
@message Función Principal para la Obtención de la Información de una Tienda mediante su CR
@date 10/01/24 08:30
*/

/**
 * Obtención de la Información de una Tienda OXXO
 * @param $cr ID de la Tienda
 */
function information($cr) {
    if (typeof $cr != "string" || !(/^10([A-Z]+){3}(5|6)0([A-Z0-9]+){3,4}$/["test"]($cr)) || $cr["length"] < 10) return;
    else {
        const $__refResponseFromAPISheetDB__ = UrlFetchApp["fetch"](`${$__refEnvironmentInstance["getProperty"]("ckxk_sheetdb_uri")}${$__defObjectKeysLocal__["app"][0]}/search?cr=${$cr["toUpperCase"]()}`, {
            contentType: "application/x-www-form-urlcoded",
            headers: {
                authorization: `Basic ${$__defObjectKeysLocal__["token"][0]}`
            },
            method: "get",
            muteHttpExceptions: true
        });
        if ($__refResponseFromAPISheetDB__["getResponseCode"]() != 200) return;
        else return JSON["parse"]($__refResponseFromAPISheetDB__["getContentText"]())[0];
    }
}

/**
* Obtención de la Información de un Pedido OXXO
* @param $id ID del Pedido
*/
function order($id) {
    if (typeof $id != "string") return;
    else {
        const $__refResponseFromAPIWooDB__ = UrlFetchApp["fetch"](`${$__refEnvironmentInstance["getProperty"]("ckxk_woo_uri")}orders/${$id}`, {
            contentType: "application/json",
            headers: {
                authorization: `Basic ${$__refEnvironmentInstance["getProperty"]("ckxk_woo_key")}`
            },
            method: "get",
            muteHttpExceptions: true
        });
        if ($__refResponseFromAPIWooDB__["getResponseCode"]() != 200) return;
        else return JSON["parse"]($__refResponseFromAPIWooDB__["getContentText"]());
    }
}