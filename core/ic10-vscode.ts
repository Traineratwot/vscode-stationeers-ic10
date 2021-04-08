"use strict";
import vscode = require("vscode");

export class Ic10Vscode {
	private langPath: {};
	
	constructor() {
		this.langPath = {};
		const LOCALE_KEY: string = vscode.env.language.trim()
		try {
			
			var langPath = require(`../languages/${LOCALE_KEY}.json`);
			if (langPath instanceof Object) {
				this.langPath = langPath
			} else {
				var langPath = require(`../languages/en.json`);
				this.langPath = langPath
				console.info(`undefined lang ${LOCALE_KEY}`)
			}
		} catch (e) {
			console.warn(e)
		}
	}
	
	public getHover(name = '', lang = '') {
		
		if (this.langPath.hasOwnProperty(name)) {
			var data = this.langPath[name]
			var type = data?.type
			var op1 = data?.op1
			var op2 = data?.op2
			var op3 = data?.op3
			var op4 = data?.op4
			var preview = data?.description?.preview
			if (preview) {
				preview = '*' + preview + '*'
			}
			var description = data.description.text
			var heading = `${type} **${name}** `
			if (op1) {
				heading += `op1:[${op1}] `
			}
			if (op2) {
				heading += `op2:[${op2}] `
			}
			if (op3) {
				heading += `op3:[${op3}] `
			}
			if (op4) {
				heading += `op4:[${op4}] `
			}
			
			return `
${heading}

----
${preview}

${description}
	    	`
		} else {
			return null
		}
	}
}
