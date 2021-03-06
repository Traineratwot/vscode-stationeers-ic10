"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ic10Vscode = void 0;
const vscode = require("vscode");
const main_1 = require("ic10/main");
class Ic10Vscode {
    langPath;
    LOCALE_KEY;
    constructor() {
        this.langPath = {};
        this.LOCALE_KEY = vscode.env.language.trim();
        try {
            var langPath = require(`../languages/${this.LOCALE_KEY}.json`);
            if (langPath instanceof Object) {
                this.langPath = langPath;
            }
            else {
                var langPath = require(`../languages/en.json`);
                this.langPath = langPath;
            }
        }
        catch (e) {
        }
    }
    getHover(name = '') {
        if (this.langPath.hasOwnProperty(name)) {
            var data = this.langPath[name];
            var type = data?.type;
            var op1 = data?.op1;
            var op2 = data?.op2;
            var op3 = data?.op3;
            var op4 = data?.op4;
            var preview = data?.description?.preview;
            if (preview) {
                preview = '*' + preview + '*';
            }
            var description = data.description.text;
            if (this.LOCALE_KEY == 'ru') {
                description += `
				
----

[wiki](https://stationeers.fandom.com/ru/wiki/Программирование_микропроцессора)
        `;
            }
            var heading = `**${name} [_${type}_]** `;
            if (op1) {
                heading += `op1:[${op1}] `;
            }
            if (op2) {
                heading += `op2:[${op2}] `;
            }
            if (op3) {
                heading += `op3:[${op3}] `;
            }
            if (op4) {
                heading += `op4:[${op4}] `;
            }
            return `
${heading}

----
${preview}

${description}
	    	`;
        }
        else {
            return null;
        }
    }
    baseName(str) {
        var base = new String(str).split('/');
        return base.unshift();
    }
    htmlLog(e = null) {
        var html = [];
        if (e instanceof main_1.ic10Error) {
            var string = `[${this.var2str(e.functionName, 1)}:${this.var2str(e.line, 1)}] (${this.var2str(e.code, 1)}) - ${this.var2str(e.message, 1)}:`;
            html.push(string);
        }
        else {
            for (const argumentsKey in arguments) {
                if (arguments.hasOwnProperty(argumentsKey)) {
                    var value = arguments[argumentsKey];
                    html.push(this.var2str(value));
                }
            }
        }
        return html.join("\r\n");
    }
    var2str(value, mode = 0) {
        switch (typeof value) {
            case 'string':
            case 'number':
                if (isNaN(value)) {
                    if (!mode) {
                        value = `<span style="color:var(--vscode-symbolIcon-stringForeground)">${value}</span>`;
                    }
                    else {
                        value = `<span style="color:var(--vscode-debugTokenExpression-string)">${value}</span>`;
                    }
                }
                else {
                    if (!mode) {
                        value = `<span style="color:var(--vscode-symbolIcon-numberForeground)">${value}</span>`;
                    }
                    else {
                        value = `<span style="color:var(--vscode-debugTokenExpression-number)">${value}</span>`;
                    }
                }
                break;
            case 'boolean':
                if (!mode) {
                    value = `<span style="color:var(--vscode-symbolIcon-booleanForeground)">${Number(value)}</span>`;
                }
                else {
                    value = `<span style="color:var(--vscode-debugTokenExpression-boolean)">${Number(value)}</span>`;
                }
                break;
            case "object":
                value = JSON.stringify(value);
                if (value instanceof Array) {
                    if (!mode) {
                        value = `<span style="color:var(--vscode-symbolIcon-arrayForeground)">${value}</span>`;
                    }
                    else {
                        value = `<span style="color:var(--vscode-debugTokenExpression-array)">${value}</span>`;
                    }
                }
                else {
                    if (!mode) {
                        value = `<span style="color:var(--vscode-symbolIcon-objectForeground)">${value}</span>`;
                    }
                    else {
                        value = `<span style="color:var(--vscode-debugTokenExpression-object)">${value}</span>`;
                    }
                }
                break;
        }
        return value;
    }
}
exports.Ic10Vscode = Ic10Vscode;
//# sourceMappingURL=ic10-vscode.js.map