import React, { Component } from 'react';
import formatDate from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import LayoutMetricsGroup from '../../components/LayoutMetricsGroup';
import LayoutSectionHeader from '../../components/LayoutSectionHeader';
import Metric from '../../components/Metric';

const dateFormat = 'MMM Do, YYYY';

type Props = {
  name: string,
  primaryProductClass: ?string,

  usersCount: number,
  userProductReviewsCount: number,
  productsCount: number,

  createdAt: string,
  updatedAt: string
};

export default class DashboardContainer extends Component {
  props: Props;

  render() {
    const {
      name,
      primaryProductClass,

      usersCount,
      userProductReviewsCount,
      productsCount,

      createdAt,
      updatedAt
    } = this.props;

    return (
      <div>
        <LayoutSectionHeader>
          <h1>{name}</h1>
          <h3>
            Created on {formatDate(parseISO(createdAt), dateFormat)} and last
            updated on {formatDate(parseISO(updatedAt), dateFormat)}.
          </h3>
        </LayoutSectionHeader>
        <LayoutMetricsGroup>
          <Metric title="Product Reviews by Users">
            <h1>{userProductReviewsCount || 'none'}</h1>
          </Metric>
          <Metric title="Products">
            <h1>{productsCount || 'none'}</h1>
          </Metric>
          <Metric status="neutral" title="Users">
            <h1>{usersCount || 'none'}</h1>
          </Metric>
          <Metric status="neutral" title="Primary Product Class">
            <h1>{primaryProductClass || 'unspecified'}</h1>
          </Metric>
        </LayoutMetricsGroup>
      </div>
    );
  }
}
