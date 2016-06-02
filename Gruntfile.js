'use strict'

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt)
  require('time-grunt')(grunt)

  const serveStatic = require('serve-static')
  const config = {
    app: 'app',
    dist: 'dist'
  }

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: config,

    browserify: {
      dist: {
        files: {
          '<%= config.dist %>/assets/scripts/js/app.js': ['<%= config.app %>/assets/scripts/js/**/*.js']
        },
        options: {
          browserifyOptions: {
            debug: true
          },
          transform: [
            'browserify-shim',
            'babelify',
            'uglifyify'
          ]
        }
      }
    },

    clean: {
      dist: ['<%= config.dist %>']
    },

    connect: {
      dist: {
        options: {
          port: 8080,
          hostname: '0.0.0.0',
          livereload: true,
          base: '<%= config.dist %>',
          open: true,
          middleware: function(connect, options) {
            const middlewares = []
            if (!Array.isArray(options.base)) {
              options.base = [options.base]
            }
            const directory = options.directory || options.base[options.base.length - 1]
            options.base.forEach(function(base) {
              middlewares.push(serveStatic(base))
            })
            middlewares.push(serveStatic(directory))
            middlewares.push(function(req, res) {
              for (let file, i = 0; i < options.base.length; i++) {
                file = options.base + "/index.html"
                if (grunt.file.exists(file)) {
                  require('fs').createReadStream(file).pipe(res)
                  return
                }
              }
              res.statusCode(404)
              res.end()
            })
            return middlewares
          }
        }
      }
    },

    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'node_modules/bootstrap/dist',
            src: ['assets/fonts/**'],
            dest: '<%= config.dist %>'
          },
          {
            expand: true,
            cwd: '<%= config.app %>',
            src: ['**/*.html'],
            dest: '<%= config.dist %>'
          },
          {
            expand: true,
            cwd: '<%= config.app %>',
            src: ['assets/styles/**/*.css'],
            dest: '<%= config.dist %>'
          },
          {
            expand: true,
            cwd: '<%= config.app %>',
            src: ['assets/icons/**/*'],
            dest: '<%= config.dist %>'
          },
          {
            expand: true,
            cwd: '<%= config.app %>',
            src: ['assets/images/**/*{.png,.gif,.jpg}'],
            dest: '<%= config.dist %>'
          },
					{
						expand: true,
						cwd: '<%= config.app %>',
						src: ['assets/audio/**/*'],
						dest: '<%= config.dist %>'
					},
					{
						expand: true,
						cwd: '<%= config.app %>',
						src: ['assets/video/**/*'],
						dest: '<%= config.dist %>'
					}
						]
					}
    },

    eslint: {
      target: ['<%= config.app %>/assets/scripts/js/*.js']
    },

    sass: {
      dist: {
        options: {
          style: 'compressed',
          unixNewlines: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= config.app %>/assets/styles',
            src: ['*.scss'],
            dest: '<%= config.dist %>/assets/styles/',
            ext: '.css'
          }
        ]
      }
    },

    watch: {
      options: {
        livereload: true
      },
      documents: {
        files: ['<%= config.app %>/**/*.html'],
        tasks: ['copy']
      },
      icons: {
        files: ['<%= config.app %>/assets/icons/**/*'],
        tasks: ['copy']
      },
      images: {
        files: ['<%= config.app %>/assets/images/**/*{.png,.gif,.jpg}'],
        tasks: ['copy']
      },
			video: {
				files: ['<%= config.app %>/assets/video/**/*'],
				tasks: ['copy']
			},
			audio: {
				files: ['<%= config.app %>/assets/audio/**/*'],
				tasks: ['copy']
			},
      scripts: {
        files: ['<%= config.app %>/assets/scripts/js/**/*.js'],
        tasks: ['eslint', 'browserify']
      },
      templates: {
        files: ['<%= config.app %>/assets/scripts/templates/**/*.hbs'],
        tasks: ['browserify']
      },
      styles: {
        files: ['<%= config.app %>/assets/styles/*.scss'],
        tasks: ['sass']
      },
      gruntfile: {
        files: ['Gruntfile.js', 'package.json']
      }
    }

  })

  grunt.registerTask('default', [
      'eslint',
      'clean',
      'copy',
      'sass',
      'browserify',
      'connect',
      'watch'
    ]
  )

}
