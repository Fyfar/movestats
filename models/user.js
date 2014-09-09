/**
 * Created by Fyfar on 27.08.2014.
 */
var mongoose = require('../lib/mongoose'),
    Schema = mongoose.Schema;

var schemaUser = new Schema({
    user_id: String,
    first_date: Number,
    current_time_zone: {
        id: String,
        offset: Number
    },
    localization: {
        language: String,
        locale: String,
        first_week_day: Number,
        metric: Boolean
    },
    calories_available: Boolean,
    platform: String
});

var schemaToken = new Schema({
    user_id: String,
    access_token: String,
    refresh_token: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});

exports.User = mongoose.model("User", schemaUser);
exports.Token = mongoose.model("Token", schemaToken);