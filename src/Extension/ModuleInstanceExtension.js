/**
 * @class
 * @constructor
 */
Subclass.Parser.Extension.ModuleInstanceExtension = function()
{
    function ModuleInstanceExtension()
    {
        ModuleInstanceExtension.$parent.apply(this, arguments);
    }

    ModuleInstanceExtension.$parent = Subclass.Extension;

    /**
     * @inheritDoc
     *
     * @param {Subclass.ModuleInstance} moduleInstance
     */
    ModuleInstanceExtension.initialize = function(moduleInstance)
    {
        ModuleInstanceExtension.$parent.initialize.apply(this, arguments);

        moduleInstance.getEvent('onInitialize').addListener(function() {

            /**
             * Instance of string parser
             *
             * @type {Subclass.Parser.ParserManager}
             */
            this._parser = Subclass.Tools.createClassInstance(Subclass.Parser.ParserManager, this);
        });
    };

    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var ModuleInstance = Subclass.ModuleInstance;

    /**
     * Returns string parser instance
     *
     * @returns {Subclass.Parser.ParserManager}
     */
    ModuleInstance.prototype.getParser = function()
    {
        return this._parser;
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        ModuleInstance = Subclass.Tools.buildClassConstructor(ModuleInstance);

        if (!ModuleInstance.hasExtension(ModuleInstanceExtension)) {
            ModuleInstance.registerExtension(ModuleInstanceExtension);
        }
    });

    return ModuleInstanceExtension;
}();