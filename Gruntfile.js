'use strict';

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: {
      bower_dir: './webapp/bower_components',
      dist_dir: './dist',
      app_dir: './webapp'
    },
    exec: {
      aggregate: {
        cmd: 'node logparser/aggregate.js'
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
        '<%= config.app_dir %>/scripts/{,*/}*.js'
      ]
    },
    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist_dir %>/*'
          ]
        }]
      }
    },
    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= config.app_dir %>/index.html',
      options: {
        dest: '<%= config.dist_dir %>',
        flow: {
          html: {
            steps: {
              js: ['concat'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },
    usemin: {
      html: ['<%= config.dist_dir %>/{,*/}*.html'],
      css: ['<%= config.dist_dir %>/css/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= config.dist_dir %>']
      }
    },
    cssmin: {
      options: {
        root: '<%= config.app_dir %>'
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist_dir %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= config.dist_dir %>'
        }]
      }
    },
    // ngmin tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= config.dist_dir %>/scripts',
            src: '*.js',
            dest: '<%= config.dist_dir %>/scripts'
          }
        ]
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      dist: {
        files: [
          {'<%= config.dist_dir %>/scripts/vendor.js': ['<%= config.dist_dir %>/scripts/vendor.js']},
          {'<%= config.dist_dir %>/scripts/main.js': ['<%= config.dist_dir %>/scripts/main.js']}
        ]
      }
    },
    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app_dir %>',
          dest: '<%= config.dist_dir %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= config.dist_dir %>/images',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= config.app_dir %>/css',
        dest: '.tmp/css/',
        src: '{,*/}*.css'
      },
      data: {
        files: [{
          expand: true,
          cwd: '<%= config.app_dir %>/data/',
          dest: '<%= config.dist_dir %>/data',
          src: 'gamedata.json',
          filter: 'isFile'
        }]
      }
    }
  });

  grunt.registerTask('js', [
    'ngmin',
    'uglify'
  ]);

  grunt.registerTask('build', [
    'exec:aggregate',
    'clean',
    //'jshint',
    'useminPrepare',
    'concat',
    'ngmin',
    'uglify',
    'copy',
    'cssmin',
    'usemin',
    'htmlmin'
  ]);
};
