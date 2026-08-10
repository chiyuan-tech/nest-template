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
exports.id = "app/api/fonts/route";
exports.ids = ["app/api/fonts/route"];
exports.modules = {

/***/ "(rsc)/./app/api/fonts/route.ts":
/*!********************************!*\
  !*** ./app/api/fonts/route.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var node_fs_promises__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! node:fs/promises */ \"node:fs/promises\");\n/* harmony import */ var node_fs_promises__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(node_fs_promises__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! node:path */ \"node:path\");\n/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(node_path__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\n\n\nconst SUPPORTED_EXTENSIONS = new Set([\n    \".ttf\",\n    \".otf\",\n    \".woff\",\n    \".woff2\"\n]);\nfunction toFamilyName(fileName) {\n    return `cy-font-${fileName.replace(/[^a-zA-Z0-9]+/g, \"-\").toLowerCase()}`;\n}\nasync function GET() {\n    try {\n        const fontDir = node_path__WEBPACK_IMPORTED_MODULE_1___default().join(process.cwd(), \"public\", \"font\");\n        const entries = await (0,node_fs_promises__WEBPACK_IMPORTED_MODULE_0__.readdir)(fontDir, {\n            withFileTypes: true\n        });\n        const fonts = entries.filter((entry)=>entry.isFile()).map((entry)=>entry.name).filter((name)=>SUPPORTED_EXTENSIONS.has(node_path__WEBPACK_IMPORTED_MODULE_1___default().extname(name).toLowerCase())).sort((a, b)=>a.localeCompare(b)).map((name)=>({\n                packageName: name,\n                file: `/font/${name}`,\n                family: toFamilyName(name)\n            }));\n        return next_server__WEBPACK_IMPORTED_MODULE_2__.NextResponse.json({\n            fonts\n        });\n    } catch  {\n        return next_server__WEBPACK_IMPORTED_MODULE_2__.NextResponse.json({\n            fonts: []\n        }, {\n            status: 200\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2ZvbnRzL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUEyQztBQUNkO0FBQ2M7QUFFM0MsTUFBTUcsdUJBQXVCLElBQUlDLElBQUk7SUFBQztJQUFRO0lBQVE7SUFBUztDQUFTO0FBRXhFLFNBQVNDLGFBQWFDLFFBQWdCO0lBQ3BDLE9BQU8sQ0FBQyxRQUFRLEVBQUVBLFNBQVNDLE9BQU8sQ0FBQyxrQkFBa0IsS0FBS0MsV0FBVyxJQUFJO0FBQzNFO0FBRU8sZUFBZUM7SUFDcEIsSUFBSTtRQUNGLE1BQU1DLFVBQVVULHFEQUFTLENBQUNXLFFBQVFDLEdBQUcsSUFBSSxVQUFVO1FBQ25ELE1BQU1DLFVBQVUsTUFBTWQseURBQU9BLENBQUNVLFNBQVM7WUFBRUssZUFBZTtRQUFLO1FBRTdELE1BQU1DLFFBQVFGLFFBQ1hHLE1BQU0sQ0FBQyxDQUFDQyxRQUFVQSxNQUFNQyxNQUFNLElBQzlCQyxHQUFHLENBQUMsQ0FBQ0YsUUFBVUEsTUFBTUcsSUFBSSxFQUN6QkosTUFBTSxDQUFDLENBQUNJLE9BQVNsQixxQkFBcUJtQixHQUFHLENBQUNyQix3REFBWSxDQUFDb0IsTUFBTWIsV0FBVyxLQUN4RWdCLElBQUksQ0FBQyxDQUFDQyxHQUFHQyxJQUFNRCxFQUFFRSxhQUFhLENBQUNELElBQy9CTixHQUFHLENBQUMsQ0FBQ0MsT0FBVTtnQkFDZE8sYUFBYVA7Z0JBQ2JRLE1BQU0sQ0FBQyxNQUFNLEVBQUVSLE1BQU07Z0JBQ3JCUyxRQUFRekIsYUFBYWdCO1lBQ3ZCO1FBRUYsT0FBT25CLHFEQUFZQSxDQUFDNkIsSUFBSSxDQUFDO1lBQUVmO1FBQU07SUFDbkMsRUFBRSxPQUFNO1FBQ04sT0FBT2QscURBQVlBLENBQUM2QixJQUFJLENBQUM7WUFBRWYsT0FBTyxFQUFFO1FBQUMsR0FBRztZQUFFZ0IsUUFBUTtRQUFJO0lBQ3hEO0FBQ0YiLCJzb3VyY2VzIjpbIkQ6XFzpobnnm65cXOaxoOa6kFxc5qih5p2/XFxuZXN0LXRlbXBsYXRlXFxhcHBcXGFwaVxcZm9udHNcXHJvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlYWRkaXIgfSBmcm9tIFwibm9kZTpmcy9wcm9taXNlc1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwibm9kZTpwYXRoXCI7XHJcbmltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gXCJuZXh0L3NlcnZlclwiO1xyXG5cclxuY29uc3QgU1VQUE9SVEVEX0VYVEVOU0lPTlMgPSBuZXcgU2V0KFtcIi50dGZcIiwgXCIub3RmXCIsIFwiLndvZmZcIiwgXCIud29mZjJcIl0pO1xyXG5cclxuZnVuY3Rpb24gdG9GYW1pbHlOYW1lKGZpbGVOYW1lOiBzdHJpbmcpIHtcclxuICByZXR1cm4gYGN5LWZvbnQtJHtmaWxlTmFtZS5yZXBsYWNlKC9bXmEtekEtWjAtOV0rL2csIFwiLVwiKS50b0xvd2VyQ2FzZSgpfWA7XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGZvbnREaXIgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgXCJwdWJsaWNcIiwgXCJmb250XCIpO1xyXG4gICAgY29uc3QgZW50cmllcyA9IGF3YWl0IHJlYWRkaXIoZm9udERpciwgeyB3aXRoRmlsZVR5cGVzOiB0cnVlIH0pO1xyXG5cclxuICAgIGNvbnN0IGZvbnRzID0gZW50cmllc1xyXG4gICAgICAuZmlsdGVyKChlbnRyeSkgPT4gZW50cnkuaXNGaWxlKCkpXHJcbiAgICAgIC5tYXAoKGVudHJ5KSA9PiBlbnRyeS5uYW1lKVxyXG4gICAgICAuZmlsdGVyKChuYW1lKSA9PiBTVVBQT1JURURfRVhURU5TSU9OUy5oYXMocGF0aC5leHRuYW1lKG5hbWUpLnRvTG93ZXJDYXNlKCkpKVxyXG4gICAgICAuc29ydCgoYSwgYikgPT4gYS5sb2NhbGVDb21wYXJlKGIpKVxyXG4gICAgICAubWFwKChuYW1lKSA9PiAoe1xyXG4gICAgICAgIHBhY2thZ2VOYW1lOiBuYW1lLFxyXG4gICAgICAgIGZpbGU6IGAvZm9udC8ke25hbWV9YCxcclxuICAgICAgICBmYW1pbHk6IHRvRmFtaWx5TmFtZShuYW1lKSxcclxuICAgICAgfSkpO1xyXG5cclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGZvbnRzIH0pO1xyXG4gIH0gY2F0Y2gge1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZm9udHM6IFtdIH0sIHsgc3RhdHVzOiAyMDAgfSk7XHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJyZWFkZGlyIiwicGF0aCIsIk5leHRSZXNwb25zZSIsIlNVUFBPUlRFRF9FWFRFTlNJT05TIiwiU2V0IiwidG9GYW1pbHlOYW1lIiwiZmlsZU5hbWUiLCJyZXBsYWNlIiwidG9Mb3dlckNhc2UiLCJHRVQiLCJmb250RGlyIiwiam9pbiIsInByb2Nlc3MiLCJjd2QiLCJlbnRyaWVzIiwid2l0aEZpbGVUeXBlcyIsImZvbnRzIiwiZmlsdGVyIiwiZW50cnkiLCJpc0ZpbGUiLCJtYXAiLCJuYW1lIiwiaGFzIiwiZXh0bmFtZSIsInNvcnQiLCJhIiwiYiIsImxvY2FsZUNvbXBhcmUiLCJwYWNrYWdlTmFtZSIsImZpbGUiLCJmYW1pbHkiLCJqc29uIiwic3RhdHVzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/fonts/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ffonts%2Froute&page=%2Fapi%2Ffonts%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ffonts%2Froute.ts&appDir=D%3A%5C%E9%A1%B9%E7%9B%AE%5C%E6%B1%A0%E6%BA%90%5C%E6%A8%A1%E6%9D%BF%5Cnest-template%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5C%E9%A1%B9%E7%9B%AE%5C%E6%B1%A0%E6%BA%90%5C%E6%A8%A1%E6%9D%BF%5Cnest-template&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ffonts%2Froute&page=%2Fapi%2Ffonts%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ffonts%2Froute.ts&appDir=D%3A%5C%E9%A1%B9%E7%9B%AE%5C%E6%B1%A0%E6%BA%90%5C%E6%A8%A1%E6%9D%BF%5Cnest-template%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5C%E9%A1%B9%E7%9B%AE%5C%E6%B1%A0%E6%BA%90%5C%E6%A8%A1%E6%9D%BF%5Cnest-template&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_nest_template_app_api_fonts_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/fonts/route.ts */ \"(rsc)/./app/api/fonts/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/fonts/route\",\n        pathname: \"/api/fonts\",\n        filename: \"route\",\n        bundlePath: \"app/api/fonts/route\"\n    },\n    resolvedPagePath: \"D:\\\\项目\\\\池源\\\\模板\\\\nest-template\\\\app\\\\api\\\\fonts\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_nest_template_app_api_fonts_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZmb250cyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGZm9udHMlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZmb250cyUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDJUU5JUExJUI5JUU3JTlCJUFFJTVDJUU2JUIxJUEwJUU2JUJBJTkwJTVDJUU2JUE4JUExJUU2JTlEJUJGJTVDbmVzdC10ZW1wbGF0ZSU1Q2FwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9RCUzQSU1QyVFOSVBMSVCOSVFNyU5QiVBRSU1QyVFNiVCMSVBMCVFNiVCQSU5MCU1QyVFNiVBOCVBMSVFNiU5RCVCRiU1Q25lc3QtdGVtcGxhdGUmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ1E7QUFDckY7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkQ6XFxcXOmhueebrlxcXFzmsaDmupBcXFxc5qih5p2/XFxcXG5lc3QtdGVtcGxhdGVcXFxcYXBwXFxcXGFwaVxcXFxmb250c1xcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvZm9udHMvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9mb250c1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvZm9udHMvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJEOlxcXFzpobnnm65cXFxc5rGg5rqQXFxcXOaooeadv1xcXFxuZXN0LXRlbXBsYXRlXFxcXGFwcFxcXFxhcGlcXFxcZm9udHNcXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ffonts%2Froute&page=%2Fapi%2Ffonts%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ffonts%2Froute.ts&appDir=D%3A%5C%E9%A1%B9%E7%9B%AE%5C%E6%B1%A0%E6%BA%90%5C%E6%A8%A1%E6%9D%BF%5Cnest-template%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5C%E9%A1%B9%E7%9B%AE%5C%E6%B1%A0%E6%BA%90%5C%E6%A8%A1%E6%9D%BF%5Cnest-template&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "node:fs/promises":
/*!***********************************!*\
  !*** external "node:fs/promises" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:fs/promises");

/***/ }),

/***/ "node:path":
/*!****************************!*\
  !*** external "node:path" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node:path");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ffonts%2Froute&page=%2Fapi%2Ffonts%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ffonts%2Froute.ts&appDir=D%3A%5C%E9%A1%B9%E7%9B%AE%5C%E6%B1%A0%E6%BA%90%5C%E6%A8%A1%E6%9D%BF%5Cnest-template%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5C%E9%A1%B9%E7%9B%AE%5C%E6%B1%A0%E6%BA%90%5C%E6%A8%A1%E6%9D%BF%5Cnest-template&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();