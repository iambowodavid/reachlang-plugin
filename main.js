
    WorkspaceManager = brackets.getModule("view/WorkspaceManager"),
    
    ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),   

    AppInit = brackets.getModule("utils/AppInit"),

    Dialogs = brackets.getModule("widgets/Dialogs"),

    DefaultDialogs = brackets.getModule("widgets/DefaultDialogs");

    const REACH_EXECUTE_BTN = "reachworld.execute";

    const REACH_DOC_BTN = "reachworlddocumentation.execute";

    let panel;

    function log(s) {
        console.log("[ReachPlugin] "+s);
    }