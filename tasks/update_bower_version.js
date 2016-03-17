/**
 * keep bower.json version field synchronized with package.json
 */

module.exports = function(grunt) {

  grunt.registerMultiTask('update_bower_version', 'keep bower.json version field synchronized with package.json', function() {
    var bowerJson = grunt.file.readJSON('bower.json'),
      pkg = grunt.file.readJSON('package.json'),
      bowerStr;
    bowerJson.version = pkg.version;

    bowerStr = JSON.stringify(bowerJson, null, 2);
    grunt.file.write('bower.json', bowerStr);
  })
};
