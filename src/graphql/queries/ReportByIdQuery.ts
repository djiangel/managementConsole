import gql from 'graphql-tag';

export default gql`
query ReportById(
    $reportId: UUID!
  ) {
    report: reportJobByReportId(
      reportId: $reportId
    ) {
        id
        jobId
        parentJobId
        projectName
        reportType
        targetGroupName
        requestedThrough
        startedAt
        reportStatus
        reportId
        pdfEfsUri
        clientName
        passedQa
      }
    }
    `