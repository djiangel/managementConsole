import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import DemographicTargetByIdQuery from '../../graphql/queries/DemographicTargetByIdQuery';
import LoadingScreen from 'components/LoadingScreen';
import DemographicTargetEdit from './DemographicTargetEdit';
import DemographicTargetCard from './DemographicTargetCard';

const DemographicTarget = ({
  loading,
  ages,
  socioEcon,
  genders,
  regionTarget,
  countries,
  raceEthnicity,
  smokingHabits,
  name,
  match,
}) => {
  const [editing, setEditing] = React.useState(false);
  const id = parseInt(match.params.id);
  if (loading) {
    return <LoadingScreen />;
  }

  return editing ? (
    <DemographicTargetEdit
      id={id}
      genders={genders}
      ages={ages}
      countries={countries}
      ethnicities={raceEthnicity}
      smokingHabits={smokingHabits}
      socioEcon={socioEcon}
      regionTarget={regionTarget}
      name={name}
      handleClose={() => setEditing(false)}
    />
  ) : (
    <DemographicTargetCard
      genders={genders}
      ages={ages}
      countries={countries}
      raceEthnicity={raceEthnicity}
      smokingHabits={smokingHabits}
      socioEcon={socioEcon}
      regionTarget={regionTarget}
      name={name}
      handleEditPress={() => setEditing(true)}
    />
  );
};

export default compose(
  graphql(DemographicTargetByIdQuery, {
    options: ({ match }: any) => ({
      variables: {
        id: parseInt(match.params.id)
      },
      notifyOnNetworkStatusChange: true
    }),
    props: ({ data: { loading, demographicTarget } }: any) => ({
      loading,
      id: demographicTarget && demographicTarget.id,
      name: demographicTarget && demographicTarget.name,
      countries:
        demographicTarget &&
        demographicTarget.countries,
      ages:
        demographicTarget &&
        demographicTarget.ages &&
        demographicTarget.ages.split(','),
      raceEthnicity:
        demographicTarget &&
        demographicTarget.ethnicities &&
        demographicTarget.ethnicities.split(','),
      socioEcon:
        demographicTarget &&
        demographicTarget.socioEcon &&
        demographicTarget.socioEcon.split(','),
      regionTarget:
        demographicTarget &&
        demographicTarget.regionTarget &&
        demographicTarget.regionTarget.split(','),
      smokingHabits: demographicTarget && demographicTarget.smokingHabits,
      genders:
        demographicTarget &&
        demographicTarget.genders &&
        demographicTarget.genders.split(',')
    })
  })
)(DemographicTarget);
