import os
from utils import *

def rebuild_tables():
    exec_sql_file('sql/schema.sql')

def test_get():
    return exec_get_all('SELECT * FROM test')