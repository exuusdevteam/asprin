from ...model.models import User


def printJobBusiness(json_jobs):
    data = {'PrintJob':[]}
    for item in json_jobs:
        user = User.query.get(item['user_id'])
        item['names'] = user.names
        data['PrintJob'].append(item)
    return data