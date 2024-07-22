from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

import requests

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ai_models.db'
db = SQLAlchemy(app)

# Save to db
class AIModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    api_uri = db.Column(db.String(100), nullable=False)
    response_keys = db.Column(db.String(200), nullable=False)

with app.app_context():
    db.create_all()

# Route to add AI model
@app.route('/add_model', methods=['POST'])
def add_model():
    data = request.get_json()
    new_model = AIModel(
        name=data['name'],
        description=data['description'],
        api_uri=data['api_uri'],
        response_keys=','.join(data['response_keys'])
    )
    db.session.add(new_model)
    db.session.commit()
    return jsonify({"message": "Model added successfully!"})

# Helper function to filter AI response based on response_keys
def filter_response(response_json, response_keys):
    filtered_response = {key: response_json.get(key) for key in response_keys}
    return filtered_response

# Route to use AI model
@app.route('/predict/<int:model_id>', methods=['POST'])
def predict(model_id):
    model = db.session.get(AIModel, model_id)
    if not model:
        return jsonify({"message": "Model not found!"}), 404

    file = request.files['file']
    img_bytes = file.read()

    response = requests.post(model.api_uri, files={'file': img_bytes})
    
    if response.status_code != 200:
        return jsonify({"message": "Error from AI service"}), response.status_code

    response_json = response.json()
    response_keys = model.response_keys.split(',')
    filtered_response = filter_response(response_json, response_keys)

    return jsonify(filtered_response)

if __name__ == '__main__':
    app.run(debug=True)
