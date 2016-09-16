from app import *
from app.model.models import *
from app.model.schema import *
from app.controller.printer.getprinter import *
from sqlalchemy.exc import IntegrityError



@app.route("/api/get/users")
def get_users():
    users = User.query.all()
    result = users_schema.dump(users)
    return jsonify({"users":result.data})

@app.route("/api/get/users/<int:id>")
def get_user(id):
    try:
        user = User.query.get(id)
    except IntegrityError:
        return jsonify({"message": "User could not be found"}), 400

    result = user_schema.dump(user)
    return jsonify({"user":result.data})

@app.route("/api/get/business")
def get_businesses():
    businesses = Business.query.all()
    result = businesses_schema.dump(businesses)
    return jsonify({"Businesses":result.data})

@app.route("/api/get/business/<int:id>")
def get_business(id):
    business = Business.query.get(id)
    result = business_schema.dump(business)
    return jsonify({"Business":result.data})

@app.route("/api/get/printers/<int:business_id>")
def get_printers(business_id):
    printers = Printer.query.filter_by(business_id = business_id)
    result = printers_schema.dump(printers)
    return jsonify({"printers":result.data})


@app.route("/api/get/printer/<int:id>")
def get_printer(id):
    printer = Printer.query.get(id)
    result = printer_schema.dump(printer)
    return jsonify({"printer":result.data})

@app.route("/api/get/printer/options")
def get_printer_option():
    list_printer = get_printer_list()
    return jsonify(list_printer)

@app.route("/api/get/tonners/<int:business_id>")
def get_tonners(business_id):
    tonners = Tonner.query.filter_by(business_id = business_id)
    result = tonners_schema.dump(tonners)
    return jsonify({"tonners":result.data})

@app.route("/api/get/tonner/<int:id>")
def get_tonner(id):
    tonner =  Tonner.query.get(id)
    result = tonner_schema.dump(tonner)
    return  jsonify({"tonner":result.data})

@app.route("/api/get/paper/size")
def get_size():
    size = PaperSize.query.all()
    result = papers_size_schema.dump(size)
    return jsonify({"Paper_size":result.data})

@app.route("/api/get/paper/type")
def get_type():
    type = PaperType.query.all()
    result = papers_type_schema.dump(type)
    return jsonify({'Paper_type':result.data})

@app.route("/api/login/")
def login():
    pass