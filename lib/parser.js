var hljs = require('hljs'),
    marked_ = require('marked');

marked_.setOptions({ gfm: true, sanitize: true });

var marked = function(text) {
    var tokens = marked_.lexer(text),
        l = tokens.length,
        i = 0,
        token;

    for (; i < l; i++) {
        token = tokens[i];
        if (token.type === 'code') {
            token.text = hljs(token.text, token.lang).value;
            token.escaped = true;
        }
    }

    text = marked_.parser(tokens);
    return text;
}

module.exports = marked;
