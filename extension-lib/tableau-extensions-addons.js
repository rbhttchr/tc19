{
    const LOAD_MODULE_REQUEST_MESSAGE = 'LoadModule-Request';
    const LOAD_MODULE_RESPONSE_MESSAGE = 'LoadModule-Response';

    tableau.extensions.initalizeAddonsAsync = function (extension_list) {
        return new Promise(function (resolve, reject) {
            
            // We can load multiple addons, separated by coma
            var extensions = extension_list.split(/\s*,\s*/);
            extensions.forEach(function (extension) {
                window.addEventListener('message', function (event) {
                    if (event.data && event.data.event_id === LOAD_MODULE_RESPONSE_MESSAGE) {
                        extensions.splice(extensions.indexOf(event.data.data),1);
                        if (extensions.length == 0 ) {
                            resolve(extension);
                        }
                    }
                });

                // load our addons external js file
                var script = document.createElement('script');
                script.src = "tableau-extensions-" + extension + "-client.js";
                script.onload = function () {
                    // notify vizql frame that we need that addon on server side too
                    window.parent.postMessage(
                        {
                            event_id: LOAD_MODULE_REQUEST_MESSAGE,
                            data: extension
                        }, "*");
                };
                document.head.appendChild(script);

            });
        })
    }
}