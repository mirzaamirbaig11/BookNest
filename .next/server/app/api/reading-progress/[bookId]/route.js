"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/reading-progress/[bookId]/route";
exports.ids = ["app/api/reading-progress/[bookId]/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "node:buffer":
/*!******************************!*\
  !*** external "node:buffer" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:buffer");

/***/ }),

/***/ "node:crypto":
/*!******************************!*\
  !*** external "node:crypto" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ "node:util":
/*!****************************!*\
  !*** external "node:util" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("node:util");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Freading-progress%2F%5BbookId%5D%2Froute&page=%2Fapi%2Freading-progress%2F%5BbookId%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freading-progress%2F%5BbookId%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cmirza%5CDownloads%5Cbooknest-fixed%5Cbooknest%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cmirza%5CDownloads%5Cbooknest-fixed%5Cbooknest&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Freading-progress%2F%5BbookId%5D%2Froute&page=%2Fapi%2Freading-progress%2F%5BbookId%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freading-progress%2F%5BbookId%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cmirza%5CDownloads%5Cbooknest-fixed%5Cbooknest%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cmirza%5CDownloads%5Cbooknest-fixed%5Cbooknest&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_mirza_Downloads_booknest_fixed_booknest_app_api_reading_progress_bookId_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/reading-progress/[bookId]/route.ts */ \"(rsc)/./app/api/reading-progress/[bookId]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/reading-progress/[bookId]/route\",\n        pathname: \"/api/reading-progress/[bookId]\",\n        filename: \"route\",\n        bundlePath: \"app/api/reading-progress/[bookId]/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\mirza\\\\Downloads\\\\booknest-fixed\\\\booknest\\\\app\\\\api\\\\reading-progress\\\\[bookId]\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_mirza_Downloads_booknest_fixed_booknest_app_api_reading_progress_bookId_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/reading-progress/[bookId]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZyZWFkaW5nLXByb2dyZXNzJTJGJTVCYm9va0lkJTVEJTJGcm91dGUmcGFnZT0lMkZhcGklMkZyZWFkaW5nLXByb2dyZXNzJTJGJTVCYm9va0lkJTVEJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGcmVhZGluZy1wcm9ncmVzcyUyRiU1QmJvb2tJZCU1RCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNtaXJ6YSU1Q0Rvd25sb2FkcyU1Q2Jvb2tuZXN0LWZpeGVkJTVDYm9va25lc3QlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q21pcnphJTVDRG93bmxvYWRzJTVDYm9va25lc3QtZml4ZWQlNUNib29rbmVzdCZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDcUQ7QUFDbEk7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ib29rbmVzdC8/YjI1YSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJDOlxcXFxVc2Vyc1xcXFxtaXJ6YVxcXFxEb3dubG9hZHNcXFxcYm9va25lc3QtZml4ZWRcXFxcYm9va25lc3RcXFxcYXBwXFxcXGFwaVxcXFxyZWFkaW5nLXByb2dyZXNzXFxcXFtib29rSWRdXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9yZWFkaW5nLXByb2dyZXNzL1tib29rSWRdL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvcmVhZGluZy1wcm9ncmVzcy9bYm9va0lkXVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvcmVhZGluZy1wcm9ncmVzcy9bYm9va0lkXS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXG1pcnphXFxcXERvd25sb2Fkc1xcXFxib29rbmVzdC1maXhlZFxcXFxib29rbmVzdFxcXFxhcHBcXFxcYXBpXFxcXHJlYWRpbmctcHJvZ3Jlc3NcXFxcW2Jvb2tJZF1cXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL3JlYWRpbmctcHJvZ3Jlc3MvW2Jvb2tJZF0vcm91dGVcIjtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgc2VydmVySG9va3MsXG4gICAgICAgIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Freading-progress%2F%5BbookId%5D%2Froute&page=%2Fapi%2Freading-progress%2F%5BbookId%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freading-progress%2F%5BbookId%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cmirza%5CDownloads%5Cbooknest-fixed%5Cbooknest%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cmirza%5CDownloads%5Cbooknest-fixed%5Cbooknest&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/reading-progress/[bookId]/route.ts":
/*!****************************************************!*\
  !*** ./app/api/reading-progress/[bookId]/route.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n\n\n\nasync function GET(_request, { params }) {\n    const session = await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.getSession)();\n    if (!session) return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        progress: null\n    });\n    const progress = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.readingHistory.findUnique({\n        where: {\n            userId_bookId: {\n                userId: session.userId,\n                bookId: params.bookId\n            }\n        }\n    });\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        progress\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3JlYWRpbmctcHJvZ3Jlc3MvW2Jvb2tJZF0vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUF3RDtBQUNsQjtBQUNFO0FBRWpDLGVBQWVHLElBQUlDLFFBQXFCLEVBQUUsRUFBRUMsTUFBTSxFQUFrQztJQUN6RixNQUFNQyxVQUFVLE1BQU1KLHFEQUFVQTtJQUNoQyxJQUFJLENBQUNJLFNBQVMsT0FBT04scURBQVlBLENBQUNPLElBQUksQ0FBQztRQUFFQyxVQUFVO0lBQUs7SUFFeEQsTUFBTUEsV0FBVyxNQUFNUCwrQ0FBTUEsQ0FBQ1EsY0FBYyxDQUFDQyxVQUFVLENBQUM7UUFDdERDLE9BQU87WUFBRUMsZUFBZTtnQkFBRUMsUUFBUVAsUUFBUU8sTUFBTTtnQkFBRUMsUUFBUVQsT0FBT1MsTUFBTTtZQUFDO1FBQUU7SUFDNUU7SUFFQSxPQUFPZCxxREFBWUEsQ0FBQ08sSUFBSSxDQUFDO1FBQUVDO0lBQVM7QUFDdEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ib29rbmVzdC8uL2FwcC9hcGkvcmVhZGluZy1wcm9ncmVzcy9bYm9va0lkXS9yb3V0ZS50cz82YjE4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tICdAL2xpYi9wcmlzbWEnO1xuaW1wb3J0IHsgZ2V0U2Vzc2lvbiB9IGZyb20gJ0AvbGliL2F1dGgnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKF9yZXF1ZXN0OiBOZXh0UmVxdWVzdCwgeyBwYXJhbXMgfTogeyBwYXJhbXM6IHsgYm9va0lkOiBzdHJpbmcgfSB9KSB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXNzaW9uKCk7XG4gIGlmICghc2Vzc2lvbikgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgcHJvZ3Jlc3M6IG51bGwgfSk7XG5cbiAgY29uc3QgcHJvZ3Jlc3MgPSBhd2FpdCBwcmlzbWEucmVhZGluZ0hpc3RvcnkuZmluZFVuaXF1ZSh7XG4gICAgd2hlcmU6IHsgdXNlcklkX2Jvb2tJZDogeyB1c2VySWQ6IHNlc3Npb24udXNlcklkLCBib29rSWQ6IHBhcmFtcy5ib29rSWQgfSB9LFxuICB9KTtcblxuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBwcm9ncmVzcyB9KTtcbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJwcmlzbWEiLCJnZXRTZXNzaW9uIiwiR0VUIiwiX3JlcXVlc3QiLCJwYXJhbXMiLCJzZXNzaW9uIiwianNvbiIsInByb2dyZXNzIiwicmVhZGluZ0hpc3RvcnkiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJ1c2VySWRfYm9va0lkIiwidXNlcklkIiwiYm9va0lkIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/reading-progress/[bookId]/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SESSION_COOKIE_NAME: () => (/* binding */ SESSION_COOKIE_NAME),\n/* harmony export */   clearSessionCookie: () => (/* binding */ clearSessionCookie),\n/* harmony export */   createSessionToken: () => (/* binding */ createSessionToken),\n/* harmony export */   getSession: () => (/* binding */ getSession),\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   setSessionCookie: () => (/* binding */ setSessionCookie),\n/* harmony export */   verifyPassword: () => (/* binding */ verifyPassword),\n/* harmony export */   verifySessionToken: () => (/* binding */ verifySessionToken)\n/* harmony export */ });\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var jose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! jose */ \"(rsc)/./node_modules/jose/dist/node/esm/jwt/sign.js\");\n/* harmony import */ var jose__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jose */ \"(rsc)/./node_modules/jose/dist/node/esm/jwt/verify.js\");\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n\n\n\nconst SESSION_COOKIE = \"booknest_session\";\nconst SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days\nfunction getSecretKey() {\n    const secret = process.env.AUTH_SECRET;\n    if (!secret || secret.length < 16) {\n        throw new Error(\"AUTH_SECRET is missing or too short. Set a strong random value in your .env file.\");\n    }\n    return new TextEncoder().encode(secret);\n}\nasync function hashPassword(password) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_0___default().hash(password, 12);\n}\nasync function verifyPassword(password, hash) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_0___default().compare(password, hash);\n}\nasync function createSessionToken(payload) {\n    return new jose__WEBPACK_IMPORTED_MODULE_2__.SignJWT({\n        ...payload\n    }).setProtectedHeader({\n        alg: \"HS256\"\n    }).setIssuedAt().setExpirationTime(`${SESSION_TTL_SECONDS}s`).sign(getSecretKey());\n}\nasync function verifySessionToken(token) {\n    try {\n        const { payload } = await (0,jose__WEBPACK_IMPORTED_MODULE_3__.jwtVerify)(token, getSecretKey());\n        return payload;\n    } catch  {\n        return null;\n    }\n}\n/** Sets the httpOnly session cookie. Call from a Route Handler / Server Action. */ function setSessionCookie(token) {\n    (0,next_headers__WEBPACK_IMPORTED_MODULE_1__.cookies)().set(SESSION_COOKIE, token, {\n        httpOnly: true,\n        secure: \"development\" === \"production\",\n        sameSite: \"lax\",\n        path: \"/\",\n        maxAge: SESSION_TTL_SECONDS\n    });\n}\nfunction clearSessionCookie() {\n    (0,next_headers__WEBPACK_IMPORTED_MODULE_1__.cookies)().set(SESSION_COOKIE, \"\", {\n        path: \"/\",\n        maxAge: 0\n    });\n}\n/** Reads and verifies the session from the request cookies. Returns null if absent/invalid. */ async function getSession() {\n    const token = (0,next_headers__WEBPACK_IMPORTED_MODULE_1__.cookies)().get(SESSION_COOKIE)?.value;\n    if (!token) return null;\n    return verifySessionToken(token);\n}\nconst SESSION_COOKIE_NAME = SESSION_COOKIE;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQThCO0FBQ1k7QUFDSDtBQUV2QyxNQUFNSSxpQkFBaUI7QUFDdkIsTUFBTUMsc0JBQXNCLEtBQUssS0FBSyxLQUFLLEdBQUcsU0FBUztBQUV2RCxTQUFTQztJQUNQLE1BQU1DLFNBQVNDLFFBQVFDLEdBQUcsQ0FBQ0MsV0FBVztJQUN0QyxJQUFJLENBQUNILFVBQVVBLE9BQU9JLE1BQU0sR0FBRyxJQUFJO1FBQ2pDLE1BQU0sSUFBSUMsTUFDUjtJQUVKO0lBQ0EsT0FBTyxJQUFJQyxjQUFjQyxNQUFNLENBQUNQO0FBQ2xDO0FBUU8sZUFBZVEsYUFBYUMsUUFBZ0I7SUFDakQsT0FBT2hCLG9EQUFXLENBQUNnQixVQUFVO0FBQy9CO0FBRU8sZUFBZUUsZUFBZUYsUUFBZ0IsRUFBRUMsSUFBWTtJQUNqRSxPQUFPakIsdURBQWMsQ0FBQ2dCLFVBQVVDO0FBQ2xDO0FBRU8sZUFBZUcsbUJBQW1CQyxPQUF1QjtJQUM5RCxPQUFPLElBQUlwQix5Q0FBT0EsQ0FBQztRQUFFLEdBQUdvQixPQUFPO0lBQUMsR0FDN0JDLGtCQUFrQixDQUFDO1FBQUVDLEtBQUs7SUFBUSxHQUNsQ0MsV0FBVyxHQUNYQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUVwQixvQkFBb0IsQ0FBQyxDQUFDLEVBQzNDcUIsSUFBSSxDQUFDcEI7QUFDVjtBQUVPLGVBQWVxQixtQkFBbUJDLEtBQWE7SUFDcEQsSUFBSTtRQUNGLE1BQU0sRUFBRVAsT0FBTyxFQUFFLEdBQUcsTUFBTW5CLCtDQUFTQSxDQUFDMEIsT0FBT3RCO1FBQzNDLE9BQU9lO0lBQ1QsRUFBRSxPQUFNO1FBQ04sT0FBTztJQUNUO0FBQ0Y7QUFFQSxpRkFBaUYsR0FDMUUsU0FBU1EsaUJBQWlCRCxLQUFhO0lBQzVDekIscURBQU9BLEdBQUcyQixHQUFHLENBQUMxQixnQkFBZ0J3QixPQUFPO1FBQ25DRyxVQUFVO1FBQ1ZDLFFBQVF4QixrQkFBeUI7UUFDakN5QixVQUFVO1FBQ1ZDLE1BQU07UUFDTkMsUUFBUTlCO0lBQ1Y7QUFDRjtBQUVPLFNBQVMrQjtJQUNkakMscURBQU9BLEdBQUcyQixHQUFHLENBQUMxQixnQkFBZ0IsSUFBSTtRQUFFOEIsTUFBTTtRQUFLQyxRQUFRO0lBQUU7QUFDM0Q7QUFFQSw2RkFBNkYsR0FDdEYsZUFBZUU7SUFDcEIsTUFBTVQsUUFBUXpCLHFEQUFPQSxHQUFHbUMsR0FBRyxDQUFDbEMsaUJBQWlCbUM7SUFDN0MsSUFBSSxDQUFDWCxPQUFPLE9BQU87SUFDbkIsT0FBT0QsbUJBQW1CQztBQUM1QjtBQUVPLE1BQU1ZLHNCQUFzQnBDLGVBQWUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ib29rbmVzdC8uL2xpYi9hdXRoLnRzP2JmN2UiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHRqcyc7XG5pbXBvcnQgeyBTaWduSldULCBqd3RWZXJpZnkgfSBmcm9tICdqb3NlJztcbmltcG9ydCB7IGNvb2tpZXMgfSBmcm9tICduZXh0L2hlYWRlcnMnO1xuXG5jb25zdCBTRVNTSU9OX0NPT0tJRSA9ICdib29rbmVzdF9zZXNzaW9uJztcbmNvbnN0IFNFU1NJT05fVFRMX1NFQ09ORFMgPSA2MCAqIDYwICogMjQgKiA3OyAvLyA3IGRheXNcblxuZnVuY3Rpb24gZ2V0U2VjcmV0S2V5KCkge1xuICBjb25zdCBzZWNyZXQgPSBwcm9jZXNzLmVudi5BVVRIX1NFQ1JFVDtcbiAgaWYgKCFzZWNyZXQgfHwgc2VjcmV0Lmxlbmd0aCA8IDE2KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0FVVEhfU0VDUkVUIGlzIG1pc3Npbmcgb3IgdG9vIHNob3J0LiBTZXQgYSBzdHJvbmcgcmFuZG9tIHZhbHVlIGluIHlvdXIgLmVudiBmaWxlLidcbiAgICApO1xuICB9XG4gIHJldHVybiBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUoc2VjcmV0KTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTZXNzaW9uUGF5bG9hZCB7XG4gIHVzZXJJZDogc3RyaW5nO1xuICByb2xlOiAnVVNFUicgfCAnQURNSU4nO1xuICBlbWFpbDogc3RyaW5nO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFzaFBhc3N3b3JkKHBhc3N3b3JkOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICByZXR1cm4gYmNyeXB0Lmhhc2gocGFzc3dvcmQsIDEyKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHZlcmlmeVBhc3N3b3JkKHBhc3N3b3JkOiBzdHJpbmcsIGhhc2g6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICByZXR1cm4gYmNyeXB0LmNvbXBhcmUocGFzc3dvcmQsIGhhc2gpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlU2Vzc2lvblRva2VuKHBheWxvYWQ6IFNlc3Npb25QYXlsb2FkKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgcmV0dXJuIG5ldyBTaWduSldUKHsgLi4ucGF5bG9hZCB9KVxuICAgIC5zZXRQcm90ZWN0ZWRIZWFkZXIoeyBhbGc6ICdIUzI1NicgfSlcbiAgICAuc2V0SXNzdWVkQXQoKVxuICAgIC5zZXRFeHBpcmF0aW9uVGltZShgJHtTRVNTSU9OX1RUTF9TRUNPTkRTfXNgKVxuICAgIC5zaWduKGdldFNlY3JldEtleSgpKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHZlcmlmeVNlc3Npb25Ub2tlbih0b2tlbjogc3RyaW5nKTogUHJvbWlzZTxTZXNzaW9uUGF5bG9hZCB8IG51bGw+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IHBheWxvYWQgfSA9IGF3YWl0IGp3dFZlcmlmeSh0b2tlbiwgZ2V0U2VjcmV0S2V5KCkpO1xuICAgIHJldHVybiBwYXlsb2FkIGFzIHVua25vd24gYXMgU2Vzc2lvblBheWxvYWQ7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbi8qKiBTZXRzIHRoZSBodHRwT25seSBzZXNzaW9uIGNvb2tpZS4gQ2FsbCBmcm9tIGEgUm91dGUgSGFuZGxlciAvIFNlcnZlciBBY3Rpb24uICovXG5leHBvcnQgZnVuY3Rpb24gc2V0U2Vzc2lvbkNvb2tpZSh0b2tlbjogc3RyaW5nKSB7XG4gIGNvb2tpZXMoKS5zZXQoU0VTU0lPTl9DT09LSUUsIHRva2VuLCB7XG4gICAgaHR0cE9ubHk6IHRydWUsXG4gICAgc2VjdXJlOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nLFxuICAgIHNhbWVTaXRlOiAnbGF4JyxcbiAgICBwYXRoOiAnLycsXG4gICAgbWF4QWdlOiBTRVNTSU9OX1RUTF9TRUNPTkRTLFxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyU2Vzc2lvbkNvb2tpZSgpIHtcbiAgY29va2llcygpLnNldChTRVNTSU9OX0NPT0tJRSwgJycsIHsgcGF0aDogJy8nLCBtYXhBZ2U6IDAgfSk7XG59XG5cbi8qKiBSZWFkcyBhbmQgdmVyaWZpZXMgdGhlIHNlc3Npb24gZnJvbSB0aGUgcmVxdWVzdCBjb29raWVzLiBSZXR1cm5zIG51bGwgaWYgYWJzZW50L2ludmFsaWQuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0U2Vzc2lvbigpOiBQcm9taXNlPFNlc3Npb25QYXlsb2FkIHwgbnVsbD4ge1xuICBjb25zdCB0b2tlbiA9IGNvb2tpZXMoKS5nZXQoU0VTU0lPTl9DT09LSUUpPy52YWx1ZTtcbiAgaWYgKCF0b2tlbikgcmV0dXJuIG51bGw7XG4gIHJldHVybiB2ZXJpZnlTZXNzaW9uVG9rZW4odG9rZW4pO1xufVxuXG5leHBvcnQgY29uc3QgU0VTU0lPTl9DT09LSUVfTkFNRSA9IFNFU1NJT05fQ09PS0lFO1xuIl0sIm5hbWVzIjpbImJjcnlwdCIsIlNpZ25KV1QiLCJqd3RWZXJpZnkiLCJjb29raWVzIiwiU0VTU0lPTl9DT09LSUUiLCJTRVNTSU9OX1RUTF9TRUNPTkRTIiwiZ2V0U2VjcmV0S2V5Iiwic2VjcmV0IiwicHJvY2VzcyIsImVudiIsIkFVVEhfU0VDUkVUIiwibGVuZ3RoIiwiRXJyb3IiLCJUZXh0RW5jb2RlciIsImVuY29kZSIsImhhc2hQYXNzd29yZCIsInBhc3N3b3JkIiwiaGFzaCIsInZlcmlmeVBhc3N3b3JkIiwiY29tcGFyZSIsImNyZWF0ZVNlc3Npb25Ub2tlbiIsInBheWxvYWQiLCJzZXRQcm90ZWN0ZWRIZWFkZXIiLCJhbGciLCJzZXRJc3N1ZWRBdCIsInNldEV4cGlyYXRpb25UaW1lIiwic2lnbiIsInZlcmlmeVNlc3Npb25Ub2tlbiIsInRva2VuIiwic2V0U2Vzc2lvbkNvb2tpZSIsInNldCIsImh0dHBPbmx5Iiwic2VjdXJlIiwic2FtZVNpdGUiLCJwYXRoIiwibWF4QWdlIiwiY2xlYXJTZXNzaW9uQ29va2llIiwiZ2V0U2Vzc2lvbiIsImdldCIsInZhbHVlIiwiU0VTU0lPTl9DT09LSUVfTkFNRSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\n// Prevent multiple PrismaClient instances in dev (Next.js hot reload)\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE4QztBQUU5QyxzRUFBc0U7QUFDdEUsTUFBTUMsa0JBQWtCQztBQUVqQixNQUFNQyxTQUFTRixnQkFBZ0JFLE1BQU0sSUFBSSxJQUFJSCx3REFBWUEsR0FBRztBQUVuRSxJQUFJSSxJQUF5QixFQUFjSCxnQkFBZ0JFLE1BQU0sR0FBR0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9ib29rbmVzdC8uL2xpYi9wcmlzbWEudHM/OTgyMiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tICdAcHJpc21hL2NsaWVudCc7XG5cbi8vIFByZXZlbnQgbXVsdGlwbGUgUHJpc21hQ2xpZW50IGluc3RhbmNlcyBpbiBkZXYgKE5leHQuanMgaG90IHJlbG9hZClcbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbFRoaXMgYXMgdW5rbm93biBhcyB7IHByaXNtYTogUHJpc21hQ2xpZW50IHwgdW5kZWZpbmVkIH07XG5cbmV4cG9ydCBjb25zdCBwcmlzbWEgPSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID8/IG5ldyBQcmlzbWFDbGllbnQoKTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPSBwcmlzbWE7XG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwiZ2xvYmFsRm9yUHJpc21hIiwiZ2xvYmFsVGhpcyIsInByaXNtYSIsInByb2Nlc3MiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/bcryptjs","vendor-chunks/jose"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Freading-progress%2F%5BbookId%5D%2Froute&page=%2Fapi%2Freading-progress%2F%5BbookId%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Freading-progress%2F%5BbookId%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cmirza%5CDownloads%5Cbooknest-fixed%5Cbooknest%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cmirza%5CDownloads%5Cbooknest-fixed%5Cbooknest&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();