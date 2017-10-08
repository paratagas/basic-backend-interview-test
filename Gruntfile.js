module.exports = function (grunt) {
    // load plugins
    [
        'grunt-cafe-mocha',
        'grunt-contrib-jshint'
    ].forEach(function (task) {
        grunt.loadNpmTasks(task);
    });

    // configure plugins
    grunt.initConfig({
        cafemocha: {
            all: {src: 'tests/tests-*.js', options: {ui: 'tdd'}}
        },
        jshint: {
            app: ['app.js', 'settings.js', 'app_server/**/*.js', 'bin/**/*.js'],
            tests: ['Gruntfile.js', 'tests/**/*.js'],
            options: {
                ignores: ['app_server/controllers/main.js']
            }
        }
    });

    // register tasks
    grunt.registerTask('default', ['jshint', 'cafemocha']);
};
