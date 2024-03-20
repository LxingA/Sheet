/*
@project OXXO
@name Help Desk
@author LxingA
@message Inicialización de la Instancia
@date 09/01/24 17:15
*/
const $__refCurrentInstance__ = SpreadsheetApp["getActiveSpreadsheet"]();
const $__refCurrentUIMenu = SpreadsheetApp["getUi"]()["createMenu"]("Acción");
const $__refEnvironmentInstance = PropertiesService["getScriptProperties"]();
const $__defObjectKeysLocal__ = {
  app: $__refEnvironmentInstance["getProperty"]("ckxk_sheetdb_app")["split"](","),
  token: $__refEnvironmentInstance["getProperty"]("ckxk_sheetdb_key")["split"](",")
};
/** Para cambiar las Fechas de Obtención de los Pedidos en OS-OXXO */
const $__definedInitialSearchingForDated__ = {
  startAt: "2024-01-20T00:00:00",
  endAt: "2024-01-20T01:00:00"
};

const $__getPrivateContentAuthentic__$ = $__refEnvironmentInstance["getProperty"]("ckxk_carrier_es_access")["split"](",");

/** Definición del Contenedor con los Meses en Texto a Númerico */
const $__containerMonthOnIDStructure__$ = {
  ENERO: 0,
  FEBRERO: 1,
  MARZO: 2,
  ABRIL: 3,
  MAYO: 4,
  JUNIO: 5,
  JULIO: 6,
  AGOSTO: 7,
  SEPTIEMBRE: 8,
  OCTUBRE: 9,
  NOVIEMBRE: 10,
  DICIEMBRE: 11
};

/** Definición de los Estatus de Envíos de la Paquetería */
const $__containerStatusTextLabel__$ = {
  PaqueteExpress: {
    BDL: "En espera en Oficina debido a OCURRE",
    CBD: "Entrega cancelada por OCURRE",
    CWB: "Se canceló por demasiado tiempo sin recolectar",
    HCA: "Paquete en el Almacén de Origen",
    HCM: "Paquete Escaneado en la Recolección en el Almacén de Origen",
    HDC: "Paquete Entregado",
    HDR: "Devolución del Paquete",
    REO: "Retención del Paquete por OCURRE",
    SIN: "Envio Cancelado por un Desastre Natural",
    TRN: "En Transito"
  }
};

/** Inicialización del Script en el Sheet */
function initial() {
  $__refCurrentUIMenu["addItem"]("Información", "callback_getInformation");
  $__refCurrentUIMenu["addItem"]("Actualizar", "callback_updateInformation");
  $__refCurrentUIMenu["addItem"]("Pedido", "callback_getOrder");
  $__refCurrentUIMenu["addItem"]("Finalizar", "finalize");
  $__refCurrentUIMenu["addItem"]("Reportear Pedidos", "callback_setReportOrders");
  $__refCurrentUIMenu["addToUi"]();
}

/**
 * Mostrar un Dialogo en la Vista
 * @param $text Texto a Mostrar en el Dialogo
 */
function modal($text) {
  const $__html__ = HtmlService["createHtmlOutput"](`<p>${$text}</p>`);
  $__html__["setWidth"](400);
  $__html__["setHeight"](400);
  SpreadsheetApp["getUi"]()["showModalDialog"]($__html__, "Error a Procesar");
}

/** Función de Utilidad para Finalizar un Pedido */
function finalize() {
  const $__refViewIDFromShell__ = $__refCurrentInstance__["getSheetByName"]("Pedidos - Tiendas");
  const $__savedRefCurrentRow__ = $__refViewIDFromShell__["getSelection"]()["getCurrentCell"]()["getRow"]();
  let $__savedRefTrackingID__;
  if (String($__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 6)["getValue"]())["startsWith"]("MTY")) $__savedRefTrackingID__ = $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 6)["getValue"]()["substring"](0, 14); else $__savedRefTrackingID__ = $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 6)["getValue"]();
  if ($__savedRefTrackingID__ == "") modal("No haz introducido aún un número de guía para el pedido");
  else {
    $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 6)["setValue"]($__savedRefTrackingID__);
    $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 7)["check"]();
    $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 8)["setValue"](Utilities["formatDate"]((new Date()), (Session["getScriptTimeZone"]()), "dd/MM/yy HH:mm:ss"));
  }
}

/**
 * Utilidad para Generar un Hash Random para el Identificador de la Solicitud OXXO
 * @param $len Longitud del Hash a Generar
 */
function random($len = 32) {
  const $__definedContainerStrong__ = ["zaqwsxcderfvbgtyhnmjukiloppolkimjunhybgtvfrcdexswzaq", "09876543210123456789", "PLOKIMJUNHYBGTVFRCDEXSWZAQQAZWSXEDCRFVTGBYHNUJMIKOLP"];
  let $__definedContainerNewStrong__ = "";
  for (let $y = 0; $y <= ($len - 1); $y++) {
    const $__currStrongSelectorContainerID__ = $__definedContainerStrong__[Math["round"](Math["random"]() * ($__definedContainerStrong__["length"] - 1))];
    $__definedContainerNewStrong__ += $__currStrongSelectorContainerID__[Math["round"](Math["random"]() * ($__currStrongSelectorContainerID__["length"] - 1))];
  }
  return $__definedContainerNewStrong__;
}

/** Función para la Llamada a la Obtención de Información de un Pedido OXXO */
function callback_getOrder() {
  const $__refViewIDFromShell__ = $__refCurrentInstance__["getSheetByName"]("Pedidos - Tiendas");
  const $__savedRefCurrentRow__ = $__refViewIDFromShell__["getSelection"]()["getCurrentCell"]()["getRow"]();
  const $__savedOrderFromAPIResponse__ = order(String($__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 1)["getValue"]()));
  if (typeof $__savedOrderFromAPIResponse__ == "object") {
    $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 2)["setValue"]($__savedOrderFromAPIResponse__["billing"]["first_name"]);
    $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 3)["setValue"](Utilities["formatDate"]((new Date()), (Session["getScriptTimeZone"]()), "dd/MM/yy HH:mm:ss"));
  } else modal("Error a Obtener la Información del Pedido \"" + $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 1)["getValue"]() + "\"");
}

/** Función para la Llamada a la Obtención de Información de una Tienda OXXO */
function callback_getInformation() {
  const $__refViewIDFromShell__ = $__refCurrentInstance__["getSheetByName"]("Direcciones - Tiendas");
  const $__savedRefCurrentRow__ = $__refViewIDFromShell__["getSelection"]()["getCurrentCell"]()["getRow"]();
  const $__refContentResponseFromAPI__ = information($__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 1)["getValue"]());
  if (typeof $__refContentResponseFromAPI__ == "object") {
    const $__defTextWithGeolocalicationShop__ = `${$__refContentResponseFromAPI__["latitud"]} ${$__refContentResponseFromAPI__["longitud"]}`;
    $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 2)["setRichTextValue"](SpreadsheetApp["newRichTextValue"]()["setText"]($__defTextWithGeolocalicationShop__)["setLinkUrl"](0, $__defTextWithGeolocalicationShop__["length"], `https://www.google.com/maps/place/${$__refContentResponseFromAPI__["latitud"]}+${$__refContentResponseFromAPI__["longitud"]}`)["build"]());
    $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 3)["setValue"](Utilities["formatDate"]((new Date()), (Session["getScriptTimeZone"]()), "dd/MM/yy HH:mm:ss"));
    $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 4)["setValue"]($__refContentResponseFromAPI__["nombre"]);
    $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 5)["setValue"]($__refContentResponseFromAPI__["postal"]);
    $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 6)["setValue"]($__refContentResponseFromAPI__["exterior"]);
    $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 7)["setValue"]($__refContentResponseFromAPI__["calle"]);
    $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 8)["setValue"]($__refContentResponseFromAPI__["referencia"]);
    $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 9)["setValue"]($__refContentResponseFromAPI__["colonia"]);
    $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 10)["setValue"]($__refContentResponseFromAPI__["ciudad"]);
    $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 11)["setValue"]($__refContentResponseFromAPI__["municipio"]);
    $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 12)["setValue"]("Ninguna");
    $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 14)["setValue"]("Sin Información");
    $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 15)["setValue"]($__refContentResponseFromAPI__["apertura"]);
  } else modal("Error a Obtener la Información de la Tienda \"" + $__refViewIDFromShell__["getRange"]($__savedRefCurrentRow__, 1)["getValue"]() + "\"");
}

/** Función para la Llamada a la Actualización de Información de una Tienda OXXO */
function callback_updateInformation() {
  const $__refViewIDFromShell__ = $__refCurrentInstance__["getSheetByName"]("Direcciones - Tiendas");
  const $__setContainerCurrentShellData__ = $__refViewIDFromShell__["getSelection"]()["getActiveRange"]()["getValues"]()[0];
  const $__savedCurrentRowOnUpdatedRequested__ = $__refViewIDFromShell__["getSelection"]()["getCurrentCell"]()["getRow"]();
  const $__setCurrentTimespam__ = Utilities["formatDate"]((new Date()), (Session["getScriptTimeZone"]()), "dd/MM/yy HH:mm:ss");
  const $__setRandomForCurrentRequest = random();
  const $__defObjectInstanceNewDataOnShop__ = {
    'IDENTIFICADOR': $__setRandomForCurrentRequest,
    'TIENDA': $__setContainerCurrentShellData__[0],
    'FECHA': $__setCurrentTimespam__,
    'SOLICITA': "Xink",
    'GEOLOCALIZACIÓN': (Boolean($__setContainerCurrentShellData__[12]) ? "Sí" : "No"),
    'CÓDIGO POSTAL': $__setContainerCurrentShellData__[4],
    'CALLE PRINCIPAL': $__setContainerCurrentShellData__[6],
    'REFERENCIAS': $__setContainerCurrentShellData__[7],
    'NÚMERO EXTERIOR': $__setContainerCurrentShellData__[5],
    'COLONIA': $__setContainerCurrentShellData__[8],
    'CIUDAD': $__setContainerCurrentShellData__[9],
    'MUNICIPIO': $__setContainerCurrentShellData__[10],
    'OBSERVACIONES': $__setContainerCurrentShellData__[11]
  };
  const $__batchSetNewInformationToAPI__ = update($__defObjectInstanceNewDataOnShop__);
  if (!$__batchSetNewInformationToAPI__) modal("Hubo un error a Actualizar la Información de la Tienda \"" + $__refViewIDFromShell__["getRange"]($__savedCurrentRowOnUpdatedRequested__, 1)["getValue"]() + "\"");
  else $__refViewIDFromShell__["getRange"]($__savedCurrentRowOnUpdatedRequested__, 14)["setValue"]($__setRandomForCurrentRequest);
}

/** Contenedor con Todos las Referencias de las Funciones de las Paqueterias para la Aplicación */
const $__defContainerCarrierSetup__$ = {
  /** Contenedor con los Handlers de la Paqueteria Estafeta */
  Estafeta: {
    /** Instancia de Función para la Obtención del Token JWT */
    $auth$: () => {
      const $__instanceGettingTokenAuthFromAPI__$ = UrlFetchApp["fetch"](`${$__refEnvironmentInstance["getProperty"]("ckxk_carrier_es_uri_auth")}auth/oauth/v2/token`, {
        method: "post",
        muteHttpExceptions: true,
        payload: {
          grant_type: $__getPrivateContentAuthentic__$[0],
          client_id: $__getPrivateContentAuthentic__$[1],
          client_secret: $__getPrivateContentAuthentic__$[2],
          scope: $__getPrivateContentAuthentic__$[3]
        }
      }); if ($__instanceGettingTokenAuthFromAPI__$["getResponseCode"]() != 200) return;
      else return JSON["parse"]($__instanceGettingTokenAuthFromAPI__$["getContentText"]())["access_token"];
    },
    /** Instancia de Función para la Consulta de una Guía */
    $init$: ($track$, $token$) => {
      const $__savedReferenceResponseFromAPI__$ = UrlFetchApp["fetch"](`${$__refEnvironmentInstance["getProperty"]("ckxk_carrier_es_uri_get")}tracking-item-status`, {
        method: "post",
        muteHttpExceptions: true,
        headers: {
          authorization: `Bearer ${$token$}`,
          apiKey: $__getPrivateContentAuthentic__$[1]
        },
        payload: JSON["stringify"]({
          searchType: ($track$["length"] == 22) ? 0 : 1,
          itemsSearch: [$track$],
          inputType: 0
        }),
        contentType: "application/json"
      });
      if ($__savedReferenceResponseFromAPI__$["getResponseCode"]() != 200) return;
      else {
        const $__savedResponseFromAPI__$ = JSON["parse"]($__savedReferenceResponseFromAPI__$["getContentText"]());
        if ($__savedResponseFromAPI__$["result"]["success"]) {
          console.log($__savedResponseFromAPI__$["items"][0]);
        } else return;
      }
    }
  },
  DHL: {
    /** Instancia de Función para la Consulta de una Guía */
    $init$: ($track$) => {
      /*const $__savedReferenceResponseFromAPI__$ = UrlFetchApp["fetch"](`${$__refEnvironmentInstance["getProperty"]("ckxk_carrier_dhl_uri")}?trackingNumber=${$track$}&service=express`,{
        method: "get",
        muteHttpExceptions: true,
        headers: {
          "DHL-API-Key": $__refEnvironmentInstance["getProperty"]("ckxk_carrier_dhl_token")
        }
      });*/
      const $__savedReferenceResponseFromAPI__$ = UrlFetchApp["fetch"](`${$__refEnvironmentInstance["getProperty"]("ckxk_carrier_dhl_uri")}shipments/${$track$}/tracking`, {
        method: "get",
        muteHttpExceptions: true,
        headers: {
          authorization: `Basic ${$__refEnvironmentInstance["getProperty"]("ckxk_carrier_dhl_token")}`
        }
      });
      console.log($__savedReferenceResponseFromAPI__$["getResponseCode"]());
      console.log($__savedReferenceResponseFromAPI__$["getContentText"]());
      if ($__savedReferenceResponseFromAPI__$["getResponseCode"]() != 200) return;
      else {
        const $__savedResponseFromAPI__$ = JSON["parse"]($__savedReferenceResponseFromAPI__$["getContentText"]());
        console.log($__savedResponseFromAPI__$);
        /*if($__savedResponseFromAPI__$["length"] > 0){
          const $__savedRefObjectEvents__$ = $__savedResponseFromAPI__$[0]["events"];
          let $__defObjectGlobalCarrierResponse__$ = {
            status: "",
            recollectionAtDate: "Sin Información",
            confirmAtDate: "Sin Información",
            deliveryAtDate: "",
            receiverBy: "Sin Información"
          };
          console.log($__savedResponseFromAPI__$[0]);
        }else return;*/
      }
    }
  },
  FedEx: {
    /** Instancia de Función para la Obtención del Token JWT */
    $auth$: () => { },
    /** Instancia de Función para la Consulta de una Guía */
    $init$: ($track$, $token$) => { }
  },
  PaqueteExpress: {
    /** Instancia de Función para la Consulta de una Guía */
    $init$: ($track$) => {
      const $__savedReferenceResponseFromAPI__$ = UrlFetchApp["fetch"](`${$__refEnvironmentInstance["getProperty"]("ckxk_carrier_pe_uri")}${$track$}/${$__refEnvironmentInstance["getProperty"]("ckxk_carrier_pe_token")}`, {
        method: "get",
        muteHttpExceptions: true
      });
      if ($__savedReferenceResponseFromAPI__$["getResponseCode"]() != 200) return;
      else {
        const $__savedResponseFromAPI__$ = JSON["parse"]($__savedReferenceResponseFromAPI__$["getContentText"]())["body"]["response"]["data"];
        if ($__savedResponseFromAPI__$["length"] > 0) {
          const $__getContainerDeliverySuccess__$ = $__savedResponseFromAPI__$["filter"](({ status }) => status["indexOf"]("Mercancía Entregada") != "-1");
          const $__getLastedEventOnGuide__$ = ($__getContainerDeliverySuccess__$["length"] > 0) ? $__getContainerDeliverySuccess__$[0] : $__savedResponseFromAPI__$[($__savedResponseFromAPI__$["length"] - 1)];
          const $__getCollectionAtDatedFromObject__$ = $__savedResponseFromAPI__$["filter"](({ status }) => status["indexOf"]("Recolección Realizada") != "-1");
          const $__splitCurrentPromesaAtDated__$ = $__getLastedEventOnGuide__$["promesa"]["split"]("de");
          let $__defObjectGlobalCarrierResponse__$ = {
            status: $__containerStatusTextLabel__$["PaqueteExpress"][$__getLastedEventOnGuide__$["eventoId"]] ?? "En Transito",
            recollectionAtDate: "Sin Información",
            confirmAtDate: Utilities["formatDate"]((new Date(Number($__splitCurrentPromesaAtDated__$[2]["substring"](1)["trim"]()), $__containerMonthOnIDStructure__$[$__splitCurrentPromesaAtDated__$[1]["trim"]()["toUpperCase"]()], Number($__splitCurrentPromesaAtDated__$[0]["trim"]()))), (Session["getScriptTimeZone"]()), "dd/MM/yy HH:mm:ss"),
            deliveryAtDate: Utilities["formatDate"]((new Date($__getLastedEventOnGuide__$["fechahora"])), (Session["getScriptTimeZone"]()), "dd/MM/yy HH:mm:ss"),
            receiverBy: "Sin Información"
          };
          if ($__getLastedEventOnGuide__$["status"]["lastIndexOf"]("recibió") != "-1") $__defObjectGlobalCarrierResponse__$["receiverBy"] = $__getLastedEventOnGuide__$["status"]["split"](",")[1]["substring"](9)["trim"]();
          if ($__getCollectionAtDatedFromObject__$["length"] > 0) $__defObjectGlobalCarrierResponse__$["recollectionAtDate"] = Utilities["formatDate"]((new Date($__getCollectionAtDatedFromObject__$[0]["fechahora"])), (Session["getScriptTimeZone"]()), "dd/MM/yy HH:mm:ss");
          return $__defObjectGlobalCarrierResponse__$;
        } else return;
      }
    }
  }
};

/** Funcionalidad de Utilidad para Realizar Pruebas en el Entorno de Google Apps Script */
function tested() {
  //console.log($__defContainerCarrierSetup__$.Estafeta.$init$("3956764318",$__defContainerCarrierSetup__$.Estafeta.$auth$()));
  console.log($__defContainerCarrierSetup__$.DHL.$init$("1090593744"));
}

/** Función para la Definición del Reporte de los Pedidos */
function callback_setReportOrders() {
  const $__instanceContainerOrders__ = orders();
  const $__defReferenceShellContainerOrdersIncidents__$ = $__refCurrentInstance__["getSheetByName"]("Pedidos - Tiendas");
  const $__defReferenceShellContainerHistoryReporting__$ = $__refCurrentInstance__["getSheetByName"]("Reporte - Paquetería");
  const $__defStatusFormatText__$ = {
    processing: "Obteniendo Información",
    completed: "Proceso de Envio"
  };
  $__initialFetchedAllOrdersFromIncidents__$ = $__defReferenceShellContainerOrdersIncidents__$["getRangeList"](["A:A"])["getRanges"]();
  if (typeof $__instanceContainerOrders__ !== "object") modal("Hubo un error a obtener las ordenes desde la API");
  else {
    const $__definedNewContainerOrders__ = $__instanceContainerOrders__["map"](order => {
      let $__localeobject__$ = {
        order: order["id"],
        storage: {
          status: order["status"],
          date: order["date_created"]
        },
        name: order["billing"]["last_name"],
        cr: order["billing"]["first_name"],
        email: order["billing"]["email"],
        state: order["billing"]["state"],
        carrier: {}
      };
      if (order["line_items"]["length"] > 0) {
        $__definedMetadataContainerCurrentOrder__$ = order["line_items"][0]["meta_data"]["filter"](({ key }) => key == "pa_region");
        if ($__definedMetadataContainerCurrentOrder__$["length"] > 0) $__localeobject__$["zone"] = $__definedMetadataContainerCurrentOrder__$[0]["display_value"]["toUpperCase"]();
      }
      if ($__initialFetchedAllOrdersFromIncidents__$["map"](k => (k["getValues"]()["map"](i => { if (typeof (i[0]) == "number") return i[0] })))[0]["filter"](k => typeof (k) == "number")["includes"](order["id"])) {
        let $__definedContainerCurrentID__$ = 1;
        $__initialFetchedAllOrdersFromIncidents__$["forEach"]($i$ => ($i$["getValues"]()["forEach"](($x$, $k$) => {
          if (typeof $x$[0] == "number" && $x$[0] == order["id"]) $__definedContainerCurrentID__$ = ($k$ + 1)
        })));
        $__localeobject__$["carrier"]["track"] = $__defReferenceShellContainerOrdersIncidents__$["getRange"]($__definedContainerCurrentID__$, 6)["getValue"]();
        $__localeobject__$["carrier"]["name"] = $__defReferenceShellContainerOrdersIncidents__$["getRange"]($__definedContainerCurrentID__$, 5)["getValue"]();
      } else {
        $__defContainerWithValueTracking__$ = order["meta_data"]["filter"](({ key }) => key == "_wc_shipment_tracking_items");
        if ($__defContainerWithValueTracking__$["length"] > 0) {
          const $__defContainerTrackingInfo__$ = $__defContainerWithValueTracking__$[0]["value"];
          $__localeobject__$["carrier"]["track"] = $__defContainerTrackingInfo__$[0]["tracking_number"];
          $__localeobject__$["carrier"]["name"] = $__defContainerTrackingInfo__$[0]["custom_tracking_provider"];
        }
      }
      const $__defContainerCarrierExtraInfoFromAPI__$ = $__defContainerCarrierSetup__$[$__localeobject__$["carrier"]["name"] ?? "Estafeta"]["$init$"]($__localeobject__$["carrier"]["track"]);
      if (typeof $__defContainerCarrierExtraInfoFromAPI__$ == "object") $__localeobject__$["carrier"] = { ...$__localeobject__$["carrier"], ...$__defContainerCarrierExtraInfoFromAPI__$ };
      return $__localeobject__$;
    });
    for (let $y$ = 0; $y$ < $__definedNewContainerOrders__["length"]; $y$++) {
      const $started$ = $y$ == 0 ? 2 : ($y$ + 2);
      $__defReferenceShellContainerHistoryReporting__$["getRange"]($started$, 1)["setValue"]($__definedNewContainerOrders__[$y$]["order"]);
      $__defReferenceShellContainerHistoryReporting__$["getRange"]($started$, 2)["setValue"]($__definedNewContainerOrders__[$y$]["cr"]);
      $__defReferenceShellContainerHistoryReporting__$["getRange"]($started$, 3)["setValue"]($__definedNewContainerOrders__[$y$]["name"]);
      $__defReferenceShellContainerHistoryReporting__$["getRange"]($started$, 4)["setValue"]($__definedNewContainerOrders__[$y$]["email"]);
      $__defReferenceShellContainerHistoryReporting__$["getRange"]($started$, 5)["setValue"]($__definedNewContainerOrders__[$y$]["zone"] ?? "Sin Información");
      $__defReferenceShellContainerHistoryReporting__$["getRange"]($started$, 6)["setValue"](Utilities["formatDate"]((new Date($__definedNewContainerOrders__[$y$]["storage"]["date"])), (Session["getScriptTimeZone"]()), "dd/MM/yy HH:mm:ss"));
      $__defReferenceShellContainerHistoryReporting__$["getRange"]($started$, 7)["setValue"]($__defStatusFormatText__$[$__definedNewContainerOrders__[$y$]["storage"]["status"]]);
      $__defReferenceShellContainerHistoryReporting__$["getRange"]($started$, 8)["setValue"]($__definedNewContainerOrders__[$y$]["carrier"]["name"] ?? "Sin Información");
      $__defReferenceShellContainerHistoryReporting__$["getRange"]($started$, 9)["setValue"]($__definedNewContainerOrders__[$y$]["carrier"]["track"] ?? "Sin Información");
      $__defReferenceShellContainerHistoryReporting__$["getRange"]($started$, 10)["setValue"]($__definedNewContainerOrders__[$y$]["carrier"]["status"] ?? "Sin Información");
      $__defReferenceShellContainerHistoryReporting__$["getRange"]($started$, 11)["setValue"]($__definedNewContainerOrders__[$y$]["carrier"]["recollectionAtDate"] ?? "Sin Información");
      $__defReferenceShellContainerHistoryReporting__$["getRange"]($started$, 12)["setValue"]($__definedNewContainerOrders__[$y$]["carrier"]["confirmAtDate"] ?? "Sin Información");
      $__defReferenceShellContainerHistoryReporting__$["getRange"]($started$, 13)["setValue"]($__definedNewContainerOrders__[$y$]["carrier"]["deliveryAtDate"] ?? "Sin Información");
      $__defReferenceShellContainerHistoryReporting__$["getRange"]($started$, 14)["setValue"]($__definedNewContainerOrders__[$y$]["carrier"]["receiverBy"] ?? "Sin Información");
    }
  }
}