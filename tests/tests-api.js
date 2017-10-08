// to run manually: mocha -u tdd -R spec tests/tests-api.js
var express = require('express');
var router = express.Router();
var expect = require('chai').expect;
var rest = require('restler');
var appSettings = require('../settings');

var baseAppUrl = appSettings.appHost + ":" + appSettings.appRort;

/**
 * App API tests suite
 *
 * @param {string} Message
 * @param {callback}
 */
suite('App tests', function() {
    this.timeout(30000);

    test('Home page should return an object and should contain "hello" property', function(done) {
        rest.get(baseAppUrl)
            .on('success', function(data) {
                expect(data instanceof Object);
                expect(data.hello !== "");
                done();
            })
            .on('error', function() {
                expect(false, 'Home page error');
            });
    });

    test('Hazardous page should return an array, and should contain at least 1 element', function(done) {
        rest.get(baseAppUrl + "/neo/hazardous")
            .on('success', function(data) {
                expect(data instanceof Array);
                expect(data.length > 0);
                done();
            })
            .on('error', function() {
                expect(false, 'Hazardous page error');
            });
    });

    test('Fastest page should return an object, and should contain at least properties: reference, name, isHazardous', function(done) {
        rest.get(baseAppUrl + "/neo/fastest?hazardous=true")
            .on('success', function(data) {
                expect(data instanceof Object);
                expect(data.reference !== "");
                expect(data.name !== "");
                expect(typeof data.isHazardous === "boolean");
                done();
            })
            .on('error', function() {
                expect(false, 'Fastest page error');
            });
    });

    test('Best year page should return an object and should contain at least one property', function(done) {
        rest.get(baseAppUrl + "/neo/best-year?hazardous=true")
            .on('success', function(data) {
                expect(data instanceof Object);
                expect(data[Object.keys(data)[0]] > 0);
                done();
            })
            .on('error', function() {
                expect(false, 'Best year page error');
            });
    });

    test('Best month page should return an object and should contain at least one property', function(done) {
        rest.get(baseAppUrl + "/neo/best-month?hazardous=true")
            .on('success', function(data) {
                expect(data instanceof Object);
                expect(data[Object.keys(data)[0]] > 0);
                done();
            })
            .on('error', function() {
                expect(false, 'Best month page error');
            });
    });
});
