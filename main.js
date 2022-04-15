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

    function openReachDocs(){
        LiveDev.launch("https://docs.reach.sh/");
    }

    function passToReachCompiler(file){
        
        NodeDomain = brackets.getModule("utils/NodeDomain"),

        ShellDomain = new NodeDomain(
            "hdyShellDomain",
            ExtensionUtils.getModulePath(module, "node/hdyShellDomain")
        );
        
        panel.$panel[0].innerHTML += "<br/> Running reach on " + file.fullPath;

        ShellDomain.exec("execute", file.fullPath, panel);

        $(ShellDomain).on("stderr", function(evt, data) {
            panel.$panel[0].innerHTML += "<br/> " + data;
            panel.$panel[0].style="color: red";
        });

        $(ShellDomain).on("stdout", function(evt, data) {
            panel.$panel[0].innerHTML += "<br/> " + data;
            panel.$panel[0].style="color: navy";
        });

    }

    AppInit.appReady(function () {

        //ExtensionUtils.loadStyleSheet(module, "sheet.css");

        CommandManager.register("Start Reach Compiler", REACH_EXECUTE_BTN, handleReachPluginExecute);

        CommandManager.register("Open Reach Documentation", REACH_DOC_BTN, openReachDocs);

        var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);

        menu.addMenuItem(REACH_EXECUTE_BTN);

        menu.addMenuItem(REACH_DOC_BTN);

        let panelMarkup = "<h4 style='color: navy;' id='topboy'>Loaded Reach Plugin....</h4>";//require("text!panel.html");

        panel = WorkspaceManager.createBottomPanel(REACH_EXECUTE_BTN, $(panelMarkup), 10);
    });
});