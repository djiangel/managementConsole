import * as React from 'react';
import * as classnames from 'classnames';
import * as _ from 'lodash';
import { useQuery } from 'react-apollo-hooks';

import LoadingWrapper from 'components/LoadingWrapper';

import { SearchField } from './SearchField';
import { withTranslation } from 'react-i18next';
import Button from '../../components/Button';

const styles = require('./PanelCreate.module.css');

class AutoCompleteResults extends React.Component<any, any> {
  state = {
    selectedElement: 0
  };

  listener = ev => {
    const { selectedElement } = this.state;
    const { data, onClickResult, products } = this.props;

    const productsNotSelected = _.get(data, 'productResults.nodes', []).filter(
      d => products.find(p => p.id === d.id) === undefined
    );

    if (
      ev.key === 'ArrowDown' &&
      selectedElement < productsNotSelected.length
    ) {
      this.setSelectedElement(selectedElement + 1);
    } else if (ev.key === 'ArrowUp' && selectedElement > 0) {
      this.setSelectedElement(selectedElement - 1);
    } else if (ev.key == 'Enter') {
      ev.preventDefault();
      onClickResult(productsNotSelected[selectedElement]);
    }
  };

  componentDidMount() {
    const searchFieldEl = document.getElementById('search-field');
    if (searchFieldEl) {
      searchFieldEl.addEventListener('keydown', this.listener);
    }
  }

  componentWillUnmount() {
    const searchFieldEl = document.getElementById('search-field');
    if (searchFieldEl) {
      searchFieldEl.removeEventListener('keydown', this.listener);
    }
  }

  setSelectedElement = v => this.setState({ selectedElement: v });

  render() {
    const {
      value,
      data,
      listRef,
      onClickResult,
      products,
      onFetchMore,
      hasMore,
      productCount,
      loadSize
    } = this.props;
    const { selectedElement } = this.state;

    if (value === '') {
      return <div />;
    }

    const productsNotSelected = _.get(data, 'productResults.nodes', []).filter(
      d => products.find(p => p.id === d.id) === undefined
    );

    if (productsNotSelected.length <= 0) {
      const notFoundMsg = this.props.t('panel.productNotFound');
      return <p className={styles.productNotFoundText}>{notFoundMsg}</p>;
    }

    return (
      <ul className={styles.autoCompleteList} ref={listRef}>
        {productsNotSelected.map((d, idx) => (
            <div
              key={d.id}
              className={classnames(styles.autoCompleteListElement, {
                [styles.selectedAutoCompleteListElement]: selectedElement === idx
              })}
              onClick={() => {
                onClickResult(d);
              }}
            >
              {d.name} - {d.producer.name}
            </div>
        ))}
        <div className={styles.loadMoreProductsSection}>
          {value && hasMore ? (
            <Button
              className={styles.loadMoreProductsBtn}
              onClick={() => onFetchMore(productCount + loadSize)}
            >
              Load More Products
            </Button>
          ) : (
            value && <p>No More Products</p>
          )}
        </div>
      </ul>
    );
  }
}

interface AutoCompleteProps {
  query?: string;
  onClick?: (p: any) => void;
  products: any[];
  producerId: number;
  groupId?: number;
}

function AutoComplete(props: AutoCompleteProps) {
  const [value, setValue] = React.useState('');
  const [hasMore, setHasMore] = React.useState(true);
  const [prevCount, setPrevCount] = React.useState(0);

  const loadSize = 15; // Number of products loaded in each call.

  const { loading, error, data, refetch } = props.groupId
    ? useQuery<any>(props.query, {
        variables: {
          query: value,
          producerId: props.producerId,
          groupId: props.groupId,
          first: loadSize
        }
      })
    : useQuery<any>(props.query, {
        variables: {
          query: value,
          producerId: props.producerId,
          first: loadSize
        }
      });

  // Handle pressing esc key to clear search field
  React.useEffect(() => {
    const listener = ev => {
      if (value === '') {
        return;
      }

      if (ev.key === 'Escape') {
        setValue('');
        setHasMore(true);
      }
    };

    document.addEventListener('keydown', listener);

    return function cleanup() {
      document.removeEventListener('keydown', listener);
    };
  });

  // Handle clicking out of search field
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);
  React.useEffect(() => {
    const listener = (ev: MouseEvent) => {
      if (value === '') {
        return;
      }

      if (
        !(inputRef.current as any).contains(ev.target) &&
        !(listRef.current as any).contains(ev.target)
      ) {
        setValue('');
        setHasMore(true);
      }
    };

    document.addEventListener('mousedown', listener);

    return function cleanup() {
      document.removeEventListener('mousedown', listener);
    };
  });

  const onFetchMore = count => {
    setPrevCount(productCount);
    refetch({
      query: value,
      producerId: props.producerId,
      groupId: props.groupId,
      first: count
    }).then(() =>
      setHasMore(_.get(data, 'productResults.nodes', []).length > prevCount)
    );
  };

  const handleOnChange = value => {
    setValue(value);
    setHasMore(true);
  };

  const productCount = _.get(data, 'productResults.nodes', []).length;

  return (
    <div className={styles.container}>
      <SearchField
        onChange={handleOnChange}
        value={value}
        inputRef={inputRef}
      />
      {error && <span>{error}</span>}
      {value !== '' && (
        <LoadingWrapper
          loading={loading}
          onClickResult={v => {
            props.onClick(v);
            setValue('');
          }}
          value={value}
          listRef={listRef}
          data={data}
          products={props.products}
          onFetchMore={onFetchMore}
          productCount={productCount}
          hasMore={hasMore}
          loadSize={loadSize}
          Component={withTranslation()(AutoCompleteResults)}
        />
      )}
    </div>
  );
}

export default AutoComplete;
