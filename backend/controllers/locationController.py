from flask_restful import Resource
from flask import request
from services.locationService import LocationService


class LocationResource(Resource):
    def get(self):
        locations = LocationService.get_all_locations()
        return {"locations": locations}, 200

    def post(self):
        data = request.get_json()
        county = data.get("county")
        office = data.get("office")
        created_by_user_id = data.get("created_by_user_id")
        created_by_employee_id = data.get("created_by_employee_id")

        # Validate required fields
        if not county or not office:
            return {"message": "county and office are required"}, 400

        # At least one creator must be provided
        if not created_by_user_id and not created_by_employee_id:
            return {"message": "At least one of created_by_user_id or created_by_employee_id is required"}, 400

        new_location = LocationService.create_location(data)
        return {"message": "Location created", "location": new_location}, 201


class LocationDeleteResource(Resource):
    def delete(self, location_id):
        result, status = LocationService.soft_delete_location(location_id)
        return result, status
