from flask import jsonify, request
from app import *
from app.model.models import *
from app.model.schema import *
from app.controller.printer.getprinter import *
from app.controller.app.getusername import *


@app.route("/api/put/user/<int:id>/", methods=["PUT"])
def put_user(id):
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message':'No input data provided'})


    names = json_data['names']
    username = json_data['username']
    email = json_data['email']
    phone = json_data['phone']
    user_type = json_data['user_type']
    user_role = json_data['user_role']
    password = json_data['password']
    business_id = json_data['business_id']



    try:
        user = User.query.filter_by(user_id = id).first()

        user.names = names
        user.username = username
        user.email = email
        user.phone = phone
        user.user_type  = user_type
        user.user_role = user_role
        user.password = password
        user.business_id = business_id

        db.session.commit()

        return jsonify({'Message':'1'})

    except:
        return jsonify({'Message':'0'})


@app.route("/api/put/business/<int:id>/", methods=["PUT"])
def put_business(id):
    json_data = request.get_json()
    if not  json_data:
        return jsonify({'message':'no input data provided'})

    name =  json_data['name']
    email = json_data['email']
    phone = json_data['phone']
    category = json_data['category']
    lat = json_data['lat']
    lon = json_data['lon']
    address = json_data['address']
    web = json_data['web']
    logo = json_data['logo']

    try:
        business = Business.query.filter_by(business_id = id).first()

        business.name = name
        business.email = email
        business.phone = phone
        business.category = category
        business.lat = lat
        business.lon = lon
        business.address = address
        business.web = web
        business.logo = logo

        db.session.commit()
        return jsonify({'Message':'1'})

    except:
        return jsonify({'Message':'0'})







