import gql from 'graphql-tag';

export default gql`
  query MarketSurveyReportSearchQuery($query: String, $first: Int, $producerId: Int) {
    marketSurveyReportResults: searchMarketSurveyReport(
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