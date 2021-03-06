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
exports.icXDiagnostics = exports.IcXDiagnosticsName = void 0;
const vscode = __importStar(require("vscode"));
const ic10_diagnostics_1 = require("./ic10.diagnostics");
const icx_compiler_1 = require("icx-compiler");
const main_1 = require("./main");
const err_1 = require("icx-compiler/src/err");
var manual = require('../languages/en.json');
var functions = require('../media/ic10.functions.json');
var keywords = require('../media/ic10.keyword.json');
exports.IcXDiagnosticsName = 'icX_diagnostic';
class IcXDiagnostics extends ic10_diagnostics_1.Ic10Diagnostics {
    constructor() {
        super();
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
        var code = doc.getText();
        try {
            var compiler = new icx_compiler_1.icX(code, main_1.icxOptions);
            var test = compiler.alalize();
        }
        catch (e) {
            console.error(e);
            return;
        }
        if (test.error instanceof err_1.Errors) {
            if (test.error.isError()) {
                for (const eKey in test.error.e) {
                    var err = test.error.e[eKey];
                    if (err instanceof err_1.Err) {
                        var l = doc.lineAt(err.line);
                        diagnostics.push(this.createDiagnostic(l.range, err.message, vscode.DiagnosticSeverity.Error));
                    }
                }
            }
        }
        try {
            var linesCount = test.result.split('\n').length;
            if (linesCount > 128) {
                diagnostics.push(this.createDiagnostic(new vscode.Range(0, 0, 0, 1), 'Max line', vscode.DiagnosticSeverity.Error));
            }
            this.view(test, linesCount);
        }
        catch (e) {
        }
        for (const de of this.errors.values) {
            diagnostics.push(this.createDiagnostic(de.range, de.message, de.lvl));
        }
        container.set(doc.uri, diagnostics);
    }
    view(test, linesCount) {
        var b = Math.abs(test.vars.empty.length - 15);
        var p = b / 15 * 100;
        var b2 = Math.abs(linesCount - 128);
        var p2 = linesCount / 128 * 100;
        main_1.icSidebar.section('icxStats', `
      <fieldset title="Stats">
							<ul>
								<ol>
									<span>vars:</span>
									<ol>
										<span>temp:</span>	<span>${test.vars.temps.length}</span>
									</ol>
									<ol>
										<span>aliases:</span>	<span>${test.vars.aliases.length}</span>
									</ol>
									<ol>
										<span>left vars:</span>	<span>${test.vars.empty.length}</span>
										<ol>
											<div id="leftVarsCounter" class="progress" percent="${p}" value="${b}"  max="15" min="0">
												<div></div>
											</div>
										</ol>	
									</ol>
								</ol>
								<ol>
								    <ol>
										<span>left ic10 lines:</span>	<span>${b2}</span>
										<ol>
											<div id="leftVarsCounter" class="progress" percent="${p2}" value="${b2}"  max="128" min="0">
												<div></div>
											</div>
										</ol>
									</ol>
								</ol>
							 </ul>
						</fieldset>
    `, main_1.LANG_KEY2);
        var comments = test.use.has('comments');
        var aliases = test.use.has('aliases');
        var loop = test.use.has('loop');
        var constants = test.use.has('constants');
        comments = comments ? comments : main_1.icxOptions.comments;
        aliases = aliases ? aliases : main_1.icxOptions.aliases;
        loop = loop ? loop : main_1.icxOptions.loop;
        constants = constants ? constants : main_1.icxOptions.constants;
        if (comments) {
            comments = 'checked';
        }
        else {
            comments = '';
        }
        if (aliases) {
            aliases = 'checked';
        }
        else {
            aliases = '';
        }
        if (loop) {
            loop = 'checked';
        }
        else {
            loop = '';
        }
        if (constants) {
            constants = 'checked';
        }
        else {
            constants = '';
        }
        main_1.icSidebar.section('settings', `
					<form name="settings" id="form-settings">
						<fieldset title="Settings">
							<ul>
								<ol>
									<input type="checkbox" data-fn="icxComments" ${comments} name="comments" id="comments">
									<label for="comments" class="disabledSelect">Enable comments</label>
								</ol>
								<ol>
									<input type="checkbox" data-fn="icxAliases" ${aliases} name="aliases" id="aliases">
									<label for="aliases" class="disabledSelect">Enable aliases</label>
								</ol>
								<ol>
									<input type="checkbox" data-fn="icxLoop" ${loop} name="loop" id="loop">
									<label for="loop" class="disabledSelect">use loop</label>
								</ol>
                <ol>
									<input type="checkbox" data-fn="icxConstants" ${constants} name="constants" id="constants">
									<label for="constants" class="disabledSelect">use constants</label>
								</ol>
							 </ul>
						</fieldset>
					</form>
				`, main_1.LANG_KEY2);
    }
    parseLine(doc, lineIndex) {
        const lineOfText = doc.lineAt(lineIndex);
        if (lineOfText.text.trim().length > 0) {
            var text = lineOfText.text.trim();
            var test = functions.some((substring) => {
                if (text.startsWith('#')) {
                    if (text.startsWith('#log') || text.startsWith('debug')) {
                        this.errors.push(new ic10_diagnostics_1.DiagnosticsError(`Debug function: "${text}"`, 2, 0, text.length, lineIndex));
                        return true;
                    }
                    return true;
                }
                var words = text.split(/ +/);
                text = text.replace(/#.+$/, '');
                text = text.trim();
                if (text.endsWith(':')) {
                    this.jumps.push(text);
                    return true;
                }
                if (text.startsWith('alias')) {
                    this.aliases.push(words[1]);
                }
                if (text.startsWith('var')) {
                    this.aliases.push(words[1]);
                }
                if (text.startsWith('define')) {
                    this.aliases.push(words[1]);
                }
                if (text.startsWith('const')) {
                    this.aliases.push(words[1]);
                }
                if (text.startsWith(substring)) {
                    this.analyzeFunctionInputs(words, text, lineIndex);
                }
                return false;
            }, this);
            this.aliases = [...new Set(this.aliases)];
        }
    }
    analyzeFunctionInputs(words, text, lineIndex) {
        var fn = words[0] ?? null;
        var op1 = words[1] ?? null;
        var op2 = words[2] ?? null;
        var op3 = words[3] ?? null;
        var op4 = words[4] ?? null;
        if (!manual.hasOwnProperty(fn)) {
            return true;
        }
        else {
            var rule = manual[fn];
            if (rule.type == 'Function') {
                if (op1 !== null && this.empty(rule.op1)) {
                    this.errors.push(new ic10_diagnostics_1.DiagnosticsError(`this function have\`t any Arguments: "${text}"`, 0, 0, text.length, lineIndex));
                    return true;
                }
                if (!this.empty(op1) && !this.empty(rule.op1)) {
                    this.parseOpRule(rule.op1, op1, text.indexOf(op1, fn.length), text, lineIndex);
                }
                else if (this.empty(op1) && !this.empty(rule.op1)) {
                    this.errors.push(new ic10_diagnostics_1.DiagnosticsError(`missing first "Argument": "${text}"`, 0, 0, text.length, lineIndex));
                }
                if (!this.empty(op2) && !this.empty(rule.op2)) {
                    this.parseOpRule(rule.op2, op2, text.indexOf(op2, fn.length + op1.length), text, lineIndex);
                }
                else if (this.empty(op2) && !this.empty(rule.op2)) {
                    this.errors.push(new ic10_diagnostics_1.DiagnosticsError(`missing second "Argument": "${text}"`, 0, 0, text.length, lineIndex));
                }
                if (!this.empty(op3) && !this.empty(rule.op3)) {
                    this.parseOpRule(rule.op3, op3, text.indexOf(op3, fn.length + op1.length + op2.length), text, lineIndex);
                }
                else if (this.empty(op3) && !this.empty(rule.op3)) {
                    this.errors.push(new ic10_diagnostics_1.DiagnosticsError(`missing third "Argument": "${text}"`, 0, 0, text.length, lineIndex));
                }
                if (!this.empty(op4) && !this.empty(rule.op4)) {
                    this.parseOpRule(rule.op4, op4, text.indexOf(op4, fn.length + op1.length + op2.length + op3.length), text, lineIndex);
                }
                else if (this.empty(op4) && !this.empty(rule.op4)) {
                    this.errors.push(new ic10_diagnostics_1.DiagnosticsError(`missing fourth "Argument": "${text}"`, 0, 0, text.length, lineIndex));
                }
            }
            else {
                return true;
            }
        }
        return true;
    }
    createDiagnostic(range, message, lvl) {
        const diagnostic = new vscode.Diagnostic(range, message, lvl);
        diagnostic.code = exports.IcXDiagnosticsName;
        return diagnostic;
    }
}
exports.icXDiagnostics = new IcXDiagnostics;
//# sourceMappingURL=icX.diagnostics.js.map