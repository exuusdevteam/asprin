from flask import jsonify, request
from app import *
from app.model.models import *
from app.model.schema import *
from app.controller.printer.getprinter import *
from app.controller.app.getusername import *


@app.route("/api/put/user/<int:id>/", methods=["PUT"])
def put_user(id):
    json_data = request.get_json()
    if not  json_data:
        return jsonify({'message':'No input data provided'})


    names = json_data['names']
    username = json_data['username']
    email = json_data['email']
    phone = json_data['phone']
    user_type = json_data['user_type']
    password = json_data['password']
    business_id = json_data['business_id']



    try:
        user = User.query.filter_by(user_id = id).first()

        user.names = names
        user.username = username
        user.email = email
        user.phone = phone
        user.user_type  = user_type
        user.password = password
        user.business_id = business_id

        db.session.commit()

        return jsonify({'Message':'1'})

    except:
        return jsonify({'Message':'0'})


@app.route("/api/put/business/<int:id>/", methods=["PUT"])
def put_business(id):
    




