from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = Flask(__name__)

CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['JWT_SECRET_KEY'] = 'secretkey'

db = SQLAlchemy(app)
jwt = JWTManager(app)

# ---------------- MODELS ---------------- #

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(200))
    role = db.Column(db.String(20))

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    status = db.Column(db.String(50))
    due_date = db.Column(db.String(50))
    assigned_to = db.Column(db.Integer)

# ---------------- AUTH ---------------- #

@app.route('/signup', methods=['POST'])
def signup():

    data = request.json

    hashed = generate_password_hash(data['password'])

    user = User(
        username=data['username'],
        password=hashed,
        role=data['role']
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User created successfully"
    })

@app.route('/login', methods=['POST'])
def login():

    data = request.json

    user = User.query.filter_by(
        username=data['username']
    ).first()

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    if check_password_hash(user.password, data['password']):

        token = create_access_token(
            identity=str(user.id)
        )

        return jsonify({
            "token": token,
            "role": user.role
        })

    return jsonify({
        "message": "Invalid password"
    }), 401

# ---------------- PROJECTS ---------------- #

@app.route('/projects', methods=['POST'])
@jwt_required()
def create_project():

    data = request.json

    project = Project(
        name=data['name']
    )

    db.session.add(project)
    db.session.commit()

    return jsonify({
        "message": "Project created successfully"
    })

@app.route('/projects', methods=['GET'])
@jwt_required()
def get_projects():

    projects = Project.query.all()

    result = []

    for p in projects:
        result.append({
            "id": p.id,
            "name": p.name
        })

    return jsonify(result)

# ---------------- TASKS ---------------- #

@app.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():

    data = request.json

    task = Task(
        title=data['title'],
        status="Pending",
        due_date=data['due_date'],
        assigned_to=data['assigned_to']
    )

    db.session.add(task)
    db.session.commit()

    return jsonify({
        "message": "Task created successfully"
    })

@app.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():

    tasks = Task.query.all()

    result = []

    for t in tasks:
        result.append({
            "id": t.id,
            "title": t.title,
            "status": t.status,
            "due_date": t.due_date,
            "assigned_to": t.assigned_to
        })

    return jsonify(result)

@app.route('/tasks/<int:id>', methods=['PUT'])
@jwt_required()
def update_task(id):

    task = Task.query.get(id)

    data = request.json

    task.status = data['status']

    db.session.commit()

    return jsonify({
        "message": "Task updated successfully"
    })

# ---------------- DASHBOARD ---------------- #

@app.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():

    total = Task.query.count()

    completed = Task.query.filter_by(
        status="Completed"
    ).count()

    pending = Task.query.filter_by(
        status="Pending"
    ).count()

    overdue = 0

    tasks = Task.query.all()

    for task in tasks:

        due = datetime.strptime(
            task.due_date,
            "%Y-%m-%d"
        )

        if due < datetime.now() and task.status != "Completed":
            overdue += 1

    return jsonify({
        "total_tasks": total,
        "completed": completed,
        "pending": pending,
        "overdue": overdue
    })

# ---------------- RUN ---------------- #

if __name__ == '__main__':

    with app.app_context():
        db.create_all()

    app.run(debug=True)