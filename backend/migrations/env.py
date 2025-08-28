from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# Import your Flask app and db
import sys
import os

# Add your backend directory to sys.path so imports work
sys.path.append(os.path.abspath(os.path.join(os.getcwd(), 'backend')))

from services.extensions import db
from app import create_app  # Change 'app' to your actual main app module

# Create the Flask app and push the app context
app = create_app()
app.app_context().push()
from models.inventoryItem import InventoryItem  
from models.category import Category
from models.employees import Employees
from models.user import User
from models.returns import Returns 
from models.assignedEmployees import AssignedEmployee
from models.location import Location
from models.department import Department
from models.employees import Employees
from models.returns import Returns
from models.adminInvites import AdminInvite  

# Alembic Config object
config = context.config

# Set the SQLAlchemy URL from alembic.ini
# (Alternatively, you can set this dynamically from app.config)
if config.config_file_name is not None:
    fileConfig(config.config_file_name)


target_metadata = db.metadata

def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
