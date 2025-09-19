"""skip duplicate created_by_employee_id

Revision ID: 9ac966328f38
Revises: 634f8e2afd50
Create Date: 2025-09-15 09:38:51.994459
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '9ac966328f38'
down_revision: Union[str, None] = '634f8e2afd50'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Column already exists in the DB, so no-op
    pass


def downgrade():
    with op.batch_alter_table("locations", schema=None) as batch_op:
        batch_op.drop_column('created_by_employee_id')
