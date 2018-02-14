const shell = require("shelljs");

shell.mkdir('-p', 'dist/public/js/lib');
shell.cp("-R", "src/public/js/lib", "dist/public/js");
shell.cp("-R", "src/public/fonts", "dist/public/");
shell.cp("-R", "src/public/images", "dist/public/");
shell.cp("-R", "src/module/frontend/lib", "dist/module/frontend/lib");