
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  var config = grunt.file.readYAML('Gruntconfig.yml')
  grunt.initConfig({
    // Minify CSS
    cssmin: {
      sourceCSS: {
        files: [{
          expand: true,
          cwd: config.cssDir,
          src: ['*.css', '!*.min.css'],
          dest: config.mincssDir,
          ext: '.css'
        }]
      },
    },
    // Minify html
    htmlmin: {                                     // Task
      html: {                                      // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: config.srcDir,
          src: ['*.html'],
          dest: config.distDir
        }]
      },
    },
    // Minify JS
    uglify: {
      sourceJS: {
        files: [{
          expand: true,
          cwd: config.jsDir,
          src: ['*.js'],
          dest: config.minjsDir,
        }]
      },

    },

  });


  grunt.registerTask('default', [
    'cssmin',
    'htmlmin',
    'uglify',
  ]);

};
