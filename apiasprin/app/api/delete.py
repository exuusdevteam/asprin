from flask import jsonify, request
from app import *
from app.model.models import *
from app.model.schema import *
from app.controller.printer.getprinter import *
from app.controller.app.getusername import *


@app.route("/api/delete/user/<int:id>/", methods=["DELETE"])
def delete_user(id):
    try:
        User.query.filter_by(user_id = id).delete()
        db.session.commit()
        return jsonify({'Message':'1'})
    except:
        return jsonify({'Message':'0'})

@app.route("/api/delete/business/<int:id>/", methods=["DELETE"])
def delete_business(id):
    try:
        Business.query.filter_by(business_id = id).delete()
        db.session.commit()
        return jsonify({'Message':'1'})
    except:
        return jsonify({'Message':'0'})


@app.route("/api/delete/printer/<int:id>/", methods=['DELETE'])
def delete_printer(id):
    try:
        Printer.query.filter_by(printer_id = id).delete()
        db.commit()
        return jsonify({'Message':'1'})
    except:
        return jsonify({'Message':'0'})

@app.route("/api/delete/printjob/<int:id>", methods=['DELETE'])
def delete_printjob(id):
    try:
        PrinterJob.query.filter_by(printer_job_id = id)
        db.session.commit()
        return jsonify({'Message':'1'})
    except:
        return jsonify({'Message':'0'})
    






