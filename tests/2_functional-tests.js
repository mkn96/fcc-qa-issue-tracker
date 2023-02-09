const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
var mongoose = require('mongoose');

chai.use(chaiHttp);

//new ID
const newMongooseID = new mongoose.Types.ObjectId();
//existing ID
let testID;

// POST, GET, PUT, DELETE tests
suite('Functional Tests', function() {
// POST tests
    suite('POST request to /api/issues/{project}', function() {
        // 1. Create an issue with every field: POST request to /api/issues/{project}
        test('post an issue with every field', function(done) {
            chai.request(server)
            .post('/api/issues/apitest')
            .send({
                issue_title: 'Test issue',
                issue_text: 'chai testing body test',
                created_by: 'chai tester',
                assigned_to: 'apitest',
                status_text: 'test stage'
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, 'Test issue');
                assert.equal(res.body.issue_text, 'chai testing body test');
                assert.equal(res.body.created_by, 'chai tester');
                assert.equal(res.body.assigned_to, 'apitest');
                assert.equal(res.body.status_text, 'test stage');
                assert.equal(res.body.open,true);
                testID = res.body._id;
                done();
              });
        });
        // 2. Create an issue with only required fields: POST request to /api/issues/{project}
        test('post an issue with only required fields', function(done) {
            chai.request(server)
            .post('/api/issues/apitest')
            .send({
                issue_title: 'Test issue',
                issue_text: 'chai testing body test',
                created_by: 'chai tester',
                assigned_to: '',
                status_text: ''
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.issue_title, 'Test issue');
                assert.equal(res.body.issue_text, 'chai testing body test');
                assert.equal(res.body.created_by, 'chai tester');
                assert.equal(res.body.assigned_to, '');
                assert.equal(res.body.status_text, '');
                assert.property(res.body, 'created_on');
                assert.property(res.body, 'updated_on');
                assert.property(res.body, '_id');
                done();
              });
        });
        // 3. Create an issue with missing required fields: POST request to /api/issues/{project}
        test('post an issue with missing required fields', function(done) {
            chai.request(server)
            .post('/api/issues/apitest')
            .send({
                issue_title: '',
                issue_text: 'chai testing body test',
                created_by: 'chai tester',
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'required field(s) missing');
                done();
              });
        });
    });
// GET tests
    suite('GET request to /api/issues/{project}', function(){
        // 4. View issues on a project: GET request to /api/issues/{project}
        test('View issues on a project', function(done){
            chai.request(server)
            .get('/api/issues/apitest')
            .end(function(err, res){
                assert.equal(res.status, 200)
                assert.isArray(res.body)
            done();
            });
        });
        // 5. View issues on a project with one filter: GET request to /api/issues/{project}
        test('View issues on a project with one filter', function(done){
            chai.request(server)
            .get('/api/issues/apitest')
            .query({open: true})
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                done();
            });
        });
        // 6. View issues on a project with multiple filters: GET request to /api/issues/{project}
        test('View issues on a project with multiple filters', function(done){
            chai.request(server)
            .get('/api/issues/apitest')
            .query({
                open: true,
                issue_title: 'Test issue'
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                done();
            });
        });
    });
// UPDATE tests
    suite('PUT request to /api/issues/{project}', function(){
        // 7. Update one field on an issue: PUT request to /api/issues/{project}
        test('Update one field on an issue', function(done){
            chai.request(server)
            .put('/api/issues/apitest')
            .send({
                _id: testID,
                issue_title: " ONE UPDATED FIELD ON AN ISSUE"
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.result,'successfully updated');
                assert.equal(res.body._id, testID);
                done();
            });
        });
        // 8. Update multiple fields on an issue: PUT request to /api/issues/{project}
        test('Update multiple fields on an issue', function(done){
            chai.request(server)
            .put('/api/issues/apitest')
            .send({
                _id: testID,
                issue_title: "MULTIPLE FIELDS UPDATED",
                issue_text: 'MULTIPLE FIELDS UPDATED',
                created_by: 'MULTIPLE FIELDS UPDATED'
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.result,'successfully updated');
                assert.equal(res.body._id, testID);
                done();
            });
        });
        // 9. Update an issue with missing _id: PUT request to /api/issues/{project}
        test('Update an issue with missing _id', function(done){
            chai.request(server)
            .put('/api/issues/apitest')
            .send({
                issue_title: "MULTIPLE FIELDS UPDATED",
                issue_text: 'MULTIPLE FIELDS UPDATED',
                created_by: 'MULTIPLE FIELDS UPDATED'
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'missing _id');
                done();
            });
        });
        // 10. Update an issue with no fields to update: PUT request to /api/issues/{project}
        test('Update an issue with no fields to update', function(done){
            chai.request(server)
            .put('/api/issues/apites')
            .send({_id: testID})
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'no update field(s) sent')
                done();
            });
        });
        // 11. Update an issue with an invalid _id: PUT request to /api/issues/{project}
        test('Update an issue with an invalid _id', function(done){
            chai.request(server)
            .put('/api/issues/apitest')
            .send({
                _id: newMongooseID,
                issue_title: "MULTIPLE FIELDS UPDATED",
                issue_text: 'MULTIPLE FIELDS UPDATED',
                created_by: 'MULTIPLE FIELDS UPDATED'
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'could not update')
                done();
            });
        });
    });
// DELETE tests
    suite('DELETE request to /api/issues/{project}', function(){
        // 12. Delete an issue: DELETE request to /api/issues/{project}
        test('Delete an issue', function(done){
            chai.request(server)
            .delete('/api/issues/apitest')
            .send({_id: testID,})
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully deleted');
                done();
            });
        });
        // 13. Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
        test('Delete an issue with an invalid _id', function(done){
            chai.request(server)
            .delete('/api/issues/apitest')
            .send({_id: newMongooseID})
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'could not delete');
                done();
            });
        });
        // 14. Delete an issue with missing _id: DELETE request to /api/issues/{project}
        test('Delete an issue with missing _id', function(done){
            chai.request(server)
            .delete('/api/issues/apitest')
            .send({})
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'missing _id');
                done();
            });
        });
    });
});
