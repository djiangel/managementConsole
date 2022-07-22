import gql from 'graphql-tag';

export default gql`
  query PDFDownloadQuery($pdfName: String!, $reportType: String!) {
    pdfDownloadQuery(pdfName: $pdfName, reportType: $reportType)
  }
`;
