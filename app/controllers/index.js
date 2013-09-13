/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('underscore');


exports.render = function(req, res) {
    res.setHeader('Cache-Control', 'public, max-age=0');
    res.render('index', {
        user: req.user ? JSON.stringify(req.user) : "null"
    });
};