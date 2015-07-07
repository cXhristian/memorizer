/*
    "When I'm not longer rapping, I want to open up an ice cream parlor and call myself Scoop Dogg."
    - Snoop Dogg

    Scoop, because what the world needs right now is yet another JavaScript templating engine

    {$ t.var } - print with escaping
    {_ t.var } - print without escaping
    {+ for var in t.vars }[..]{+} - foreach loop
*/

(function() {
    // Settings
    var s = {
        idMatch: /^[\w-]+$/,
        print: /\{\$\s*(.*?)\s*\}/g,
        printSafe: /\{\_\s*(.*?)\s*\}/g,
        forloop: /\{\+\s*for (.+?) in (.+?)\s*\}/g,
        endforloop: /\{\+\}/g
        
    };
    var cache = {};


    this.scoop = function(str, context) {
        // Caching
        if(!cache[str]) {
            cache[str] = scoop.compile(str);
        }
        fn = cache[str];
        return fn(context);
    };

    // Compile template code into HTML
    scoop.compile = function(str) {
        if(s.idMatch.test(str)) {
            return scoop.compile(document.getElementById(str));
        }
        function_code = 'var $code; with($context) { $code = \'';
        function_code += str.
        replace(
            s.print, function(match, value) {
                return '\'; $code += scoop.encode(' + value + '); $code += \'';
            }
        ).replace(
            s.printSafe, function(match, value) {
                return '\'; $code += ' + value + '; $code += \'';
            }
        ).replace(
            s.forloop, function(match, element, iterator) {
                return '\'; for(var i = 0; i < ' + iterator + '.length; i++) { ' +
                    'var ' + element + ' = ' + iterator + '[i]; $code += \'';
            }
        ).replace(
            s.endforloop, function(match) {
                return '\'; } $code += \'';
            }
        );
        function_code += '\';} return $code;';
        return new Function('$context', function_code);
    };


    // HTML encoding http://stackoverflow.com/a/15348311
    scoop.encode = function(text) {
        return document.createElement('i').appendChild( 
        document.createTextNode(text)).parentNode.innerHTML;
    };
})();
