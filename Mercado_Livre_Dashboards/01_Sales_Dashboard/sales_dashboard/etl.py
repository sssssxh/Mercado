"""ETL pipeline: load, coerce types and derive temporal columns."""

from pathlib import Path
from typing import BinaryIO

import pandas as pd

from .constants import (
    ABS_COLUMNS,
    COL_SALE_DATE,
    DATE_COLUMNS,
    INT_COLUMNS,
    STRING_COLUMNS,
    TEMPORAL_STR_COLUMNS,
)


def _to_datetime(df: pd.DataFrame, columns: list[str]) -> pd.DataFrame:
    """Coerce columns to datetime."""
    return df.assign(**{c: pd.to_datetime(df[c]) for c in columns})


def _to_nullable_int(df: pd.DataFrame, columns: list[str]) -> pd.DataFrame:
    """Coerce columns to nullable integer."""
    return df.assign(**{c: df[c].astype('Int64') for c in columns})


def _to_string(df: pd.DataFrame, columns: list[str]) -> pd.DataFrame:
    """Coerce columns to string."""
    return df.assign(**{c: df[c].astype(str) for c in columns})


def _to_absolute(df: pd.DataFrame, columns: list[str]) -> pd.DataFrame:
    """Apply abs to fee and refund columns."""
    return df.assign(**{c: df[c].abs() for c in columns})


def _add_temporal_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Derive English temporal and logistics delta columns."""
    base = df['Order date']
    transit = df['Dispatch date'] - base
    delivery = df['Delivery date'] - df['Dispatch date']
    total = df['Delivery date'] - base
    return df.assign(
        year_month=base.dt.to_period('M').astype(str),
        year=base.dt.year,
        month=base.dt.month,
        day=base.dt.day,
        hour=base.dt.hour,
        minute=base.dt.minute,
        weekday=base.dt.weekday,
        quarter=base.dt.quarter,
        weekday_name=base.dt.day_name(),
        month_name=base.dt.month_name(),
        transit_days=transit.dt.days,
        transit_hours=transit.dt.seconds // 3600,
        transit_minutes=(transit.dt.seconds % 3600) // 60,
        delivery_days=delivery.dt.days,
        delivery_hours=delivery.dt.seconds // 3600,
        delivery_minutes=(delivery.dt.seconds % 3600) // 60,
        total_days=total.dt.days,
        total_hours=total.dt.seconds // 3600,
        total_minutes=(total.dt.seconds % 3600) // 60,
    )


def load_sales(path: Path | BinaryIO) -> pd.DataFrame:
    """Load raw CSV and return a cleaned frame sorted by sale date."""
    from .english_values import label
    df = pd.read_csv(path, dtype={'N.º de venda': str, 'Order ID': str}).rename(columns={'# de anúncio': 'Listing ID',
 'Cancelamentos e reembolsos (BRL)': 'Cancellations and refunds (BRL)',
 'Data a caminho completa': 'Dispatch date',
 'Data da venda': 'Order date',
 'Data de entrega completa': 'Delivery date',
 'Descrição do status': 'Status description',
 'Em mediação': 'In mediation',
 'Estado': 'State',
 'Forma de entrega': 'Shipping method',
 'ID_Cliente': 'Customer ID',
 'N.º de venda': 'Order ID',
 'Pacote de diversos produtos': 'Multi-item package',
 'País': 'Country',
 'Preço unitário de venda do anúncio (BRL)': 'Unit price (BRL)',
 'Receita por envio (BRL)': 'Shipping revenue (BRL)',
 'Receita por produtos (BRL)': 'Product revenue (BRL)',
 'Reclamação aberta': 'Open claim',
 'Reclamação encerrada': 'Closed claim',
 'SKU': 'SKU',
 'Status': 'Status',
 'Tarifa de venda e impostos': 'Selling fees and taxes',
 'Tarifas de envio': 'Shipping fees',
 'Tipo de anúncio': 'Listing type',
 'Total (BRL)': 'Total (BRL)',
 'Título do anúncio': 'Listing title',
 'Unidades': 'Units',
 'Variação': 'Variant',
 'Venda por publicidade': 'Ad-attributed sale'})
    required = set(DATE_COLUMNS + INT_COLUMNS + STRING_COLUMNS + ABS_COLUMNS) | {
        'Product revenue (BRL)', 'Ad-attributed sale', 'State', 'Listing title', 'Variant',
    }
    missing = required.difference(df.columns)
    if missing:
        raise ValueError('Missing columns: ' + ', '.join(sorted(missing)))
    if df.empty or df[COL_SALE_DATE].isna().any():
        raise ValueError('Each order must have an order date.')
    for col in ['State', 'Listing title', 'Variant', 'Ad-attributed sale']:
        df[col] = df[col].fillna('Unspecified').astype(str)
    df['Product revenue (BRL)'] = pd.to_numeric(df['Product revenue (BRL)'], errors='raise')
    if not df['Product revenue (BRL)'].between(-float('inf'),float('inf'),inclusive='neither').all():
        raise ValueError('Product revenue must be a finite number for every order.')
    for col in df.select_dtypes(include=["object", "string"]).columns:
        df[col] = df[col].map(label)
    df = _to_datetime(df, DATE_COLUMNS)
    df = _to_string(df, STRING_COLUMNS)
    df = _to_nullable_int(df, INT_COLUMNS)
    df = _to_absolute(df, ABS_COLUMNS)
    df = _add_temporal_columns(df)
    df[COL_SALE_DATE] = df[COL_SALE_DATE].dt.date
    df = _to_string(df, TEMPORAL_STR_COLUMNS)
    return df.sort_values(COL_SALE_DATE).reset_index(drop=True)
