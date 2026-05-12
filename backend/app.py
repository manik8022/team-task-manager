from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required
)
from flask_cors import CORS
from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)
from datetime import datetime
import os

app = Flask(__name__)

CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['JWT_SECRET_KEY'] = 'secretkey'

db = SQLAlchemy(app)
jwt = JWTManager(app)

# ---------------- MODELS ---------------- #

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(
        db.String(100),
        unique=True
    )

    password = db.Column(
        db.String(200)
    )

    role = db.Column(
        db.String(20)
    )

class Task(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(100)
    )

    status = db.Column(
        db.String(50)
    )

    due_date = db.Column(
        db.String(50)
    )

    assigned_to = db.Column(
        db.Integer
    )

# ---------------- HOME ---------------- #

@app.route('/')
def home():

    return jsonify({
        "message": "Backend Running"
    })

# ---------------- SIGNUP ---------------- #

@app.route('/signup', methods=['POST'])
def signup():

    try:

        data = request.json

        existing = User.query.filter_by(
            username=data['username']
        ).first()

        if existing:

            return jsonify({
                "message": "User already exists"
            }), 400

        hashed_password = generate_password_hash(
            data['password']
        )

        user = User(
            username=data['username'],
            password=hashed_password,
            role=data['role']
        )

        db.session.add(user)

        db.session.commit()

        return jsonify({
            "message": "User created successfully"
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# ---------------- LOGIN ---------------- #

@app.route('/login', methods=['POST'])
def login():

    try:

        data = request.json

        user = User.query.filter_by(
            username=data['username']
        ).first()

        if not user:

            return jsonify({
                "message": "User not found"
            }), 404

        if check_password_hash(
            user.password,
            data['password']
        ):

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

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# ---------------- TASKS ---------------- #

@app.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():

    tasks = Task.query.all()

    result = []

    for task in tasks:

        result.append({
            "id": task.id,
            "title": task.title,
            "status": task.status,
            "due_date": task.due_date
        })

    return jsonify(result)

@app.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():

    data = request.json

    task = Task(
        title=data['title'],
        status="Pending",
        due_date=data['due_date'],
        assigned_to=1
    )

    db.session.add(task)

    db.session.commit()

    return jsonify({
        "message": "Task created"
    })

@app.route('/tasks/<int:id>', methods=['PUT'])
@jwt_required()
def update_task(id):

    task = Task.query.get(id)

    if not task:

        return jsonify({
            "message": "Task not found"
        }), 404

    task.status = "Completed"

    db.session.commit()

    return jsonify({
        "message": "Task updated"
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

        try:

            due = datetime.strptime(
                task.due_date,
                "%Y-%m-%d"
            )

            if (
                due < datetime.now()
                and task.status != "Completed"
            ):
                overdue += 1

        except:
            pass

    return jsonify({
        "total_tasks": total,
        "completed": completed,
        "pending": pending,
        "overdue": overdue
    })

# ---------------- RUN ---------------- #

if __name__ == "__main__":

    with app.app_context():
        db.create_all()

    port = int(
        os.environ.get("PORT", 5000)
    )

    app.run(
        host="0.0.0.0",
        port=port
    )