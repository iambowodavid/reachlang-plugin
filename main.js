define(function(require, exports, module) {

    const DocumentManager = brackets.getModule("document/DocumentManager"),

    InMemoryFile = brackets.getModule("document/InMemoryFile"),

    CommandManager = brackets.getModule("command/CommandManager"),

    LiveDev = brackets.getModule("LiveDevelopment/MultiBrowserImpl/launchers/Launcher"),

    Menus = brackets.getModule("command/Menus"),

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

    function handleReachPluginExecute() {
        
        log("Clicked reach execute!");

        if(!panel.isVisible()) 
        {
            panel.show();
        }

        let currentDoc = DocumentManager.getCurrentDocument();

        if(currentDoc == null){
            Dialogs.showModalDialog(
                DefaultDialogs.DIALOG_ID_ERROR, 
                "Please open a reach file in the editor!"
            );
        } else if(currentDoc.file instanceof InMemoryFile){
            Dialogs.showModalDialog(
                DefaultDialogs.DIALOG_ID_ERROR, 
                "Please save the reach file before execution!"
            );
        }
        else{
            passToReachCompiler(currentDoc.file);
        }

        // if(panel.isVisible()) 
        // {
        //     //panel.hide();
        //     CommandManager.get(REACH_EXECUTE_BTN)//.setChecked(false);
        // } else 
        // {
        //     panel.show();
        //     CommandManager.get(REACH_EXECUTE_BTN).setChecked(true);
        // }
    }

    AppInit.appReady(function () {

        //ExtensionUtils.loadStyleSheet(module, "sheet.css");

        CommandManager.register("Run Reach Compiler", REACH_EXECUTE_BTN, handleReachPluginExecute);

        var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);

        menu.addMenuItem(REACH_EXECUTE_BTN);

        let panelMarkup = "<h4 style='color: navy;' id='topboy'>Loaded Reach Plugin....</h4>";//require("text!panel.html");

        panel = WorkspaceManager.createBottomPanel(REACH_EXECUTE_BTN, $(panelMarkup), 10);
    });
});