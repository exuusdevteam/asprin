from app import *
from ..model.models import *
from ..model.schema import *
from ..controller.printer.unix.getprinter import *
from ..controller.app.printjob import printJobBusiness
from ..controller.app.userdate import userdate, usersdate
#from sqlalchemy.exc import IntegrityError




@app.route("/api/v1/users")
def get_users():
    users = User.query.all()
    result = users_schema.dump(users).data
    json = usersdate(result)
    return jsonify({'users':json})

@app.route("/api/v1/user/<int:id>")
def get_user(id):
    user = User.query.get(id)
    if user is None:
        return jsonify({"message": "User could not be found"}), 400

    else:
        result = user_schema.dump(user).data
        json = userdate(result)
        return jsonify({"user": json})


@app.route("/api/v1/business")
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

@app.route("/api/v1/printer/options")
def get_printer_option():
    list_printer = get_printer_list()
    return jsonify({"printers":list_printer})

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

@app.route("/api/v1/printjobs")
def printjobs():
    print_jobs = PrinterJob.query.all()
    result = printers_job_schema.dump(print_jobs).data
    return jsonify({'PrintJob':result})



@app.route("/api/v1/printjobs/user/<int:id>")
def printjobs_user(id):
    print_jobs = PrinterJob.query.filter_by(user_id=id).order_by(PrinterJob.regDate.desc())
    result = printers_job_schema.dump(print_jobs).data

    json = printJobBusiness(result)

    return jsonify(json)

@app.route("/api/v1/printjobs/business/<int:id>")
def printjobs_business(id):
    print_jobs = PrinterJob.query.filter_by(business_id = id).order_by(PrinterJob.regDate.desc())
    result = printers_job_schema.dump(print_jobs).data

    json = printJobBusiness(result)

    return jsonify(json)

