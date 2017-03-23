/* jslint node: true */

'use strict';

var db = require('../../database');
var batch = require('../../batch');

var async = require('async');

module.exports = {
	name: 'Update moderation notes to zset',
	timestamp: Date.UTC(2017, 2, 22),
	method: function (callback) {
		batch.processSortedSet('users:joindate', function (ids, next) {
			async.each(ids, function (uid, next) {
				db.getObjectField('user:' + uid, 'moderationNote', function (err, moderationNote) {
					if (err || !moderationNote) {
						return next(err);
					}
					var note = {
						uid: 1,
						note: moderationNote,
						timestamp: Date.now(),
					};
					db.sortedSetAdd('uid:' + uid + ':moderation:notes', note.timestamp, JSON.stringify(note), next);
				});
			}, next);
		}, callback);
	},
};
