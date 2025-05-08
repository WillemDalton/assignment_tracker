import os
from .utils import *

def rebuild_tables():
    exec_sql_file('sql/schema.sql')

def get(key_id):
    return exec_get_all('SELECT * FROM assignments WHERE id = %(id)s;', {"id" : key_id})

def get_all(session_id):
    return exec_get_all('SELECT * FROM assignments WHERE session_id = %(id)s;', {"id" : session_id})

def add(name, description, assignment_class, due_date, session_id):
    exec_commit("""
            INSERT INTO assignments (name, description, class, due_date, session_id)
            VALUES (%(name)s, %(description)s, %(class)s, %(due_date)s, %(session_id)s);""",
            {"name" : name, "description" : description, "class" : assignment_class, "due_date" : due_date, "session_id" : session_id})
    
def put(id, name, description, assignment_class, due_date):
    exec_commit("""
            UPDATE assignments (name, description, class, due_date) SET
                name = %(name)s, 
                description =%(description)s, 
                class = %(class)s, 
                due_date = %(due_date)s)
            WHERE
                id=%(id)s;""",
            {"id" : id, "name" : name, "description" : description, "class" : assignment_class, "due_date" : due_date })
    return get(id)
    
def delete(id):
    exec_commit('DELETE FROM assignments WHERE id = %(id)s;', {"id" : id})
