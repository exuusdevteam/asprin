from flask import jsonify, request
from app import *
from ..model.models import *



@app.route("/api/v1/user/<int:id>/", methods=["PUT"])
def put_user(id):
    json_data = request.get_json()
    if not json_data:
        return jsonify({'message':'No input data provided'})
    names = json_data['names']
    username = json_data['username']
    gender = json_data['gender']
    dob = json_data['dob']
    job_title = json_data['job_title']

    try:
        user = User.query.filter_by(user_id = id).first()

        user.names = names
        user.username = username
        user.gender = gender
        user.dob = dob
        user.job_title = job_title

        db.session.commit()

        return jsonify({'Message':'1'})

    except:
        return jsonify({'Message':'0'})


@app.route("/api/put/business/<int:id>/", methods=["PUT"])
def put_business(id):
    json_data = request.get_json()
    if not  json_data:
        return jsonify({'message':'no input data provided'})

    name = json_data['name']
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







