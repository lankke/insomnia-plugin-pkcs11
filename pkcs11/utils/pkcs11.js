"use strict";
exports.__esModule = true;
exports.initToken = void 0;
var pkcs11js_1 = require("pkcs11js");
function initToken() {
    try {
        var pkcs11 = new pkcs11js_1.PKCS11();
        pkcs11.load('/usr/lib/opensc-pkcs11.so');
        pkcs11.C_Initialize();
        pkcs11.C_Finalize();
    }
    catch (error) {
        console.error("caught error in initToken");
        throw error;
    }
    finally {
        console.log("No issue here!");
    }
}
exports.initToken = initToken;
//# sourceMappingURL=pkcs11.js.map