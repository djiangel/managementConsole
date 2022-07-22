import gql from 'graphql-tag';

export default gql`
  query OptimizationReportByIdQuery($id: Int!){
    report: optimizationReportById(id: $id){
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
      constraintLevel
      gravityConstraint
      newRefFlavors
      versionNo
      rootId
      comment
      experienceRange
    }
  }
`;