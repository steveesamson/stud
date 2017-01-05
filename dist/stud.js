/**
 * Created by steve on 7/21/16.
 */
(function (factory) {

    // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
    // We use `self` instead of `window` for `WebWorker` support.
    var root = (typeof self == 'object' && self.self === self && self) ||
        (typeof global == 'object' && global.global === global && global);


    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.stud = factory();
    }
}(function () {

    const RE = /([^{]*)?(\{(\w+)\})?([^{]*)?/ig;

    var stringbuilder = function (initialString) {
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
        },
        stud = function () {
            if (!isStud(this)) return new stud();
            this.cache = {};
        },
        isStud = function (o) {
            return o instanceof stud;
        },
        isString = function (o) {
            return typeof o === 'string';
        };
    stud.fn = stud.prototype;
    stud.fn.buffer = function (baseString) {
        return stringbuilder(baseString);
    };
    stud.fn.render = function (name, data, cb) {
        var str = this.cache[name](data);
        if (cb) cb(str);
        else return str;
    };
    stud.fn.isRegistered = function (name) {
        return !!this.cache[name];
    };
    stud.fn.register = function (name, fn) {
        if (!name || !fn || !(typeof fn === 'function')) {
            console.error("Cannot register template...");
            return;
        }
        this.cache[name] = fn;
    };

    stud.fn.compile = function (tmplString, tmplName, cb) {

        var compileNow = function (template, name) {

            var sb = stringbuilder();
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
    stud.fn.__express = function (filePath, options, cb) { // define the template engine

        require('fs').readFile(filePath, function (err, template) {

            if (err) return cb(new Error(err));

            template = template.toString();
            renderString(template, options, cb)
        });

    };

    stud.fn.template = renderString;

    return stud();
}));