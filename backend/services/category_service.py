from models.category import Category
from services.extensions import db
from sqlalchemy.exc import IntegrityError

class CategoryService:
    @staticmethod
    def get_all_categories():
        return Category.query.all()

    @staticmethod
    def get_category_by_id(category_id):
        return Category.query.get(category_id)

    @staticmethod
    def create_category(data):
        new_category = Category(
            name=data.get('name'),
            description=data.get('description')
        )
        db.session.add(new_category)
        try:
            db.session.commit()
            return new_category
        except IntegrityError:
            db.session.rollback()
            raise ValueError("Category with this name already exists.")

    @staticmethod
    def update_category(category_id, data):
        category = Category.query.get(category_id)
        if not category:
            return None
        category.name = data.get('name', category.name)
        category.description = data.get('description', category.description)
        try:
            db.session.commit()
            return category
        except IntegrityError:
            db.session.rollback()
            raise ValueError("Category with this name already exists.")

    @staticmethod
    def delete_category(category_id):
        category = Category.query.get(category_id)
        if not category:
            return False
        db.session.delete(category)
        db.session.commit()
        return True
