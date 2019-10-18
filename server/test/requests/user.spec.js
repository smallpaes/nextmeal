var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var should = chai.should();
var expect = chai.expect;

var app = require('../../app')
var helpers = require('../../_helpers');
const db = require('../../models')

