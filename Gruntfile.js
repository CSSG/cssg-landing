'use strict';

var $ = require('cheerio');

module.exports = function (grunt) {

    // regular grunt routine
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    // specific tasks
    grunt.loadNpmTasks('assemble');


    // paths
    var paths = {
        css : {
            src : "assets/css",
            dest : "public/assets/css",
            vendor : "bower_components/skeleton/css"
        },
        img : {
            src : "assets/i",
            dest : "public/assets/i"
        },
        js : {
            src : "assets/js",
            dest : "public/assets/js"
        }
    };

    // all others
    var config = {
        cssgSrc : {
            src : "https://github.com/CSSG/css-o-gram.git",
            dest : "cssg"
        },
        editorSrc : {
            src : "https://github.com/CSSG/css-o-gram_tool.git",
            dest : "editor"
        }
    };


    //
    // CONFIG
    //

    grunt.initConfig({

        // project config
        paths: paths,

        config: config,

        // tasks
        copy: {
            img: {
                expand: true,
                cwd: '<%= paths.img.src %>',
                src: '**',
                dest: '<%= paths.img.dest %>'
                //, flatten: true
            },
            favicon: {
                expand: true,
                cwd: 'assets',
                src: 'favicon.ico',
                dest: 'public'
                //, flatten: true
            },
            jsBower: {
                expand: true,
                cwd: 'bower_components/jquery/dist',
                src: ['jquery.min.js', 'jquery.min.map'],
                dest: '<%= paths.js.dest %>'
                //, flatten: true
            },
            editorTpl: {
                expand: true,
                cwd: '<%= config.editorSrc.dest %>',
                src: 'index.html',
                dest: 'includes',
                rename: function(dest, src) {
                    return dest + '/editor.hbs';
                }
                //, flatten: true
            }
        },
        clean: {
            css: {
                files: [{
                    dot: true,
                    src: [
                        '<%= paths.css.dest %>'
                    ]
                }]
            },
            img: {
                files: [{
                    dot: true,
                    src: [
                        '<%= paths.img.dest %>'
                    ]
                }]
            },
            js: {
                files: [{
                    dot: true,
                    src: [
                        '<%= paths.js.dest %>'
                    ]
                }]
            },
            html: {
                files: [{
                    dot: true,
                    src: [
                        'public/**/*.html'
                    ]
                }]
            },
            editorTpl: {
                files: [{
                    dot: true,
                    src: [
                        'includes/editor.hbs'
                    ]
                }]
            }
        },
        watch: {
            css: {
                files: ['<%= paths.css.src %>/*.styl'],
                tasks: ['stylus']
                //, options: {
                //    livereload: true
                //}
            },
            js: {
                files: ['<%= paths.js.src %>/*.js'],
                tasks: ['js']
                //, options: {
                //    livereload: true
                //}
            }
        },
        uglify: {
            all: {
                files: {
                    '<%= paths.js.dest %>/main.js': [
                        'bower_components/jquery-sticky/jquery.sticky.js',
                        '<%= paths.js.src %>/main.js'
                    ],
                    '<%= paths.js.dest %>/editor.js': ['<%= config.editorSrc.dest %>/js/cssg.js']
                }
            }
        },
        stylus: {
            all: {
                options: {
                    use: [
                        function() { return require('autoprefixer-stylus')({
                            browsers: ['last 2 versions']
                        }); }
                    ]
                },
                files: {
                    'public/assets/css/main.css': [
                        '<%= paths.css.vendor %>/*.css',
                        '<%= config.editorSrc.dest %>/css/*.css',
                        '<%= paths.css.src %>/core.styl',
                        '<%= paths.css.src %>/page.styl',
                        '<%= paths.css.src %>/print.styl'
                    ]
                }
                //files: [{
                //    expand: true,
                //    cwd: '<%= paths.css.src %>',
                //    src: '*.styl',
                //    dest: '<%= paths.css.dest %>',
                //    ext: '.css'
                //}]
            }
        },
        browserSync: {
            bsFiles: {
                src : [
                    '<%= paths.css.dest %>/*.css'
                    ]
            },
            options: {
                watchTask: true,
                server: {
                    baseDir: "./public"
                }
            }
        },
        // clone cssg repo
        gitclone: {
            cssg: {
                options: {
                    repository: '<%= config.cssgSrc.src %>',
                    branch: 'master',
                    directory: '<%= config.cssgSrc.dest %>'
                }
            },
            editor: {
                options: {
                    repository: '<%= config.editorSrc.src %>',
                    branch: 'master',
                    directory: '<%= config.editorSrc.dest %>'
                }
            }
        },
        // refresh repo
        gitpull: {
            cssg: {
                options: {
                    cwd : '<%= config.cssgSrc.dest %>'
                }
            }            ,
            editor: {
                options: {
                    cwd : '<%= config.editorSrc.dest %>'
                }
            }
        },
        // assemble task
        assemble: {
            options: {
                assets: 'public/assets',
                //plugins: ['markdown-data'],
                partials: ['includes/**/*.hbs'],
                helpers: [
                    'handlebars-helpers',
                    'handlebars-helper-include'
                ],
                layoutdir: 'layouts',
                data: ['data/*.{json,yml}'],
                flatten: true,
                marked: {
                    pedantic: true,
                    sanitize: false,
                    tables: false
                }
            },
            //core: {
            //    options: {
            //        layout: 'default.hbs'
            //    },
            //    src: ['templates/*.hbs'],
            //    dest: './public/'
            //},
            //docs: {
            //    options: {
            //        layout: 'docs.hbs'
            //    },
            //    files: {
            //        './public/docs/': ['__docs/*.md']
            //    }
            //},
            site: {
                options: {
                    layout: 'default.hbs',
                    // tricky markdown conversion
                    includes: ['cssg/*.md']
                },
                files: [
                    // common layout
                    {
                        expand: true,
                        cwd: 'templates',
                        src: ['*.hbs'],
                        dest: './public/',
                        ext: '.html'
                    },
                    // *.md files from github
                    {
                        expand: true,
                        cwd: '<%= config.cssgSrc.dest %>',
                        src: ['*.md'],
                        dest: './public/docs/',
                        ext: '.html'
                    }
                ]
            }
        }

    });

    //
    // TASKS
    //

    //
    // partial commands

    grunt.registerTask('img', [
        'clean:img',
        'copy:img',
        'copy:favicon'
    ]);

    grunt.registerTask('css', [
        'clean:css',
        'stylus'
    ]);

    grunt.registerTask('js', [
        'clean:js',
        'copy:jsBower',
        'uglify'
    ]);

    //
    // fetch resources

    // cssg
    grunt.registerTask('cssg', function(){
        if(!grunt.file.exists(grunt.config.get('config').cssgSrc.dest)){
            grunt.log.write('No CSSG repo detected, running git clone...');
            grunt.task.run(['gitclone:cssg']);
        } else {
            grunt.log.write('CSSG repo detected OK, pulling data...');
            grunt.task.run(['gitpull:cssg']);
        }
    });

    // editor
    grunt.registerTask('editor', function(){
        if(!grunt.file.exists(grunt.config.get('config').editorSrc.dest)){
            grunt.log.write('No CSSG editor repo detected, running git clone...');
            grunt.task.run(['gitclone:editor']);
        } else {
            grunt.log.write('CSSG editor repo detected OK, pulling data...');
            grunt.task.run(['gitpull:editor']);
        }
    });

    //
    // editor manipulation
    grunt.registerTask('editorReplace', function(){
        var htmlString = grunt.file.read('includes/editor.hbs');
        var parsedHTML = $.load(htmlString);
        var newHTML = '<div class="cssg-converter-container">' + parsedHTML('.cssg-converter-container').html() + '</div>';
        grunt.file.write('includes/editor.hbs', newHTML);
    });

    grunt.registerTask('editorTpl', [
        'clean:editorTpl',
        'copy:editorTpl',
        'editorReplace'
    ]);

    //
    // compositions

    grunt.registerTask('static', [
        'css',
        'img',
        'js'
    ]);

    grunt.registerTask('tpl', [
        'clean:html',
        'editorTpl',
        'assemble'
    ]);


    //
    // build site

    grunt.registerTask('build', function(){
        var fetch = grunt.option('fetch');
        if(fetch){
            grunt.task.run([
                'cssg',
                'editor',
                'static',
                'tpl'
            ]);
        } else {
            grunt.task.run([
                'static',
                'tpl'
            ]);
        }
    });

    //
    // developing tasks

    grunt.registerTask('dev', [
        'css', 'js',
        'browserSync',
        'watch'
    ]);

    grunt.registerTask('dev-css', [
        'css',
        'browserSync',
        'watch:css'
    ]);

};