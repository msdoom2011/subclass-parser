///**
// * @class
// * @constructor
// */
//Subclass.Parser.Extension.ModuleExtension = function() {
//
//    function ModuleExtension(module)
//    {
//        ModuleExtension.$parent.apply(this, arguments);
//    }
//
//    ModuleExtension.$parent = Subclass.Extension;
//
//    /**
//     * @inheritDoc
//     */
//    ModuleExtension.initialize = function(module)
//    {
//        this.$parent.initialize.apply(this, arguments);
//
//        module.getEventManager().getEvent('onInitializeBefore', function() {
//
//            /**
//             * Instance of string parser
//             *
//             * @type {Subclass.Parser.ParserManager}
//             * @private
//             */
//            this._parserManager = Subclass.Tools.createClassInstance(Subclass.Parser.ParserManager, this);
//        });
//    };
//
//
//    //=========================================================================
//    //========================== ADDING NEW METHODS ===========================
//    //=========================================================================
//
//    var Module = Subclass.Module;
//
//    /**
//     * Returns an instance of manager which allows to parse and normalize strings which
//     * contain some pattern injections
//     *
//     * @returns {Subclass.Parser.ParserManager}
//     */
//    Module.prototype.getParserManager = function()
//    {
//        return this._parserManager;
//    };
//
//
//    //=========================================================================
//    //======================== REGISTERING EXTENSION ==========================
//    //=========================================================================
//
//    Subclass.Module.onInitializeBefore(function(evt, module)
//    {
//        Module = Subclass.Tools.buildClassConstructor(Module);
//
//        if (!Module.hasExtension(ModuleExtension)) {
//            Module.registerExtension(ModuleExtension);
//        }
//    });
//
//    return ModuleExtension;
//}();