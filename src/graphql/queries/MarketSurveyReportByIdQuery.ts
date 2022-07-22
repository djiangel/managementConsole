import gql from 'graphql-tag';

export default gql`
  query MarketSurveyReportByIdQuery($id: Int!){
    report: marketSurveyReportById(id: $id){
      id
      userId
      producerId
      projectName
      client
      demographic
      status
      selectedAges
      selectedEthnicities
      selectedCountries
      selectedGenders
      selectedSmokingHabits
      selectedRegionTarget
      selectedSocioEcon
      pdfLink
      submittedOn
      completedOn
      productIds
      includeTexture
      versionNo
      rootId
      comment
      experienceRange
      renamedProducts
    }
  }
`;