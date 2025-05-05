from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_cors import CORS
from management import Init, Version
from db import *

app = Flask(__name__)
api = Api(app)
CORS(app, origins=["http://localhost:5173"])

class HelloWorld(Resource):
    def get(self):
        return  test_get()

api.add_resource(Init, '/manage/init') #Management API for initializing the DB
api.add_resource(Version, '/manage/version') #Management API for checking DB version
api.add_resource(HelloWorld, '/') 

if __name__ == '__main__':
    app.run(debug=True)

