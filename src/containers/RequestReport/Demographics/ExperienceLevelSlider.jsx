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

const experienceLevelSlider = ({ disabled, value, onChange, key }) => {
  const classes = useStyles();
  const allMarks = [1, 2, 3].map(mark => ({
    value: mark,
    label: mark
  }));

  allMarks[0].label = 'Low';
  allMarks[1].label = 'Medium';
  allMarks[2].label = 'High';

  return (
    <Slider
      step={1}
      min={1}
      max={3}
      marks={allMarks}
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

export default experienceLevelSlider;
