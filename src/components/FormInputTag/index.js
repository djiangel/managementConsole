import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { upperFirst } from 'lodash';
import './index.css';
import Tag from './Tag';
import MaterialButton from '../MaterialButton';

export default class FormInputTag extends Component {
  state = {
    disableTagInput: false
  };

  toggleDisableTagInput = () =>
    this.setState({ disableTagInput: !this.state.disableTagInput });

  handleFilterSuggestions = (textInputValue, possibleSuggestionArray) =>
    possibleSuggestionArray.filter(value =>
      value.label.toLowerCase().includes(textInputValue.toLowerCase())
    );

  handleDelete = i => {
    const { onChange, value } = this.props;
    onChange(value.filter((_, index) => index !== i));
  };

  handleAddition = tag => {
    const {
      defaultTags,
      onChange,
      value,
      suggestions,
      disableCustom,
      single
    } = this.props;
    const tags = this.props.value;
    const tagsToRender = defaultTags ? defaultTags : tags;
    let suggestion = suggestions.find(
      suggestion => suggestion.label.toLowerCase() === tag.label.toLowerCase()
    );

    if ((!suggestion && disableCustom) || (single && tagsToRender.length > 0))
      return;

    // prevent users from entering the same tag twice
    if (
      value.find(
        selectedTag =>
          selectedTag.label.toLowerCase() === tag.label.toLowerCase()
      )
    )
      return;

    onChange([
      ...value,
      suggestion
        ? suggestion
        : { label: tag.label.toLowerCase(), id: tag.id.toLowerCase() }
    ]);
    this.toggleDisableTagInput();
  };

  render() {
    const { defaultTags, uneditable, single, ...rest } = this.props;
    const { disableTagInput } = this.state;
    const tags = this.props.value;
    const tagsToRender = defaultTags ? defaultTags : tags;

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {uneditable || !disableTagInput ? (
          <ReactTags
            tags={tagsToRender}
            handleDelete={this.handleDelete}
            handleAddition={this.handleAddition}
            handleFilterSuggestions={this.handleFilterSuggestions}
            allowDragDrop={false}
            autofocus={false}
            inputFieldPosition="inline"
            labelField="label"
            readOnly={this.state.disableTagInput}
            minQueryLength={1}
            {...rest}
          />
        ) : (
          tagsToRender.map((e, index) => (
            <div key={`${e.label}_${index}`}>
              <Tag
                readOnly={false}
                label={e.label}
                onDelete={() => this.handleDelete(index)}
              />
            </div>
          ))
        )}
        {uneditable
          ? null
          : disableTagInput &&
            (!single || tagsToRender.length < 1) && (
              <MaterialButton
                onClick={this.toggleDisableTagInput}
                variant="outlined"
              >
                Add More
              </MaterialButton>
            )}
      </div>
    );
  }
}
