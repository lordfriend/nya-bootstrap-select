'use strict';

module.exports = function(grunt) {

  // Load all grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long grunt task take. Can help when optimizing build times
  require('time-grunt')(grunt);

  //Configure grunt
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    less: {
      options: {
        banner: grunt.file.read('src/banner')
      },
      main: {
        files: {
          'dist/css/nya-bs-select.css': 'less/nya-bs-select.less'
        }
      },
      docs: {
        files: {
          'docs/dist/css/main.css': 'docs/src/less/main.less'
        }
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
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
      css: {
        files: ['less/*.less'],
        tasks: ['newer:less:main'],
        options: {
          livereload: true
        }
      },
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
    },

    concat: {
      options:{
        banner: grunt.file.read('src/banner')
      },
      dist: {
        src: ['src/nya.prefix', 'src/nya-bs-public.js', 'src/nya-bs-select-ctrl.js', 'src/nya-bs-select.js', 'src/nya-bs-option.js', 'src/nya.suffix'],
        dest: 'dist/js/nya-bs-select.js'
      }
    },

    uglify: {
      options: {
        banner: grunt.file.read('src/banner')
      },
      dist: {
        src: ['dist/js/nya-bs-select.js'],
        dest: 'dist/js/nya-bs-select.min.js'
      }
    },

    cssmin: {
      options: {
        banner: grunt.file.read('src/banner')
      },
      dist: {
        src: ['dist/css/nya-bs-select.css'],
        dest: 'dist/css/nya-bs-select.min.css'
      }
    }
  });

  // Creates the 'serve' task
  grunt.registerTask('serve', [
    'less:main',
    'connect:livereload',
    'watch'
  ]);

  // Creates the 'test' task
  grunt.registerTask('test', ['karma:unit']);

  // Creates the 'test-local' task
  grunt.registerTask('test-local', ['karma:locally']);

  // Build distribution files
  grunt.registerTask('build', [
    'less:main',
    'test',
    'concat:dist',
    'uglify:dist',
    'cssmin:dist'
  ])
};
