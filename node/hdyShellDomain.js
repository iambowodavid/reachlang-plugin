(function() {
    "use strict";

    var _domainManager;``

    function _execute(cmdFile, panel) {

        var spawn = require("child_process").spawn;

        var process = require('child_process');

        process.exec('reach "'+cmdFile+'"',function (err,stdout,stderr) {
            if (err) {
                console.log("\r\n"+stderr);
                _domainManager.emitEvent("hdyShellDomain", "stderr", stderr);
            } else {
                console.log("\r\n"+stdout);
                _domainManager.emitEvent("hdyShellDomain", "stdout", stdout);
            }
        });
    }

    /**
    * Initializes the test domain with several test commands.
    * @param {DomainManager} domainManager The DomainManager for the server
    */
    function _init(domainManager) {

        if (!domainManager.hasDomain("hdyShellDomain")) {
            domainManager.registerDomain("hdyShellDomain", {major: 0, minor: 12});
        }

        domainManager.registerCommand(
            "hdyShellDomain", // domain name
            "execute", // command name
            _execute, // command handler function
            true, // isAsync
            "Execute the given command and return the results to the UI",
            [{
                name: "file",
                type: "string",
                description: "The arg for command to be executed with"
            },
            {
                name: "panel",
                //type: "string",
                description: "Panel for cmd panel"
            }]
        );

        domainManager.registerEvent("hdyShellDomain",
                                    "stdout",
                                    [{name: "data", type: "string"}]);

        domainManager.registerEvent("hdyShellDomain",
                                    "stderr",
                                    [{name: "err", type: "string"}]);

        _domainManager = domainManager;
    }

    exports.init = _init;

}());
