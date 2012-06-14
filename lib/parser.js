var hljs = require('hljs'),
    marked_ = require('marked');

var marked = function(text, autoPages, unsafe) {
    var sanitize = autoPages ? false : !unsafe;
    marked_.setOptions({ gfm: true, sanitize: sanitize });

    var tokens = marked_.lexer(text),
        l = tokens.length,
        i = 0,
        token,
        anchorCount = 0,
        inDiv = false,
        newTokens = [];

    for (; i < l; i++) {
        token = tokens[i];
        if (autoPages && token.type === 'heading' && token.depth === 1) {
            if (inDiv) {
                if (anchorCount === 1) {
                    newTokens.push({ type: 'html', pre: false, text: '<a class="nextPage" href="#page' + anchorCount + '">Next</a>' });
                } else if (anchorCount > 1) {
                    newTokens.push({ type: 'html', pre: false, text: '<a class="prevPage" href="#page' + (anchorCount - 2) + '">Previous</a><a class="nextPage" href="#page' + anchorCount + '">Next</a>' });
                }
                newTokens.push({ type: 'html', pre: 'false', text: '</div>' });
                inDiv = false;
            }
            newTokens.push({ type: 'html', pre: false, text: '<div class="page" id="page' + anchorCount + '">' });
            inDiv = true;
            token.text = '<a id="page' + anchorCount + '"></a>' + token.text;
            anchorCount++; 
        } else if (token.type === 'code') {
            token.text = hljs(token.text, token.lang).value;
            token.escaped = true;
        }
        newTokens.push(token);
    }

    text = marked_.parser(newTokens);
    return text;
}

module.exports = marked;
