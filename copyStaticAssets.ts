const shell = require("shelljs");

shell.rm('-rf', 'dist/public/js/lib');
shell.rm('-rf', 'dist/public/obj');
shell.rm('-rf', 'dist/module/frontend/lib');
shell.mkdir('-rf', 'dist/public/obj');
shell.mkdir('-p', 'dist/public/js/lib');

shell.cp("-R", "src/public/obj", "dist/public/obj");
shell.cp("-R", "src/public/js/", "dist/public/js");
shell.cp("-R", "src/public/js/lib", "dist/public/js");
shell.cp("-R", "src/public/fonts", "dist/public/");
shell.cp("-R", "src/public/images", "dist/public/");
shell.cp("-R", "src/module/frontend/lib", "dist/module/frontend/lib");