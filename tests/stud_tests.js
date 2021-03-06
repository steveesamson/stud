var expect = require('chai').expect,
    should = require('chai').should(),
    data = {name: 'steve', age: 23, location: 'US'},
    tmpl = "<td class='{name}'> {name} - {age} some of them are useful at location {location} as specified in the docs.</td>",
    shouldRender = "<td class='steve'> steve - 23 some of them are useful at location US as specified in the docs.</td>",
    stud = null, compiledTmpl = null;

describe("Stud", function () {

    before(function (done) {
        stud = require('../dist/stud');
        global.stud = stud;
        done();
    });

    describe("Checks to ensure Stud was loaded", function () {

        it("Expect stud to be defined", function () {
            expect(stud).to.be.defined;
        });

        it("Expect stud.compile to be defined", function () {
            expect(stud.compile).to.be.defined;
        });

        it("Expect stud.render to be defined", function () {
            expect(stud.render).to.be.defined;
        });

    });

    describe(".compile to compile templates with Stud", function () {

        it("Expect compiledTmpl to be null", function () {
            expect(compiledTmpl).to.be.equal(null);
        });

        it("Expect compiledTmpl not to be null", function () {
            compiledTmpl = stud.compile(tmpl, "test_template.stud");

            expect(compiledTmpl).not.to.be.equal(null);
        });

    });

    describe(".isRegistered to check if a template was registered with Stud", function () {

        it("Expect stud.isRegistered('test_template.stud') to be false", function () {
            expect(stud.isRegistered('test_template.stud')).to.be.equal(false);
        });

        it("Expect stud.isRegistered('test_template.stud') to be true", function () {
            eval(compiledTmpl);
            expect(stud.isRegistered('test_template.stud')).to.be.equal(true);
        });

    });

    describe(".render to render template with Stud", function () {

        it("Expect res to be equal to shouldRender", function (done) {
            stud.render('test_template.stud', data, function (e, res) {

                expect(res).to.be.equal(shouldRender);
                done();
            });

        });

    });

    describe(".__express for use as express view engine", function () {

        it("Expect res to be equal to shouldRender", function (done) {
            stud.__express(__dirname + '/user.stud', data, function (e, res) {
                if (e) {
                    console.log(e.toString());

                    //done();
                }
                expect(res).to.be.equal(shouldRender);
                done();


            });

        });

    });

    describe(".template to render string with data", function () {

        it("Expect res to be equal to shouldRender", function (done) {
            stud.template(tmpl, data, function (e, res) {
                if (e) {
                    console.log(e.toString());
                }
                expect(res).to.be.equal(shouldRender);
                done();
            });

        });

    });


});