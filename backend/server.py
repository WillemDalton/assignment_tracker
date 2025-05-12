from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS
from .management import Init, Version
from .db import *

rebuild_tables()

app = Flask(__name__)
api = Api(app)
CORS(app)

class Assignments(Resource):
    def get(self):
        session_id = request.args.get("session_id")
        return get_all(session_id), 200

    def post(self):
        data = request.get_json()
        name = data.get("name")
        description = data.get("description")
        assignment_class = data.get("class")
        due_date = data.get("due_date")
        session_id = data.get("session_id")
        return add(name, description, assignment_class, due_date, session_id), 201
    
    def put(self):
        data = request.get_json()

        id = data.get("id")
        name = data.get("name")
        description = data.get("description")
        assignment_class = data.get("class")
        due_date = data.get("due_date")
        return put(id, name, description, assignment_class, due_date), 201
    
    def delete(self):
        data = request.get_json()
        id = data.get("id")
        delete(id)
        return '', 204


api.add_resource(Init, '/manage/init') #Management API for initializing the DB
api.add_resource(Version, '/manage/version') #Management API for checking DB version
api.add_resource(Assignments, '/assignments') 

if __name__ == '__main__':
    app.run(debug=True)

