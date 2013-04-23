ace.define("ace/mode/r", ["require", "exports", "module", "ace/range", "ace/lib/oop", "ace/mode/text", "ace/tokenizer", "ace/mode/text_highlight_rules", "ace/mode/r_highlight_rules", "ace/mode/matching_brace_outdent", "ace/unicode"], function (e, t, n) {
    var r = e("../range").Range, i = e("../lib/oop"), s = e("./text").Mode, o = e("../tokenizer").Tokenizer, u = e("./text_highlight_rules").TextHighlightRules, a = e("./r_highlight_rules").RHighlightRules, f = e("./matching_brace_outdent").MatchingBraceOutdent, l = e("../unicode"), c = function () {
        this.$tokenizer = new o((new a).getRules()), this.$outdent = new f
    };
    i.inherits(c, s), function () {
        this.tokenRe = new RegExp("^[" + l.packages.L + l.packages.Mn + l.packages.Mc + l.packages.Nd + l.packages.Pc + "._]+", "g"), this.nonTokenRe = new RegExp("^(?:[^" + l.packages.L + l.packages.Mn + l.packages.Mc + l.packages.Nd + l.packages.Pc + "._]|s])+", "g"), this.$complements = {"(": ")", "[": "]", '"': '"', "'": "'", "{": "}"}, this.$reOpen = /^[(["'{]$/, this.$reClose = /^[)\]"'}]$/, this.getNextLineIndent = function (e, t, n, r, i) {
            return this.codeModel.getNextLineIndent(i, t, e, n, r)
        }, this.allowAutoInsert = this.smartAllowAutoInsert, this.checkOutdent = function (e, t, n) {
            return/^\s+$/.test(t) ? /^\s*[\{\}\)]/.test(n) : !1
        }, this.getIndentForOpenBrace = function (e) {
            return this.codeModel.getIndentForOpenBrace(e)
        }, this.autoOutdent = function (e, t, n) {
            if (n == 0)return 0;
            var i = t.getLine(n), s = i.match(/^(\s*[\}\)])/);
            if (s) {
                var o = s[1].length, u = t.findMatchingBracket({row: n, column: o});
                if (!u || u.row == n)return 0;
                var a = this.codeModel.getIndentForOpenBrace(u);
                t.replace(new r(n, 0, n, o - 1), a)
            }
            s = i.match(/^(\s*\{)/);
            if (s) {
                var o = s[1].length, a = this.codeModel.getBraceIndent(n - 1);
                t.replace(new r(n, 0, n, o - 1), a)
            }
        }, this.$getIndent = function (e) {
            var t = e.match(/^(\s+)/);
            return t ? t[1] : ""
        }, this.transformAction = function (e, t, n, r, i) {
            if (t === "insertion" && i === "\n") {
                var s = n.getSelectionRange().start, o = /^((\s*#+')\s*)/.exec(r.doc.getLine(s.row));
                if (o && n.getSelectionRange().start.column >= o[2].length)return{text: "\n" + o[1]}
            }
            return!1
        }
    }.call(c.prototype), t.Mode = c
}), ace.define("ace/mode/r_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/lib/lang", "ace/mode/text_highlight_rules", "ace/mode/tex_highlight_rules"], function (e, t, n) {
    var r = e("../lib/oop"), i = e("../lib/lang"), s = e("./text_highlight_rules").TextHighlightRules, o = e("./tex_highlight_rules").TexHighlightRules, u = function () {
        var e = i.arrayToMap("function|if|in|break|next|repeat|else|for|return|switch|while|try|tryCatch|stop|warning|require|library|attach|detach|source|setMethod|setGeneric|setGroupGeneric|setClass".split("|")), t = i.arrayToMap("NULL|NA|TRUE|FALSE|T|F|Inf|NaN|NA_integer_|NA_real_|NA_character_|NA_complex_".split("|"));
        this.$rules = {start: [
            {token: "comment.sectionhead", regex: "#+(?!').*(?:----|====|####)\\s*$"},
            {token: "comment", regex: "#+'", next: "rd-start"},
            {token: "comment", regex: "#.*$"},
            {token: "string", regex: '["]', next: "qqstring"},
            {token: "string", regex: "[']", next: "qstring"},
            {token: "constant.numeric", regex: "0[xX][0-9a-fA-F]+[Li]?\\b"},
            {token: "constant.numeric", regex: "\\d+L\\b"},
            {token: "constant.numeric", regex: "\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d*)?i?\\b"},
            {token: "constant.numeric", regex: "\\.\\d+(?:[eE][+\\-]?\\d*)?i?\\b"},
            {token: "constant.language.boolean", regex: "(?:TRUE|FALSE|T|F)\\b"},
            {token: "identifier", regex: "`.*?`"},
            {token: function (n) {
                return e[n] ? "keyword" : t[n] ? "constant.language" : n == "..." || n.match(/^\.\.\d+$/) ? "variable.language" : "identifier"
            }, regex: "[a-zA-Z.][a-zA-Z0-9._]*\\b"},
            {token: "keyword.operator", regex: "%%|>=|<=|==|!=|\\->|<\\-|\\|\\||&&|=|\\+|\\-|\\*|/|\\^|>|<|!|&|\\||~|\\$|:"},
            {token: "keyword.operator", regex: "%.*?%"},
            {token: "paren.keyword.operator", regex: "[[({]"},
            {token: "paren.keyword.operator", regex: "[\\])}]"},
            {token: "text", regex: "\\s+"}
        ], qqstring: [
            {token: "string", regex: '(?:(?:\\\\.)|(?:[^"\\\\]))*?"', next: "start"},
            {token: "string", regex: ".+"}
        ], qstring: [
            {token: "string", regex: "(?:(?:\\\\.)|(?:[^'\\\\]))*?'", next: "start"},
            {token: "string", regex: ".+"}
        ]};
        var n = (new o("comment")).getRules();
        for (var r = 0; r < n.start.length; r++)n.start[r].token += ".virtual-comment";
        this.addRules(n, "rd-"), this.$rules["rd-start"].unshift({token: "text", regex: "^", next: "start"}), this.$rules["rd-start"].unshift({token: "keyword", regex: "@(?!@)[^ ]*"}), this.$rules["rd-start"].unshift({token: "comment", regex: "@@"}), this.$rules["rd-start"].push({token: "comment", regex: "[^%\\\\[({\\])}]+"})
    };
    r.inherits(u, s), t.RHighlightRules = u
}), ace.define("ace/mode/tex_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/lib/lang", "ace/mode/text_highlight_rules"], function (e, t, n) {
    var r = e("../lib/oop"), i = e("../lib/lang"), s = e("./text_highlight_rules").TextHighlightRules, o = function (e) {
        e || (e = "text"), this.$rules = {start: [
            {token: "comment", regex: "%.*$"},
            {token: e, regex: "\\\\[$&%#\\{\\}]"},
            {token: "keyword", regex: "\\\\(?:documentclass|usepackage|newcounter|setcounter|addtocounter|value|arabic|stepcounter|newenvironment|renewenvironment|ref|vref|eqref|pageref|label|cite[a-zA-Z]*|tag|begin|end|bibitem)\\b", next: "nospell"},
            {token: "keyword", regex: "\\\\(?:[a-zA-z0-9]+|[^a-zA-z0-9])"},
            {token: "paren.keyword.operator", regex: "[[({]"},
            {token: "paren.keyword.operator", regex: "[\\])}]"},
            {token: e, regex: "\\s+"}
        ], nospell: [
            {token: "comment", regex: "%.*$", next: "start"},
            {token: "nospell." + e, regex: "\\\\[$&%#\\{\\}]"},
            {token: "keyword", regex: "\\\\(?:documentclass|usepackage|newcounter|setcounter|addtocounter|value|arabic|stepcounter|newenvironment|renewenvironment|ref|vref|eqref|pageref|label|cite[a-zA-Z]*|tag|begin|end|bibitem)\\b"},
            {token: "keyword", regex: "\\\\(?:[a-zA-z0-9]+|[^a-zA-z0-9])", next: "start"},
            {token: "paren.keyword.operator", regex: "[[({]"},
            {token: "paren.keyword.operator", regex: "[\\])]"},
            {token: "paren.keyword.operator", regex: "}", next: "start"},
            {token: "nospell." + e, regex: "\\s+"},
            {token: "nospell." + e, regex: "\\w+"}
        ]}
    };
    r.inherits(o, s), t.TexHighlightRules = o
}), ace.define("ace/mode/matching_brace_outdent", ["require", "exports", "module", "ace/range"], function (e, t, n) {
    var r = e("../range").Range, i = function () {
    };
    (function () {
        this.checkOutdent = function (e, t) {
            return/^\s+$/.test(e) ? /^\s*\}/.test(t) : !1
        }, this.autoOutdent = function (e, t) {
            var n = e.getLine(t), i = n.match(/^(\s*\})/);
            if (!i)return 0;
            var s = i[1].length, o = e.findMatchingBracket({row: t, column: s});
            if (!o || o.row == t)return 0;
            var u = this.$getIndent(e.getLine(o.row));
            e.replace(new r(t, 0, t, s - 1), u)
        }, this.$getIndent = function (e) {
            var t = e.match(/^(\s+)/);
            return t ? t[1] : ""
        }
    }).call(i.prototype), t.MatchingBraceOutdent = i
})