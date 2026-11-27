"""Project-wide constants: paths, column keys and parameters."""

import os
from pathlib import Path

# Base paths.
PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = Path(os.environ.get('MERCADO_SALES_CSV', PROJECT_ROOT.parents[1] / 'sales_2025.csv'))
LOGO_PATH = PROJECT_ROOT / 'assets' / 'logo.png'

# Raw dataset columns (Portuguese domain values from CSV header).
DATE_COLUMNS = [
    'Order date',
    'Dispatch date',
    'Delivery date',
]
INT_COLUMNS = ['Units', 'Closed claim']
STRING_COLUMNS = ['Order ID']
ABS_COLUMNS = [
    'Selling fees and taxes',
    'Shipping fees',
    'Cancellations and refunds (BRL)',
]

COL_REVENUE = 'Product revenue (BRL)'
COL_ADS = 'Ad-attributed sale'
COL_STATE = 'State'
COL_PRODUCT = 'Listing title'
COL_FLAVOR = 'Variant'
COL_ORDER_ID = 'Order ID'
COL_SALE_DATE = 'Order date'

# Derived temporal columns (English identifiers owned by ETL).
COL_YEAR_MONTH = 'year_month'
COL_YEAR = 'year'
COL_MONTH = 'month'
COL_DAY = 'day'
COL_HOUR = 'hour'
COL_MINUTE = 'minute'
COL_WEEKDAY = 'weekday'
COL_QUARTER = 'quarter'
COL_WEEKDAY_NAME = 'weekday_name'
COL_MONTH_NAME = 'month_name'

TEMPORAL_STR_COLUMNS = [
    COL_YEAR_MONTH,
    COL_WEEKDAY_NAME,
    COL_MONTH_NAME,
]

# Locale.
LOCALE_BR = 'pt_BR.UTF-8'

# Ranking size.
TOP_N = 10

# Advertising channel values (domain data).
ADS_YES = 'Yes'
ADS_NO = 'No'
