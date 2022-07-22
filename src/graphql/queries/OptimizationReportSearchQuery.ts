import gql from 'graphql-tag';

export default gql`
  query OptimizationReportSearchQuery($query: String, $first: Int, $producerId: Int) {
    optimizationReportResults: searchOptimizationReport(
      query: $query
      first: $first
      _producerId: $producerId
    ){
      nodes{
        id
        userId
        projectName
        selectedCountries
        selectedAges
        selectedEthnicities
        selectedGenders
        selectedSmokingHabits
        selectedSocioEcon
        selectedRegionTarget
        submittedOn

        user: userByUserId {
          name
        }
      }
      totalCount
    }
  }
`