import React from 'react';
import { makeStyles } from '../../../material/index';
import { Slider } from '../../../material/index';
import { COLORS } from '../../../styles/theme';

const useStyles = makeStyles({
  root: {
    marginTop: '20px'
  },
  valueLabel: {
    top: -22,
    '& *': {
      background: 'transparent',
      color: COLORS.MARINE,
      fontSize: '14px'
    }
  },
  markLabel: {
    fontSize: '12px',
    color: COLORS.MARINE
  },
  thumb: {
    backgroundColor: COLORS.AQUA_MARINE
  },
  mark: {
    backgroundColor: COLORS.AQUA_MARINE
  }
});

const ageSlider = ({ disabled, value, onChange, key, ageCategory }) => {
  const classes = useStyles();
  const adultMarks = [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80].map(
    mark => ({
      value: mark,
      label: mark
    })
  );
  const childrenMarks = [8, 10, 12, 14, 16, 18, 20].map(mark => ({
    value: mark,
    label: mark
  }));
  const allMarks = [
    5,
    10,
    15,
    20,
    25,
    30,
    35,
    40,
    45,
    50,
    55,
    60,
    65,
    70,
    75,
    80
  ].map(mark => ({
    value: mark,
    label: mark
  }));

  return (
    <Slider
      step={ageCategory == 'Adult' ? 5 : 2}
      min={ageCategory == 'Adult' ? 20 : 8}
      max={ageCategory == 'Adult' ? 80 : 20}
      marks={ageCategory == 'Adult' ? adultMarks : childrenMarks}
      //min={5}
      //max={95}
      //marks={allMarks}
      valueLabelDisplay="on"
      value={value}
      onChange={(_event, newValue) => onChange(newValue)}
      disabled={disabled}
      classes={{
        valueLabel: classes.valueLabel,
        root: classes.root,
        markLabel: classes.markLabel,
        mark: classes.mark,
        thumb: classes.thumb
      }}
    />
  );
};

export default ageSlider;
