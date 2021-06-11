const assert = require('assert').strict;
const { execSync } = require("child_process");
const fs = require('fs');

describe('Building html', function() {
    execSync(
        "../../node_modules/.bin/webpack --progress --config=../../node_modules/laravel-mix/setup/webpack.config.js",
        {cwd: __dirname + "/testproject"},
        (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        }
    );
    it('should build a file', function() {
        assert.strictEqual(fs.existsSync(__dirname + "/testproject/dist/index.html"), true);
    });
    it('file contents should match with the partial and layout', function() {
        try {
            var data = fs.readFileSync(__dirname + "/testproject/dist/index.html", 'utf8');
        } catch(e) {
            console.log('Error:', e.stack);
        }
        assert.strictEqual(data, '<header><h1>Hello World! I\'m John!</h1></header>');
    });
});

describe('Building html with configuration', function() {
    execSync(
        "../../node_modules/.bin/webpack --progress --config=../../node_modules/laravel-mix/setup/webpack.config.js",
        {cwd: __dirname + "/testproject-with-configuration"},
        (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        }
    );
    it('should build index file', function() {
        assert.strictEqual(fs.existsSync(__dirname + "/testproject-with-configuration/public/index.html"), true);
    });
    it('index file contents should match with the partial and layout', function() {
        try {
            var data = fs.readFileSync(__dirname + "/testproject-with-configuration/public/index.html", 'utf8');
        } catch(e) {
            console.log('Error:', e.stack);
        }
        assert.strictEqual(data.replace(/(\r\n|\n|\r)/gm, ""), '<header><h1>I\'m John!</h1></header>');
    });
    it('should build files in subdirectories file', function() {
        assert.strictEqual(fs.existsSync(__dirname + "/testproject-with-configuration/public/sub-directory/index.html"), true);
        assert.strictEqual(fs.existsSync(__dirname + "/testproject-with-configuration/public/sub-directory/example.html"), true);
    });
    it('sub-directory index file contents should match with the partial and layout', function() {
        try {
            var data = fs.readFileSync(__dirname + "/testproject-with-configuration/public/sub-directory/index.html", 'utf8');
        } catch(e) {
            console.log('Error:', e.stack);
        }
        assert.strictEqual(data.replace(/(\r\n|\n|\r)/gm, ""), '<header><h1>I\'m Liam!</h1></header>');
    });
    it('sub-directory example file contents should match with the partial and layout and include expression', function() {
        try {
            var data = fs.readFileSync(__dirname + "/testproject-with-configuration/public/sub-directory/example.html", 'utf8');
        } catch(e) {
            console.log('Error:', e.stack);
        }
        assert.strictEqual(data.replace(/(\r\n|\n|\r)/gm, ""), '<header><h1>Hello! I\'m Olivia!</h1></header>');
    });
});
