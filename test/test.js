var assert = require('assert').strict;
const { execSync } = require("child_process");
const fs = require('fs');

describe('Building html', function() {
    execSync(
        "../../node_modules/webpack/bin/webpack.js --progress --hide-modules --display=none --config=../../node_modules/laravel-mix/setup/webpack.config.js",
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