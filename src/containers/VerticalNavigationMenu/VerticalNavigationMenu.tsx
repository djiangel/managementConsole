import * as React from 'react';
import { NavLink } from 'react-router-dom';
import VerticalNavigationMenu from '../../components/VerticalNavigationMenu';
import ProductFolderComponent from '../../containers/ProductFolder';
import * as MaterialIcons from '@material-ui/icons';
import {
  PANELS,
  PRODUCTS,
  USERS,
  REPORTS,
  CREATE_REVIEW,
  MANAGE_DEVICES,
  ADMIN,
  EDIT_REVIEW,
  REPORTS_QA,
  REPORT_DASHBOARD,
  DEMOGRAPHIC_TARGETS,
  CUSTOM_LEXICON
} from '../../constants/routePaths';
import { useTranslation } from 'react-i18next';
import { useState, Fragment } from 'react';

interface Props {
  className?: string;
  workspaceProducerId?: number;
  viewerRoleIsAdmin?: boolean;
  viewerRoleIsSuperadmin?: boolean;
}

const productSvg = require('../../../public/assets/navigation_bar/Products.svg');
const panelSvg = require('../../../public/assets/navigation_bar/Panels.svg');
const userSvg = require('../../../public/assets/navigation_bar/Users.svg');
const reportSvg = require('../../../public/assets/navigation_bar/Reports.svg');
const reviewSvg = require('../../../public/assets/navigation_bar/Review.svg');
const deviceSvg = require('../../../public/assets/navigation_bar/Devices.svg');

const renderItems = items => ({
  activeClassName,
  className,
  iconClassName,
  textClassName,
  accessoryClassName
}) =>
  items.map(item => {
    const Icon = () => {
      switch (item.iconName) {
        case 'productSvg':
          return (
            <img
              className={iconClassName}
              src={productSvg}
              alt="product-icon"
            />
          );

        case 'panelSvg':
          return (
            <img className={iconClassName} src={panelSvg} alt="panel-icon" />
          );

        case 'userSvg':
          return (
            <img className={iconClassName} src={userSvg} alt="user-icon" />
          );

        case 'reportSvg':
          return (
            <img className={iconClassName} src={reportSvg} alt="report-icon" />
          );

        case 'reviewSvg':
          return (
            <img className={iconClassName} src={reviewSvg} alt="review-icon" />
          );

        case 'deviceSvg':
          return (
            <img className={iconClassName} src={deviceSvg} alt="device-icon" />
          );

        default:
          const Icon = MaterialIcons[item.iconName];
          return <Icon className={iconClassName} />;
      }
    };

    return (
      <Fragment key={item.path}>
        <NavLink
          activeClassName={activeClassName}
          className={className}
          key={item.path}
          to={item.path}
          isActive={match => {
            if (match && item.subMenu) item.subMenu.changeState(true);
            if (!match && item.subMenu) item.subMenu.changeState(false);
            return !!match && !(match.url.includes('admin') && !match.isExact);
          }}
        >
          <div className={accessoryClassName} />
          {Icon()}
          <div className={textClassName}>{item.text}</div>
        </NavLink>
        {item.path === PRODUCTS &&
          item.subMenu &&
          item.subMenu.state && <ProductFolderComponent />}
      </Fragment>
    );
  });

const VerticalNavigationMenuContainer: React.FunctionComponent<Props> = ({
  className,
  workspaceProducerId,
  viewerRoleIsAdmin,
  viewerRoleIsSuperadmin
}) => {
  const { t } = useTranslation();
  const [productIsActive, setProductIsActive] = useState(false);

  let primaryMenuItems = [
    {
      path: PRODUCTS,
      iconName: 'productSvg',
      text: t('navigation.products'),
      subMenu: {
        state: productIsActive,
        changeState: state => setProductIsActive(state)
      }
    },
    { path: PANELS, iconName: 'panelSvg', text: t('navigation.panels') },
    { path: USERS, iconName: 'userSvg', text: t('navigation.users') },
    ...((viewerRoleIsAdmin || viewerRoleIsSuperadmin) &&
    (workspaceProducerId === 25 ||
      workspaceProducerId === 192 ||
      workspaceProducerId === 107 ||
      workspaceProducerId === 189 ||
      workspaceProducerId === 209)
      ? [
          {
            path: REPORTS,
            iconName: 'reportSvg',
            text: t('navigation.reports')
          }
        ]
      : []),
    ...(viewerRoleIsSuperadmin &&
    (workspaceProducerId === 25 ||
      workspaceProducerId === 192 ||
      workspaceProducerId === 107 ||
      workspaceProducerId === 189 ||
      workspaceProducerId === 209)
      ? [
          {
            path: REPORTS_QA,
            iconName: 'reportSvg',
            text: t('navigation.reportsQa')
          }
        ]
      : []),
    ...(viewerRoleIsSuperadmin
      ? [
          {
            path: CREATE_REVIEW,
            iconName: 'reviewSvg',
            text: t('navigation.reviews')
          }
        ]
      : []),
    ...(viewerRoleIsSuperadmin
      ? [
          {
            path: MANAGE_DEVICES,
            iconName: 'deviceSvg',
            text: t('navigation.devices')
          }
        ]
      : []),
    ...(viewerRoleIsSuperadmin &&
    (workspaceProducerId === 25 || workspaceProducerId === 192)
      ? [
          {
            path: ADMIN,
            iconName: 'deviceSvg',
            text: t('navigation.adminTools')
          }
        ]
      : []),
    ...(viewerRoleIsSuperadmin
      ? [
          {
            path: EDIT_REVIEW,
            iconName: 'reviewSvg',
            text: t('navigation.editReviews')
          }
        ]
      : []),
    ...((viewerRoleIsAdmin || viewerRoleIsSuperadmin) &&
    (workspaceProducerId === 25 || workspaceProducerId === 192)
      ? [
          {
            path: REPORT_DASHBOARD,
            iconName: 'reportSvg',
            text: 'Report Dashboard'
          }
        ]
      : []),
    ...((viewerRoleIsAdmin || viewerRoleIsSuperadmin) &&
    (workspaceProducerId === 25 || workspaceProducerId === 192)
      ? [
          {
            path: DEMOGRAPHIC_TARGETS,
            iconName: 'reportSvg',
            text: t('navigation.demographicTargets')
          }
        ]
      : []),
    ...(viewerRoleIsSuperadmin
      ? [
          {
            path: CUSTOM_LEXICON,
            iconName: 'reviewSvg',
            text: t('navigation.customLexicons')
          }
        ]
      : []),
  ];

  const secondaryMenuItems = [];
  const settingsMenuItems = [];

  return (
    <div className={className}>
      <VerticalNavigationMenu renderItems={renderItems(primaryMenuItems)} />
      <VerticalNavigationMenu renderItems={renderItems(secondaryMenuItems)} />
      <VerticalNavigationMenu renderItems={renderItems(settingsMenuItems)} />
    </div>
  );
};

VerticalNavigationMenuContainer.displayName = 'VerticalNavigationMenuContainer';

export default VerticalNavigationMenuContainer;
