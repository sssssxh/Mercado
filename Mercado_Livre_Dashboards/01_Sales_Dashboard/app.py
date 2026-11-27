"""Mercado Livre sales dashboard entrypoint."""

import pandas as pd
import streamlit as st

from sales_dashboard import components, filters, styles
from sales_dashboard.constants import DATA_PATH
from sales_dashboard.etl import load_sales


@st.cache_data
def load_data() -> pd.DataFrame:
    """Load and cache the cleaned sales frame."""
    return load_sales(DATA_PATH)


def main() -> None:
    """Compose sidebar, filters and dashboard sections."""
    st.set_page_config(
        page_title='Mercado Livre Sales Dashboard',
        page_icon='📊',
        layout='wide',
    )
    styles.inject_css()

    with st.sidebar:
        styles.render_sidebar_logo()
        st.divider()
        upload = st.file_uploader(
            'Import sales CSV',
            type=['csv'],
            help='Choose a Mercado Livre sales CSV to replace the data for this session. Remove it to restore the default data.',
        )
        if upload is None:
            st.session_state.pop('imported_sales', None)
            if not DATA_PATH.is_file():
                st.info('Choose a sales CSV above to open the dashboard.')
                st.stop()
            df = load_data()
            source_key = 'default'
        else:
            source_key = upload.file_id
            cached = st.session_state.get('imported_sales')
            if cached is None or cached[0] != source_key:
                try:
                    upload.seek(0)
                    df = load_sales(upload)
                except (ValueError, TypeError, KeyError, OverflowError) as exc:
                    st.error(f'Could not import this CSV: {exc}')
                    st.stop()
                st.session_state.imported_sales = (source_key, df)
            else:
                df = cached[1]
        st.markdown('##### Filters')
        selection = components.render_sidebar_filters(df, source_key)
        st.divider()
        st.caption('Developed by Renato Perussi')

    filtered = filters.apply_selection(df, selection)

    styles.render_hero()
    components.render_kpis(filtered)
    # Central empty guard prevents chart crashes.
    if filtered.empty:
        st.info('No data for selected filters.')
        return
    st.divider()
    components.render_sales_trend(filtered)
    components.render_seasonality(filtered)
    components.render_rankings(filtered)
    components.render_geography(filtered)
    components.render_full_table(filtered)


if __name__ == '__main__':
    main()
