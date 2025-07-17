from models.location import Location
from services.extensions import db
from datetime import datetime


class LocationService:

    @staticmethod
    def get_all_locations():
        locations = Location.query.filter_by(deleted_at=None).all()
        return [location.to_dict() for location in locations]

    @staticmethod
    def create_location(data):
        location = Location(
            county=data['county'],
            office=data['office'],
            created_by=data['created_by']
        )
        db.session.add(location)
        db.session.commit()
        return location.to_dict()

    @staticmethod
    def soft_delete_location(location_id):
        location = Location.query.get(location_id)
        if not location or location.deleted_at is not None:
            return {"message": "Location not found or already deleted"}, 404

        location.deleted_at = datetime.utcnow()
        db.session.commit()
        return {"message": "Location soft-deleted"}, 200
