from flask_restful import Resource, reqparse, request

from utils import *
from db import rebuild_tables

class Init(Resource):
    def post(self):
        rebuild_tables()

class Version(Resource):
    def get(self):
        return (exec_get_one('SELECT VERSION()'))