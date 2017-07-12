var fs = require('fs'),
    gulp = require('gulp'),
    ts = require('gulp-typescript'),
    project = ts.createProject('tsconfig.json'),

    patch = `
      if (ctrlObj.__esModule) {
        debug('loading default export from es module');
        ctrlObj = ctrlObj.default || ctrlObj;
      }`,
    path_combine = require('path').join,
    router_path = path_combine(__dirname, 'node_modules/swagger-node-runner/fittings/swagger_router.js'),
    swagger_router_content = fs.readFileSync(router_path, 'utf8');


fs.writeFileSync(router_path, swagger_router_content.replace(patch, '').replace('var ctrlObj = require(controllerPath)', `var ctrlObj = require(controllerPath)${patch}`));

gulp.task('compile', () => {
  return gulp.src('api/controllers/*.ts')
    .pipe(project())
    .pipe(gulp.dest('api/controllers'));
});

gulp.task('watch', ['compile'], () => {
  gulp.watch('api/controllers/*.ts', ['compile']);
});
