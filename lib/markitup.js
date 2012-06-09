// Require dependencies
var fs = require('fs'),
    path = require('path'),
    marked = require('./parser'),
    jade = require('jade');

// Receives a string of markdown formatted text and returns html
exports.md_to_html = function (markdown, template) {
    if (typeof template === 'undefined') template = path.join(__dirname, 'template.jade');
    var temp = fs.readFileSync(template, 'utf-8');
    var jade_out = jade.compile(temp);
    return jade_out({ data: marked(markdown) });
};

// This is the exported function that does the actual parsing and documentation generation
exports.generate_doc = function (filename, outputPath, template, unsafe, callback) {
    var markdown = fs.readFileSync(filename).toString();
    write_html(filename, markdown, outputPath, template, unsafe, callback);
};

// This function writes parsed output to html
function write_html(filename, markdown, outputPath, template, unsafe, callback) {
    var outfile,
        templatePath,
        template;

    if (typeof outputPath === 'undefined' || outputPath === null) {
        outfile = filename.replace(path.extname(filename), '.html');
    } else {
        outfile = path.join(outputPath, path.basename(filename).replace(path.extname(filename), '.html'));
    }

    if (typeof template === 'undefined' || template === null) {
        templatePath = path.join(__dirname, 'template.jade');
    } else {
        templatePath = template;
    }

    template = fs.readFileSync(templatePath, 'utf-8');
    var options = { "filename": templatePath };
    var fn = jade.compile(template, options);
    fs.writeFileSync(outfile, fn({ data: marked(markdown, unsafe) }));
    callback(null, outfile);
}
