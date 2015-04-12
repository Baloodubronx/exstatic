'use strict';

var Feedback = require('./feedback.model');
var log = require('../../log/log.controller');

exports.index = function(req, res) {
  Feedback.find({}, function(err, feedback) {
    if(err) return handleError(res, err);
    res.status(200).json(feedback);
  });
};


// Create a new helper
exports.create = function (req, res) {
  var newFeedback = new Feedback(req.body.message);
  newFeedback.save(function(err) {
    if (err) return handleError(res, err);
    res.json(200);
  });
};


// Destroy helper
exports.destroy = function(req, res) {
  Feedback.findByIdAndRemove(req.params.id, function(err) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

function handleError(res, err) {
  log.addLogEntry('Error', err);
  return res.send(500, err);
}
