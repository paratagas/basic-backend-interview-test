var mongoose = require('mongoose');

var NeoSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    reference: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    speed: { // KmH
        type: Number,
        required: true
    },
    isHazardous: {
        type: Boolean,
        required: true
    }
});

mongoose.model('Neo', NeoSchema);
