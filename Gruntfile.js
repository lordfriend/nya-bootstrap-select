'use strict';

module.exports = function(grunt) {

  // Load all grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long grunt task take. Can help when optimizing build times
  require('time-grunt')(grunt);

  //Configure grunt
  grunt.initConfig({

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.',
            'examples'
          ]
        }
      }
    },

    //Watch files for changes, and run tasks base on the changed files.
    watch: {
      js: {
        files: ['src/*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          'examples/*.html',
          'examples/{,*/*.js}',
          'examples{,*/}*.css',
          'examples/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'src/*.js',
        'examples/{,*/}*.js'
      ]

    },

    // Test

    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        autoWatch: false,
        singleRun: true
      },
      locally: {
        configFile: 'test/karma.conf.js',
        autoWatch: false,
        singleRun: true,
        browsers: ['Chrome', 'Firefox', 'PhantomJS']
      }
    }
  });

  // Creates the 'serve' task
  grunt.registerTask('serve', [
    'connect:livereload',
    'watch'
  ]);

  // Creates the 'test' task
  grunt.registerTask('test', ['karma:unit']);

  // Creates the 'test-local' task
  grunt.registerTask('test-local', ['karma:locally']);
};
