from flask_restful import Resource
from flask import request, jsonify
from services.locationService import LocationService


class LocationResource(Resource):
    def get(self):
        locations = LocationService.get_all_locations()
        return {"locations": locations}, 200

    def post(self):
        data = request.get_json()
        county = data.get("county")
        office = data.get("office")
        created_by = data.get("created_by")

        if not county or not office or not created_by:
            return {"message": "county, office, and created_by are required"}, 400

        new_location = LocationService.create_location(data)
        return {"message": "Location created", "location": new_location}, 201

    def delete(self):
        data = request.get_json()
        if not data or not data.get("id"):
            return {"message": "Location ID is required for deletion"}, 400

        result, status = LocationService.soft_delete_location(data["id"])
        return result, status
