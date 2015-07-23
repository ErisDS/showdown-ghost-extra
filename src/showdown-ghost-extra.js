/* jshint node:true, browser:true */

// Ghost Image Preview
//
// Manages the conversion of image markdown `![]()` from markdown into the HTML image preview
// This provides a dropzone and other interface elements for adding images
// Is only used in the admin client.
(function (extension) {
  'use strict';

  var extName = 'showdown-ghost-extra';

  if (typeof showdown === 'object') {
    // global (browser or nodejs global)
    showdown.extension(extName, extension());
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(extName, extension());
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = extension();
  } else {
    // showdown was not found so we throw
    throw Error('Could not find showdown library');
  }

}(function() {

  var ESCAPE_CHAR = '¨';

  return [
    // Multiple underscores
    // keep 4 or more inline underscores e.g. Ghost rocks my _____!
    // currently fails on:
    //  - reference style urls and imgs
    //  - code blocks
    {
      type: 'lang',
      regex: /([^_\n\r])(_{4,})/g,
      replace: function (match, prefix, underscores) {
        return prefix + underscores.replace(/_/g, '\\_');
      }
    },
    // Handle escaped tildes
    // HTML extension = happens AFTER showdown
    // NOTE: showdown replaces "~" with "~T", and this char doesn't get escaped properly.
    // This will be moved to core as strikethrough is now supported in options mode
    {
      type: 'html',
      regex: /\\~/g,
      replace: '~'
    }
  ];
}));
