/* From:
https://github.com/THeK3nger/threejs-async-shaders-example/blob/master/js/mytest.js
 */


function ShaderLoader(vertex_url, fragment_url, onLoad, onProgress, onError) {
    let vertex_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
    vertex_loader.setResponseType('text');
    vertex_loader.load(vertex_url, function (vertex_text) {
        let fragment_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
        fragment_loader.setResponseType('text');
        fragment_loader.load(fragment_url, function (fragment_text) {
            onLoad(vertex_text, fragment_text);
        });
    }, onProgress, onError);
}