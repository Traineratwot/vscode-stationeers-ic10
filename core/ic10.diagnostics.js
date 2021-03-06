"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ic10Diagnostics = exports.Ic10Diagnostics = exports.DiagnosticsErrors = exports.DiagnosticsError = exports.regexes = exports.Ic10DiagnosticsName = void 0;
const vscode = __importStar(require("vscode"));
exports.Ic10DiagnosticsName = 'ic10_diagnostic';
var manual = require('../languages/en.json');
var functions = require('../media/ic10.functions.json');
var keywords = require('../media/ic10.keyword.json');
exports.regexes = {
    'rr1': new RegExp("[r]{1,}(r(0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|a))$"),
    'dr1': new RegExp("[d]{1,}(r(0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|a))$"),
    'r1': new RegExp("^r(0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|a)$"),
    'd1': new RegExp("^d(0|1|2|3|4|5|b)$"),
    'rr': new RegExp(`\\br(0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|17|a)\\b`),
    'rm': new RegExp(`(#-reset-vars-)[\\s\\S]{0,}?(#-reset-vars-)`),
    'oldSpace': new RegExp("^[\\t ]+", 'gmi'),
    'strStart': new RegExp("^\".+$"),
    'strEnd': new RegExp(".+\"$"),
};
class DiagnosticsError {
    range;
    message;
    lvl;
    hash;
    constructor(message, lvl, start, length, line) {
        this.message = message;
        this.lvl = lvl;
        this.range = new vscode.Range(line, start, line, start + length);
        this.hash = this.message.replace(/\s+/, '') + line;
    }
}
exports.DiagnosticsError = DiagnosticsError;
class DiagnosticsErrors {
    values = [];
    index = [];
    push(a) {
        if (this.index.indexOf(a.hash) < 0) {
            this.index.push(a.hash);
            this.values.push(a);
        }
    }
    reset() {
        this.values = [];
        this.index = [];
    }
}
exports.DiagnosticsErrors = DiagnosticsErrors;
class Ic10Diagnostics {
    jumps;
    aliases;
    errors;
    constructor() {
        this.errors = new DiagnosticsErrors;
    }
    clear(doc, container) {
        container.set(doc.uri, []);
    }
    prepare(doc) {
        this.jumps = [];
        this.aliases = [];
        this.errors.reset();
        for (let lineIndex = 0; lineIndex < doc.lineCount; lineIndex++) {
            try {
                this.parseLine(doc, lineIndex);
            }
            catch (e) {
                console.warn(e);
            }
        }
    }
    run(doc, container) {
        const diagnostics = [];
        this.prepare(doc);
        for (const de of this.errors.values) {
            diagnostics.push(this.createDiagnostic(de.range, de.message, de.lvl));
        }
        if (doc.lineCount > 128) {
            diagnostics.push(this.createDiagnostic(new vscode.Range(128, 0, 128, 1), 'Max line', vscode.DiagnosticSeverity.Error));
        }
        container.set(doc.uri, diagnostics);
    }
    parseLine(doc, lineIndex) {
        const lineOfText = doc.lineAt(lineIndex);
        if (lineOfText.text.trim().length > 0) {
            var text = lineOfText.text.trim();
            var test = functions.some((substring) => {
                if (text.startsWith('#')) {
                    if (text.startsWith('#log')) {
                        this.errors.push(new DiagnosticsError(`Debug function: "${text}"`, 2, 0, text.length, lineIndex));
                        return true;
                    }
                    return true;
                }
                text = text.replace(/#.+$/, '');
                text = text.trim();
                if (text.endsWith(':')) {
                    this.jumps.push(text);
                    return true;
                }
                if (text.startsWith(substring)) {
                    var words = text.split(/ +/);
                    if (text.startsWith('alias')) {
                        this.aliases.push(words[1]);
                    }
                    if (text.startsWith('define')) {
                        this.aliases.push(words[1]);
                    }
                    this.analyzeFunctionInputs(words, text, lineIndex);
                    return true;
                }
                else {
                    return false;
                }
            }, this);
            this.aliases = [...new Set(this.aliases)];
            if (test === false) {
                this.errors.push(new DiagnosticsError(`Unknown function: "${text}"`, 0, 0, text.length, lineIndex));
            }
        }
    }
    analyzeFunctionInputs(words, text, lineIndex) {
        var fn = words[0] ?? null;
        var op1 = words[1] ?? null;
        var op2 = words[2] ?? null;
        var op3 = words[3] ?? null;
        var op4 = words[4] ?? null;
        if (!manual.hasOwnProperty(fn)) {
            this.errors.push(new DiagnosticsError(`Unknown function: "${text}"`, 0, 0, text.length, lineIndex));
        }
        else {
            var rule = manual[fn];
            if (rule.type == 'Function') {
                if (op1 !== null && this.empty(rule.op1)) {
                    this.errors.push(new DiagnosticsError(`this function have\`t any Arguments: "${text}"`, 0, 0, text.length, lineIndex));
                    return true;
                }
                if (!this.empty(op1) && !this.empty(rule.op1)) {
                    this.parseOpRule(rule.op1, op1, text.indexOf(op1, fn.length), text, lineIndex);
                }
                else if (this.empty(op1) && !this.empty(rule.op1)) {
                    this.errors.push(new DiagnosticsError(`missing first "Argument": "${text}"`, 0, 0, text.length, lineIndex));
                }
                if (!this.empty(op2) && !this.empty(rule.op2)) {
                    this.parseOpRule(rule.op2, op2, text.indexOf(op2, fn.length + op1.length), text, lineIndex);
                }
                else if (this.empty(op2) && !this.empty(rule.op2)) {
                    this.errors.push(new DiagnosticsError(`missing second "Argument": "${text}"`, 0, 0, text.length, lineIndex));
                }
                if (!this.empty(op3) && !this.empty(rule.op3)) {
                    this.parseOpRule(rule.op3, op3, text.indexOf(op3, fn.length + op1.length + op2.length), text, lineIndex);
                }
                else if (this.empty(op3) && !this.empty(rule.op3)) {
                    this.errors.push(new DiagnosticsError(`missing third "Argument": "${text}"`, 0, 0, text.length, lineIndex));
                }
                if (!this.empty(op4) && !this.empty(rule.op4)) {
                    this.parseOpRule(rule.op4, op4, text.indexOf(op4, fn.length + op1.length + op2.length + op3.length), text, lineIndex);
                }
                else if (this.empty(op4) && !this.empty(rule.op4)) {
                    this.errors.push(new DiagnosticsError(`missing fourth "Argument": "${text}"`, 0, 0, text.length, lineIndex));
                }
            }
            else {
                this.errors.push(new DiagnosticsError(`Unknown function: "${text}"`, 0, 0, text.length, lineIndex));
            }
        }
        return true;
    }
    parseOpRule(op, value, start, text, lineIndex) {
        `
		R - один из регистров r0-r15, в прямой или косвенной адресации
		N - псевдоним, понятное имя, которое можно задать регистру или каналу данных
		D - один из входных портов db, d0-d5 в прямой или косвенной адресации
		S - номер слота порта db, d0-d5
		P - логический параметр порта db, d0-d5
		C - константа типа double, заданная непосредственно или по имени
		A - номер строки, неотрицательное целое число (нумерация начинается с 0)
		T - тэг
		O - смещение, целое число, указывающее смещение в строках кода относительно текущей
		RM - режим чтения реагентов, одно из Contents, Required или Recipe (можно 0, 1 или 2, соответственно)
		RC - код реагента
		H - хеш устройств, с которыми выполняется операция пакетного чтения lb или записи sb
		BM - режим пакетного чтения, одно из Average, Sum, Minimum или Maximum (можно 0, 1, 2 или 3, соотвественно)
		`;
        var ops = op.replace(/ */, '').split('/');
        var errors = 0;
        var maxErrors = ops.length;
        for (const o of ops) {
            switch (o.toUpperCase()) {
                case 'H':
                case 'C':
                case 'A':
                case 'O':
                    if (isNaN(parseFloat(value)) && this.aliases.indexOf(value) < 0) {
                        errors++;
                    }
                    break;
                case 'R':
                    if (!exports.regexes.rr1.test(value) && !exports.regexes.r1.test(value)) {
                        errors++;
                    }
                    break;
                case 'N':
                    if (this.aliases.indexOf(value) < 0) {
                        errors++;
                    }
                    break;
                case 'D':
                    if (!exports.regexes.dr1.test(value) && !exports.regexes.d1.test(value)) {
                        errors++;
                    }
                    break;
                case 'S':
                    if (isNaN(parseFloat(value))) {
                        errors++;
                    }
                    break;
                case 'T':
                    break;
                case 'P':
                    if (keywords.indexOf(value) < 0) {
                        errors++;
                    }
                    break;
                case 'RM':
                    if (['Contents', 'Required', 'Recipe', 0, 1, 2].indexOf(value) < 0) {
                        errors++;
                    }
                    break;
                case 'RC':
                    break;
                case 'BM':
                    if (['Average', 'Sum', 'Minimum', 'Maximum', 0, 1, 2, 3].indexOf(value) < 0) {
                        errors++;
                    }
                    break;
                default:
                    break;
            }
        }
        if (errors >= ops.length) {
            this.errors.push(new DiagnosticsError(`invalid parameter: ${value}, must be "${op}"`, 0, start, value.length, lineIndex));
        }
        return true;
    }
    createDiagnostic(range, message, lvl) {
        const diagnostic = new vscode.Diagnostic(range, message, lvl);
        diagnostic.code = exports.Ic10DiagnosticsName;
        return diagnostic;
    }
    empty(a) {
        if (a == null) {
            return true;
        }
        switch (typeof a) {
            case 'string':
                if (!a || a.trim() == '' || a == null) {
                    return true;
                }
                else {
                    return false;
                }
            case 'number':
                return Boolean(a);
        }
        return false;
    }
}
exports.Ic10Diagnostics = Ic10Diagnostics;
exports.ic10Diagnostics = new Ic10Diagnostics;
//# sourceMappingURL=ic10.diagnostics.js.map