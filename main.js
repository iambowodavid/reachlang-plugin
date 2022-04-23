define(function(require, exports, module) {

    const DocumentManager = brackets.getModule("document/DocumentManager"),

    CodeHintManager = brackets.getModule("editor/CodeHintManager"),

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


    //register reach hint manager
    function RSHCompletion() {
        this.insertHintOnTab = true;
        this.editor;
        this.hints = [
            "Participant",
            "Participant.publish(Variables)",
            "PaymentRequestUpdateEvent",
            "PaymentAddress",
            "Reach.App(() => {});",
            "unknowable(toWho, _obj);",
            "assert(condition);",
            "while",
            "commit();",
            "deploy();",
            "export ",
            "const ",
            "want",
            "request",
            "info",
            "Bytes(num)",
            "UInt",
            "Null",
            "declassify",
            "interact",
            "init",
        ];
    }
    
    RSHCompletion.prototype.hasHints = function (editor, implicitChar) {

        // Document is not able to be edited
        if (!editor.document.editable) {
            return false
        }
    
        this.editor = editor;

        // Get needle information
        //let lastChar = implicitChar
        let cursor = editor.getCursorPos()
        let curCharPos = cursor.ch
        let curLinePos = cursor.line
        let lineStr = editor._codeMirror.getLine(curLinePos)
        //let textBeforeCursor = editor.document.getRange({line:curLinePos,ch:0}, cursor).trim()
        //let totalLines = editor._codeMirror.doc.size
        
        let whatIsIt = lineStr.substr(0, curCharPos).replace(/.+(\s|\(|\,|\.)/, '').trim();
        //console.log(whatIsIt);
        let hintExists = false;
        //console.log(this.hints);
        this.hints.forEach(hint => {
            if(whatIsIt !== "" && hint.startsWith(whatIsIt)){
                hintExists = true;
                return false;
            }
        });
        
        return hintExists;
    }
    
    RSHCompletion.prototype.getHints = function (implicitChar) {
        let cursor = this.editor.getCursorPos()
        let curCharPos = cursor.ch
        let curLinePos = cursor.line
        let lineStr = this.editor._codeMirror.getLine(curLinePos)
        let whatIsIt = lineStr.substr(0, curCharPos).replace(/.+(\s|\(|\,|\.)/, '').trim();
        
        let results = this.hints.filter(item => item.startsWith(whatIsIt));
        
        return {
            hints: results,
            //match: "reach",
            selectInitial: true,
            handleWideResults: true
        }
    }

    RSHCompletion.prototype.insertHint = function(hint) {
          if (undefined === this.editor) {
                return 0;
          }
          
          let cursor = this.editor.getCursorPos()
          let curCharPos = cursor.ch;
          let curLinePos = cursor.line;
          let lineStr = this.editor._codeMirror.getLine(curLinePos);
          let textBeforeCursor = this.editor.document.getRange({line:curLinePos,ch:0}, cursor);
          
          let whatIsIt = lineStr.substr(0, curCharPos).replace(/.+(\s|\(|\,|\.)/, '').trim();
          
          let insertIndex = cursor.ch
      
          if (hint !== '') {
            insertIndex = textBeforeCursor.lastIndexOf(whatIsIt);
          }
    
        // var hinttext = String($this.whatIsIt + hint.data('content'))
    
        // Replace in editor with hint content
        this.editor.document.replaceRange(
          hint,
          { line: cursor.line, ch: insertIndex },
          cursor
        );

        return false;
    }

    AppInit.appReady(function () {

        var rshCompletion = new RSHCompletion();

        // register the hint provider. Priority = 10 for js and rsh files
        CodeHintManager.registerHintProvider(rshCompletion, ["all"], 10);
    });


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