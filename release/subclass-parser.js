/**
 * SubclassParser - v0.1.0 - 2015-10-07
 * https://github.com/msdoom2011/subclass-parser
 *
 * Copyright (c) 2015 Dmitry Osipishin | msdoom2011@gmail.com
 */
(function() {
"use strict";

/**
 * @namespace
 */
Subclass.Parser = {};

/**
 * @namespace
 */
Subclass.Parser.Extension = {};

/**
 * @class
 * @constructor
 */
Subclass.Parser.ParserManager = function()
{
    function ParserManager(moduleInstance)
    {
        if (!moduleInstance || !(moduleInstance instanceof Subclass.ModuleInstance)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the instance of module', false)
                .expected('an instance of class "Subclass.ModuleInstance"')
                .received(moduleInstance)
                .apply()
            ;
        }

        /**
         * @type {Subclass.ModuleInstance}
         * @private
         */
        this._moduleInstance = moduleInstance;

        /**
         * @type {Subclass.Module}
         * @private
         */
        this._module = moduleInstance.getModule();

        /**
         * @type {Object.<Subclass.Parser.ParserAbstract>}
         * @private
         */
        this._parsers = {};

        for (var parserName in _parsers) {
            if (_parsers.hasOwnProperty(parserName)) {
                this._parsers[parserName] = Subclass.Tools.createClassInstance(
                    _parsers[parserName],
                    this
                );
                if (!(this._parsers[parserName] instanceof Subclass.Parser.ParserAbstract)) {
                    Subclass.Error.create(
                        'Registered invalid parser. ' +
                        'It should be instance of class "Subclass.Parser.ParserAbstract".'
                    )
                }
            }
        }
    }

    var _parsers = [];

    /**
     * Registers new parser constructor
     *
     * @param {Function} parserConstructor
     */
    ParserManager.registerParser = function(parserConstructor)
    {
        if (typeof parserConstructor != 'function' || !parserConstructor.getName) {
            Subclass.Error.create(
                'Trying to register invalid parser. ' +
                'It should be instance of class "Subclass.Parser.ParserAbstract".'
            );
        }
        _parsers[parserConstructor.getName()] = parserConstructor;
    };

    /**
     * Returns parser constructor by its name
     *
     * @param {string} parserName
     * @returns {*}
     */
    ParserManager.getParser = function(parserName)
    {
        if (!this.issetParser(parserName)) {
            Subclass.Error.create(
                'Trying to get non registered parser constructor ' +
                'named "' + parserName + '"'
            );
        }
        return _parsers[parserName];
    };

    /**
     * Checks whether parser constructor with specified name was registered
     *
     * @param {string} parserName
     * @returns {boolean}
     */
    ParserManager.issetParser = function(parserName)
    {
        return _parsers.hasOwnProperty(parserName);
    };

    ParserManager.prototype = {

        /**
         * Returns module instance
         *
         * @returns {Subclass.ModuleInstance}
         */
        getModuleInstance: function()
        {
           return this._moduleInstance;
        },

        /**
         * Returns module definition instance
         *
         * @returns {Subclass.Module}
         */
        getModule: function()
        {
            return this._module;
        },

        /**
         * Returns parser instance by its name
         *
         * @param {string} parserName
         * @returns {Subclass.Parser.ParserAbstract}
         */
        get: function(parserName)
        {
            if (!this.isset(parserName)) {
                Subclass.Error.create(
                    'Trying to get non registered parser ' +
                    'named "' + parserName + '"'
                );
            }
            return this._parsers[parserName];
        },

        /**
         * Checks whether parser width specified name exists
         *
         * @param {string} parserName
         * @returns {boolean}
         */
        isset: function(parserName)
        {
            return this._parsers.hasOwnProperty(parserName);
        },

        /**
         * Removes parser from parser manager by its name
         *
         * @param {string} parserName
         */
        remove: function(parserName)
        {
            delete this._parsers[parserName];
        },

        /**
         * Parses string value
         *
         * @param {string} string
         * @returns {*}
         */
        parse: function(string)
        {
            var parsers = this._parsers;

            for (var parserName in parsers) {
                if (parsers.hasOwnProperty(parserName)) {
                    string = parsers[parserName].parse(string);
                }
            }

            return string;
        }
    };

    return ParserManager;
}();

// Source file: Extension/ModuleInstanceExtension.js

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

// Source file: ParserAbstract.js

Subclass.Parser.ParserAbstract = function()
{
    function ParserAbstract(parserManager)
    {
        if (!parserManager || !(parserManager instanceof Subclass.Parser.ParserManager)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the parser manager instance', false)
                .expected('an instance of class "Subclass.Parser.ParserManager"')
                .received(parserManager)
                .apply()
            ;
        }
        this._parserManager = parserManager;
    }

    /**
     * Returns name of string parser
     *
     * @returns {string}
     * @abstract
     */
    ParserAbstract.getName = function()
    {
        Subclass.Error.create('NotImplementedMethod')
            .className("Subclass.Parser.ParserAbstract")
            .method('getName', true)
            .apply()
        ;
    };

    ParserAbstract.prototype = {

        /**
         * Returns instance of parser manager
         *
         * @returns {Subclass.Parser.ParserManager}
         */
        getParserManager: function()
        {
            return this._parserManager;
        },

        /**
         * Returns subclass module instance
         *
         * @returns {Subclass.Module}
         */
        getModule: function()
        {
            return this.getParserManager().getModule();
        },

        /**
         * Normalizes string
         *
         * @param string
         */
        parse: function(string)
        {
            Subclass.Error.create('NotImplementedMethod')
                .className("Subclass.Parser.ParserAbstract")
                .method('parse')
                .apply()
            ;
        }
    };

    return ParserAbstract;
}();

// Source file: Subclass.js

/**
 * Registers the new SubclassJS plug-in
 */
Subclass.registerPlugin(function() {

    function ParserPlugin()
    {
        ParserPlugin.$parent.call(this);
    }

    ParserPlugin.$parent = Subclass.SubclassPlugin;

    /**
     * @inheritDoc
     */
    ParserPlugin.getName = function()
    {
        return "SubclassParser";
    };

    /**
     * @inheritDoc
     */
    ParserPlugin.getDependencies = function()
    {
        return ['SubclassInstance'];
    };

    return ParserPlugin;
}());
})();