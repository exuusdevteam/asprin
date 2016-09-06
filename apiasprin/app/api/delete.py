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

