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