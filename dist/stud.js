/**
 * Created by steve on 7/21/16.
 */
;
(function (base, exports) {

    const RE = /([^{]*)?(\{(\w+)\})?([^{]*)?/ig;

    var isString = function (o) {
            return typeof o === 'string';
        },
        stringbuilder = function (initialString) {
            var content = [];
            (initialString && content.push(initialString));

            return {
                append: function (text) {
                    content.push(text);
                    this.length = content.length;
                    return this;
                },
                length: content.length,
                toString: function () {
                    return content.join('');
                }
            };

        },
        renderString = function (templateString, options, cb) {
            var sb = stringbuilder();

            templateString = templateString.trim().replace(/"/g, "'");
            templateString = templateString.replace(/[\n\r]/g, ' ');
            templateString = templateString.replace(/\s+/g, ' ');

            templateString.replace(
                RE,
                function ($0, $1, $2, $3, $4) {
                    if ($1) {
                        sb.append($1);
                    }
                    if ($3) {
                        sb.append(options[$3]);
                    }

                    if ($4) {
                        sb.append($4);
                    }

                    return;
                }
            );
            cb && cb(false, sb.toString());
        };


    exports.cache = {};
    exports.buffer = function (startString) {

        return stringbuilder(startString);
    };
    exports.render = function (name, data, cb) {
        var str = this.cache[name](data);
        if (cb) cb(str);
        else return str;
    };
    exports.isRegistered = function (name) {
        return !!this.cache[name];
    };
    exports.register = function (name, fn) {
        if (!name || !fn || !(typeof fn === 'function')) {
            console.error("Cannot register template...");
            return;
        }
        this.cache[name] = fn;
    };

    exports.compile = function (tmplString, tmplName, cb) {

        var compileNow = function (template, name) {

            var sb = require('strbuilder')();
            template.replace(
                RE,
                function ($0, $1, $2, $3, $4) {
                    if ($1) {
                        if (sb.length) sb.append(".append(\"" + $1 + "\")");
                        else sb.append("b.append(\"" + $1 + "\")");
                    }
                    if ($3) {
                        if (sb.length) sb.append(".append(x['" + $3 + "'])");
                        else sb.append("b.append(x['" + $3 + "'])");
                    }

                    if ($4) {
                        if (sb.length) sb.append(".append(\"" + $4 + "\")");
                        else sb.append("b.append(\"" + $4 + "\")");
                    }

                    return;
                }
            );
            return "(function(c){var b = c.buffer();c.register(\"" + name + "\",function(x){" + sb.toString() + "; return b.toString();});}(stud));";
        };

        if (isString(tmplString) && isString(tmplName)) {

            tmplString = tmplString.trim().replace(/"/g, "'");
            tmplString = tmplString.replace(/[\n\r]/g, ' ');
            tmplString = tmplString.replace(/\s+/g, ' ');

            if (cb) {
                cb(compileNow(tmplString, tmplName));
            } else return compileNow(tmplString, tmplName);
        }

    };
    exports.template = function (templateString, options, cb) {

        renderString(templateString, options, cb);

    };
    exports.__express = function (filePath, options, cb) { // define the template engine

        require('fs').readFile(filePath, function (err, template) {

            if (err) return cb(new Error(err));

            template = template.toString();
            renderString(template, options, cb);
        });
    };


})(this, (typeof exports === "undefined" ? this['stud'] : exports));