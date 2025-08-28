from flask import request
from flask_restful import Resource
from services.category_service import CategoryService

class CategoryListResource(Resource):
    def get(self):
        categories = CategoryService.get_all_categories()
        return [cat.to_dict() for cat in categories], 200

    def post(self):
        data = request.get_json()
        try:
            category = CategoryService.create_category(data)
            return category.to_dict(), 201
        except ValueError as e:
            return {'error': str(e)}, 400


class CategoryResource(Resource):
    def get(self, category_id):
        category = CategoryService.get_category_by_id(category_id)
        if not category:
            return {'error': 'Category not found'}, 404
        return category.to_dict(), 200

    def put(self, category_id):
        data = request.get_json()
        try:
            updated = CategoryService.update_category(category_id, data)
            if not updated:
                return {'error': 'Category not found'}, 404
            return updated.to_dict(), 200
        except ValueError as e:
            return {'error': str(e)}, 400

    def delete(self, category_id):
        deleted = CategoryService.delete_category(category_id)
        if not deleted:
            return {'error': 'Category not found'}, 404
        return {'message': 'Category deleted successfully'}, 200
