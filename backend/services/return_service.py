from models.returns import Returns
from services.extensions import db

class ReturnService:

    @staticmethod
    def get_all():
        return [r.to_dict() for r in Returns.query.all()]

    @staticmethod
    def create(data):
        try:
            return_entry = Returns(
                employee_id=data['employee_id'],
                location_id=data['location_id'],
                return_date=data.get('return_date'),
                quantity=data['quantity']
            )
            db.session.add(return_entry)
            db.session.commit()
            return return_entry.to_dict(), 201
        except KeyError as e:
            return {"message": f"Missing field: {str(e)}"}, 400

    @staticmethod
    def update(return_id, data):
        return_entry = Returns.query.get(return_id)
        if not return_entry:
            return {"message": "Return not found"}, 404

        return_entry.employee_id = data.get('employee_id', return_entry.employee_id)
        return_entry.location_id = data.get('location_id', return_entry.location_id)
        return_entry.return_date = data.get('return_date', return_entry.return_date)
        return_entry.quantity = data.get('quantity', return_entry.quantity)

        db.session.commit()
        return return_entry.to_dict(), 200

    @staticmethod
    def delete(return_id):
        return_entry = Returns.query.get(return_id)
        if not return_entry:
            return {"message": "Return not found"}, 404

        db.session.delete(return_entry)
        db.session.commit()
        return {"message": "Return deleted"}, 200
