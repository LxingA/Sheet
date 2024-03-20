/*
@project OXXO
@name Help Desk
@author LxingA
@message Función Principal para la Actualización de la Información de una Tienda
@date 10/01/24 10:00
*/

/**
 * Actualizar la Información de una Tienda OXXO
 * @param $container Contenedor con la Nueva Información a Actualizar
 */
function update($container) {
    const $__savedDataFromResponseAPI__ = UrlFetchApp["fetch"](`${$__refEnvironmentInstance["getProperty"]("ckxk_sheetdb_uri")}${$__defObjectKeysLocal__["app"][1]}`, {
        headers: {
            authorization: `Basic ${$__defObjectKeysLocal__["token"][1]}`
        },
        method: "post",
        muteHttpExceptions: true,
        payload: JSON["stringify"]({
            data: [
                $container
            ]
        }),
        contentType: "application/json"
    });
    if ($__savedDataFromResponseAPI__["getResponseCode"]() != 201) return false; else return true;
}