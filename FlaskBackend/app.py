from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import requests
import os
from io import BytesIO

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ai_models.db'
db = SQLAlchemy(app)

# AI Model Database Schema
class AIModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    ai_type = db.Column(db.String(50), nullable=False)
    api_uri = db.Column(db.String(100), nullable=False)
    response_keys = db.Column(db.String(50), nullable=False)
    regression_params = db.Column(db.String(50), nullable=True)

# Initialize the DB
with app.app_context():
    db.create_all()

# Filter response keys
def filter_response(response_json, response_keys):
    filtered_response = {key: response_json.get(key) for key in response_keys}
    return filtered_response

# Route to add a new model
@app.route('/add_model', methods=['POST'])
def add_model():
    data = request.get_json()
    regression_params = data.get('regression_params', [])
    new_model = AIModel(
        name=data['name'],
        description=data['description'],
        ai_type=data['ai_type'],
        api_uri=data['api_uri'],
        response_keys=','.join(data['response_keys']),
        regression_params=','.join(regression_params) if regression_params else ''
    )
    db.session.add(new_model)
    db.session.commit()
    return jsonify({"message": "Model added successfully!"})

@app.route('/predict/<int:model_id>', methods=['POST'])
def predict(model_id):
    model = AIModel.query.get(model_id)
    if not model:
        return jsonify({"message": "Model not found!"}), 404

    # รับไฟล์จาก request (ทั้งภาพและวิดีโอ)
    file = request.files['file']


    file_bytes = file.read()

    response = requests.post(model.api_uri, files={'file': ('file', file_bytes, file.content_type)})

    if response.status_code != 200:
        return jsonify({"message": "Error from AI service"}), response.status_code

    try:
        response_json = response.json()
        response_keys = model.response_keys.split(',')
        filtered_response = filter_response(response_json, response_keys)
        regression_params = response_json.get(model.regression_params)  # ใช้ regression_params จาก model

        print("Filtered Response:", filtered_response)
        print("Regression Params:", regression_params)  # ตรวจสอบค่าที่ถูกส่ง

        return jsonify({
            "prediction": filtered_response,
            "regression_params": regression_params,
            "ai_type": model.ai_type
        })
    except requests.exceptions.JSONDecodeError:
        response_bytes = BytesIO(response.content)
        return send_file(response_bytes, mimetype='image/jpeg')


if __name__ == '__main__':
    app.run(debug=True, port=5000)
