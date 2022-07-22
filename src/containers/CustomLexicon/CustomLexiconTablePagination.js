import React, { Fragment, useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { COLORS } from '../../styles/theme';

const styles = {
  main: {
    textAlign: 'right',
    padding: 8,
    paddingLeft: 0,
    color: COLORS.MARINE
  },
  page: {
    border: '0.2px solid',
    padding: 8,
    cursor: 'pointer',
    borderColor: COLORS.MARINE,
    fontWeight: 'bold',
    borderRadius: '2.5px'
  }
};

const CustomLexiconTablePagination = ({
  currentPage,
  pages,
  setPage,
  pageLimit,
  classes
}) => {
  const [showPrevArrows, setShowPrevArrows] = useState(false);
  const [showNextArrows, setShowNextArrows] = useState(true);
  const numPages = Math.ceil(pages / pageLimit);

  const getPaginationNumbers = () => {
    const blocks = [];
    for (let i = 0; i < numPages; i++) {
      blocks.push(i);
    }
    return blocks;
  };

  useEffect(
    () => {
      if (currentPage === 0) {
        setShowPrevArrows(false);
        setShowNextArrows(true);
      }
      if (currentPage === numPages - 1) {
        setShowPrevArrows(true);
        setShowNextArrows(false);
      }
      if (currentPage === 0 && currentPage === numPages - 1) {
        setShowPrevArrows(false);
        setShowNextArrows(false);
      }
      if (currentPage > 0 && currentPage < numPages - 1) {
        setShowPrevArrows(true);
        setShowNextArrows(true);
      }
    },
    [pageLimit]
  );

  const setArrows = pageNum => {
    if (pageNum === numPages - 1) {
      setShowNextArrows(false);
    } else {
      setShowNextArrows(true);
    }
    if (pageNum === 0) {
      setShowPrevArrows(false);
    } else {
      setShowPrevArrows(true);
    }
  };

  const renderPageBlocks = () => {
    const getPageNumbers = getPaginationNumbers();
    return getPageNumbers.map(pageNum => (
      <a
        key={pageNum}
        className={classes.page}
        onClick={() => {
          setPage(pageNum);
          setArrows(pageNum);
        }}
        style={
          pageNum === currentPage
            ? { backgroundColor: COLORS.AQUA_MARINE, color: COLORS.WHITE }
            : { backgroundColor: COLORS.WHITE_FADED, color: COLORS.MARINE }
        }
      >
        {pageNum + 1}
      </a>
    ));
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setPage(currentPage - 1);
      setArrows(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < numPages - 1) {
      setPage(currentPage + 1);
      setArrows(currentPage + 1);
    }
  };

  const renderPrevPageBlocks = () => {
    return (
      <Fragment>
        <a
          key="first-page"
          className={classes.page}
          onClick={() => {
            setPage(0);
            setShowPrevArrows(false);
            setShowNextArrows(true);
          }}
        >
          &#171;
        </a>
        <a key="prev-page" className={classes.page} onClick={goToPrevPage}>
          &#8592;
        </a>
      </Fragment>
    );
  };

  const renderNextPageBlocks = () => {
    return (
      <Fragment>
        <a key="next-page" className={classes.page} onClick={goToNextPage}>
          &rarr;
        </a>
        <a
          key="last-page"
          className={classes.page}
          onClick={() => {
            setPage(numPages - 1);
            setShowNextArrows(false);
            setShowPrevArrows(true);
          }}
        >
          &raquo;
        </a>
      </Fragment>
    );
  };

  return (
    <div className={classes.main}>
      {showPrevArrows ? renderPrevPageBlocks() : null}
      {renderPageBlocks()}
      {showNextArrows ? renderNextPageBlocks() : null}
    </div>
  );
};

export default withStyles(styles)(CustomLexiconTablePagination);
