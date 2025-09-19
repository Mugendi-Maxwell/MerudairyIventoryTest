"""drop old created_by column from locations

Revision ID: 1dec2891a56a
Revises: d2da0899c444
Create Date: 2025-09-15 15:13:18.079292

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1dec2891a56a'
down_revision: Union[str, None] = 'd2da0899c444'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    with op.batch_alter_table("locations", schema=None) as batch_op:
        batch_op.drop_column("created_by")

def downgrade():
    with op.batch_alter_table("locations", schema=None) as batch_op:
        # If you ever downgrade, re-add the column
        batch_op.add_column(sa.Column("created_by", sa.String(100), nullable=True))
