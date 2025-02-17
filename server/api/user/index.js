'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/user', controller.names);
router.get('/me/polls', auth.isAuthenticated(), controller.getMyPolls);
router.post('/me/polls', auth.isAuthenticated(), controller.createPoll);
router.put('/me/polls/:id', auth.isAuthenticated(), controller.removePoll);
router.put('/:id', controller.updateVotes);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

module.exports = router;
