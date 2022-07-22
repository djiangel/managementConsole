import { handleEditPanel } from '../handleEditPanel';
import graphqlClient from 'consumers/graphqlClient';
import moment from 'moment';

describe('handleEditPanel', () => {
  beforeEach(() => {
    graphqlClient.query = jest.fn();
    graphqlClient.mutate = jest.fn();
  });

  afterEach(() => {
    graphqlClient.query.mockRestore();
    graphqlClient.mutate.mockRestore();
  });

  it('should allow removing products from a panel', async () => {
    await handleEditPanel(
      1,
      1,
      {
        products: [{ panelProductId: 2 }],
        originalProducts: [{ panelProductId: 1 }],
        startTime: moment(),
        endTime: moment(),
        blindPanel: false,
        blindLabels: {},
        public: false,
        panelTags: [],
        originalPanelTags: [],
        behavioralQuestions: {},
        oldBehavioralQuestions: {},
        workspaceName: ''
      },
      {
        setSubmitting: () => {}
      }
    );

    // makes a mutation to delete product 1
    expect(graphqlClient.mutate.mock.calls[1][0].variables.panelProductId).toBe(
      1
    );
  });

  // it('should update panel product attributes', async () => {
  //   await handleEditPanel(
  //     1,
  //     1,
  //     {
  //       products: [{ panelProductId: 1, blindLabel: 'bar' }],
  //       originalProducts: [{ panelProductId: 1, blindLabel: 'foo' }],
  //       startTime: moment(),
  //       endTime: moment(),
  //       blindPanel: true,
  //       blindLabels: { 1: 'bar' },
  //       public: false,
  //       panelTags: [],
  //       originalPanelTags: []
  //     },
  //     {
  //       setSubmitting: () => {}
  //     }
  //   );

  //   expect(
  //     graphqlClient.mutate.mock.calls[1][0].variables.input.blindLabel
  //   ).toBe('bar');
  // });

  // it('should allow adding products to a panel', async () => {
  //   await handleEditPanel(
  //     1,
  //     1,
  //     {
  //       products: [{ panelProductId: 1 }, { id: 2 }],
  //       originalProducts: [{ panelProductId: 1 }],
  //       startTime: moment(),
  //       endTime: moment(),
  //       blindPanel: false,
  //       blindLabels: {},
  //       public: false,
  //       panelTags: [],
  //       originalPanelTags: [],
  //       behavioralQuestions: {},
  //       oldBehavioralQuestions: {}
  //     },
  //     {
  //       setSubmitting: () => {}
  //     }
  //   );

  //   expect(
  //     graphqlClient.mutate.mock.calls[1][0].variables.input.productId
  //   ).toBe(2);
  // });
});
