from flask import jsonify
from app import app
from app.model.models import *
from sqlalchemy.exc import IntegrityError



@app.route("/api/users")
def get_users():
    users = User.query.all()
    result = users_schema.dump(users)
    return jsonify({"users":result.data})

@app.route("/api/users/<int:id>")
def get_user(id):
    try:
        user = User.query.get(id)
    except IntegrityError:
        return jsonify({"message": "User could not be found"}), 400

    result = user_schema.dump(user)
    return jsonify({"user":result.data})

@app.route("/api/business")
def get_businesses():
    businesses = Business.query.all()
    result = businesses_schema.dump(businesses)
    return jsonify({"Businesses":result.data})

@app.route("/api/business/<int:id>")
def get_business(id):
    business = Business.query.get(id)
    result = business_schema.dump(business)
    return jsonify({"Business":result.data})

@app.route("/api/printers/<int:business_id>")
def get_printers(business_id):
    printers = Printer.query.filter_by(business_id = business_id)
    result = printers_schema.dump(printers)
    return jsonify({"printers":result.data})


@app.route("/api/printer/<int:id>")
def get_printer(id):
    printer = Printer.query.get(id)
    result = printer_schema.dump(printer)
    return jsonify({"printer":result.data})

@app.route("/api/tonners/<int:business_id>")
def get_tonners(business_id):
    tonners = Tonner.query.filter_by(business_id = business_id)
    result = tonners_schema(tonners)
    return jsonify({"tonners":result.data})

@app.route("/api/tonner/<int:id>")
def get_tonner(id):
    tonner =  Tonner.query.get(id)
    result = tonner_schema(tonner)
    return  jsonify({"tonner":result.data})