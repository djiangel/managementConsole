export const APP_ROOT = '/';
export const ADMIN = '/admin';
export const CREATE_REVIEW = '/admin/create-review';
export const EDIT_REVIEW = '/admin/edit-review';
export const ADMIN_DATA_EXPLORER = '/admin/data-explorer';
export const PRODUCT_FILTER = '/admin/product-filter';
export const GROUP_WORKSPACES = '/admin/group-workspaces';

export const AUTHENTICATION = '/sign-in';

export const MANAGE_DEVICES = '/admin/manage-devices';
export const ADD_DEVICES = `/admin/${MANAGE_DEVICES}/add`;

export const BATCHES = '/batches';
export const BATCH = `${BATCHES}/:batchId`;
export const BATCH_PRODUCT_REVIEWS = `${BATCHES}/:batchId`;
export const BATCH_STATE_OVERVIEW = '/';

export const DASHBOARD = '/dashboard';
export const HOME = '/';
export const SELECT_WORKSPACE = '/select-workspace';

export const FOREIGN_DATA = '/foreign-data';

export const LOGS = '/logs';

export const PANELS = '/panels';
export const PANELS_EXPIRED = '/panels-expired';
export const PANEL_CREATE = '/panels/new';
export const PANEL = `${PANELS}/:panelId`;
export const PANEL_EDIT = `${PANEL}/edit`;
export const DATA_QUALITY_DASHBOARD = `${PANEL}/data-quality-dashboard`;
export const PANEL_PRODUCT_REVIEWS = `${PANEL}/product-reviews`;
export const PANEL_USERS = `${PANEL}/users`;
export const PANEL_SEARCH = `/panels-search/:query/:startTime/:endTime`;

export const PRODUCER_ROOT = '/';
export const PRODUCTS = '/products';
export const PRODUCT_CREATE = '/products/new';
export const PRODUCT = `${PRODUCTS}/:productId`;
export const PRODUCT_BATCHES = `${PRODUCT}/batches`;
export const PRODUCT_PRODUCT_REVIEWS = `${PRODUCT}/product-reviews`;

export const REPORTS = '/admin/reports';
export const REPORT = `${REPORTS}/:reportType/:reportId`;
export const REQUEST_REPORT = '/admin/reports/new';
export const REPORTS_QA = '/admin/reports-qa';
export const REPORT_DASHBOARD = '/admin/report-dashboard';

export const ADD_DEMOGRAPHIC_TARGET = '/demographic-target/new';
export const DEMOGRAPHIC_TARGETS = '/demographic-targets';
export const DEMOGRAPHIC_TARGET = '/demographic-target/:id';

export const PRODUCT_REVIEWS = '/product-reviews';
export const PRODUCT_REVIEW = `${PRODUCT_REVIEWS}/:reviewId`;

export const SETTINGS = '/settings';

export const SUPPORT = '/support';

export const TRUSTED_ADVISOR = '/trusted-advisor';

export const USERS = '/users';
export const USER = `${USERS}/:username`;
export const USER_PRODUCT_REVIEWS = `${USER}/product-reviews`;
export const CREATE_USER = '/admin/create-user';
export const USERS_DEMOGRAPHIC = '/admin/users-demographic';

export const PANELISTS = '/panelists';

export const LANGUAGES = '/languages';
export const NOTIFICATION = '/notification';

export const CUSTOM_LEXICON = '/admin/custom-lexicon';
