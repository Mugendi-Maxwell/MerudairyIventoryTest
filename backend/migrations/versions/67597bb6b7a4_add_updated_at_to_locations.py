"""add updated_at to locations

Revision ID: 67597bb6b7a4
Revises: f24ed2c679b5
Create Date: 2025-09-16 09:11:54.405485
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '67597bb6b7a4'
down_revision: Union[str, None] = 'f24ed2c679b5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("locations") as batch_op:
        batch_op.add_column(sa.Column("updated_at", sa.DateTime(), nullable=True))
        batch_op.alter_column("created_at", existing_type=sa.DateTime(), nullable=True)
        batch_op.create_foreign_key("fk_locations_user", "users", ["created_by_user_id"], ["id"])
        batch_op.create_foreign_key("fk_locations_employee", "employees", ["created_by_employee_id"], ["id"])


def downgrade() -> None:
    with op.batch_alter_table("locations") as batch_op:
        batch_op.drop_constraint("fk_locations_user", type_="foreignkey")
        batch_op.drop_constraint("fk_locations_employee", type_="foreignkey")
        batch_op.alter_column("created_at", existing_type=sa.DateTime(), nullable=False)
        batch_op.drop_column("updated_at")
