module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'Kimano117@gmail.com',
                password: <passwordHere>,
                branch: 'default',
                ptr: false
            },
            dist: {
                src: ['*.js']
            }
        }
    });
}